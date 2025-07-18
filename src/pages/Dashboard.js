// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const Dashboard = () => {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Buscar papel do usuário
        const { data: usuarioData } = await supabase
          .from('usuarios')
          .select('role_id')
          .eq('id', user.id)
          .single();
        let isAdmin = false;
        if (usuarioData && usuarioData.role_id) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('nome')
            .eq('id', usuarioData.role_id)
            .single();
          if (roleData && roleData.nome === 'admin') {
            isAdmin = true;
          }
        }
        if (isAdmin) {
          fetchAllDashboards();
        } else {
          fetchDashboards(user.id);
        }
      } else {
        setLoading(false);
      }
    };

    const fetchAllDashboards = async () => {
      try {
        const { data, error } = await supabase
          .from('dashboards')
          .select('*')
          .order('criado_em', { ascending: false });
        if (error) {
          setDashboards([]);
        } else {
          setDashboards(data || []);
        }
      } catch {
        setDashboards([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchDashboards = async (userId) => {
      try {
        // Buscar dashboards permitidos para o usuário
        const { data: permissions, error: permError } = await supabase
          .from('user_dashboard_permissions')
          .select('dashboard_id')
          .eq('user_id', userId);
        if (permError) {
          setDashboards([]);
          setLoading(false);
          return;
        }
        const dashboardIds = (permissions || []).map(p => p.dashboard_id);
        if (dashboardIds.length === 0) {
          setDashboards([]);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('dashboards')
          .select('*')
          .in('id', dashboardIds)
          .order('criado_em', { ascending: false });
        if (error) {
          setDashboards([]);
        } else {
          setDashboards(data || []);
        }
      } catch (err) {
        setDashboards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleViewDashboard = (dashboard) => {
    setSelectedDashboard(dashboard);
  };

  const handleBackToDashboards = () => {
    setSelectedDashboard(null);
  };

  if (selectedDashboard) {
    return (
      <div className="fade-in">
        <div className="app-header">
          <div className="app-logo">📊 {selectedDashboard.nome}</div>
          <div className="user-info">
            <button 
              onClick={handleBackToDashboards}
              className="btn btn-secondary"
            >
              ← Voltar
            </button>
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="dashboard-container">
          <div style={{ marginBottom: '1rem' }}>
            <h2 className="section-title">{selectedDashboard.nome}</h2>
            <p style={{ color: 'var(--gray-600)' }}>{selectedDashboard.descricao}</p>
          </div>
          
          {selectedDashboard.link_power_bi ? (
            <iframe
              src={selectedDashboard.link_power_bi}
              className="powerbi-embed"
              title={selectedDashboard.nome}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3 className="empty-state-title">Dashboard não configurado</h3>
              <p className="empty-state-description">
                O link do Power BI ainda não foi configurado para este dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="app-header">
        <div className="app-logo">📊 Dashboard Analytics</div>
        <div className="user-info">
          <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
            {user?.email}
          </span>
          <div className="user-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Sair
          </button>
        </div>
      </div>
      
      <div className="dashboard-container">
        <h2 className="section-title">Seus Dashboards</h2>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : dashboards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📈</div>
            <h3 className="empty-state-title">Nenhum dashboard encontrado</h3>
            <p className="empty-state-description">
              Entre em contato com o administrador para configurar seus dashboards.
            </p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {dashboards.map((dashboard) => (
              <div key={dashboard.id} className="dashboard-card">
                <h3 className="dashboard-card-title">{dashboard.nome}</h3>
                <p className="dashboard-card-description">{dashboard.descricao}</p>
                <button
                  onClick={() => handleViewDashboard(dashboard)}
                  className="btn btn-primary"
                >
                  Visualizar Dashboard
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;