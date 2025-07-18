// src/pages/Admin.js

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const Admin = () => {
  const [dashboards, setDashboards] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [linkPowerBi, setLinkPowerBi] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const fetchDashboards = async () => {
      try {
        const { data, error } = await supabase
          .from('dashboards')
          .select('*')
          .order('criado_em', { ascending: false });

        if (error) {
          showMessage('Erro ao carregar dashboards: ' + error.message, 'error');
        } else {
          setDashboards(data || []);
        }
      } catch (err) {
        showMessage('Erro inesperado ao carregar dashboards', 'error');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUser();
    fetchDashboards();
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleCreateDashboard = async (e) => {
    e.preventDefault();
    
    if (!nome.trim() || !descricao.trim()) {
      showMessage('Nome e descrição são obrigatórios', 'error');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('dashboards')
        .insert([{ 
          nome: nome.trim(), 
          descricao: descricao.trim(), 
          link_power_bi: linkPowerBi.trim() || null 
        }])
        .select()
        .single();

      if (error) {
        showMessage('Erro ao criar dashboard: ' + error.message, 'error');
      } else {
        setDashboards([data, ...dashboards]);
        setNome('');
        setDescricao('');
        setLinkPowerBi('');
        showMessage('Dashboard criado com sucesso!', 'success');
      }
    } catch (err) {
      showMessage('Erro inesperado ao criar dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDashboard = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este dashboard?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('dashboards')
        .delete()
        .eq('id', id);

      if (error) {
        showMessage('Erro ao excluir dashboard: ' + error.message, 'error');
      } else {
        setDashboards(dashboards.filter(d => d.id !== id));
        showMessage('Dashboard excluído com sucesso!', 'success');
      }
    } catch (err) {
      showMessage('Erro inesperado ao excluir dashboard', 'error');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="fade-in">
      <div className="app-header">
        <div className="app-logo">⚙️ Painel Administrativo</div>
        <div className="user-info">
          <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
            Admin: {user?.email}
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

      <div className="admin-container">
        {message && (
          <div className={`alert alert-${messageType}`}>
            {message}
          </div>
        )}

        <div className="admin-form">
          <h2 className="section-title">Cadastrar Novo Dashboard</h2>
          
          <form onSubmit={handleCreateDashboard}>
            <div className="form-group">
              <label className="form-label" htmlFor="nome">
                Nome do Dashboard *
              </label>
              <input
                id="nome"
                type="text"
                className="form-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Vendas Q1 2024"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="descricao">
                Descrição *
              </label>
              <textarea
                id="descricao"
                className="form-input"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o que este dashboard apresenta..."
                rows="3"
                required
                disabled={loading}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="linkPowerBi">
                Link do Power BI (opcional)
              </label>
              <input
                id="linkPowerBi"
                type="url"
                className="form-input"
                value={linkPowerBi}
                onChange={(e) => setLinkPowerBi(e.target.value)}
                placeholder="https://app.powerbi.com/..."
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-success btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Criando...
                </>
              ) : (
                '+ Criar Dashboard'
              )}
            </button>
          </form>
        </div>

        <div className="admin-list">
          <h3 className="section-title">Dashboards Cadastrados</h3>
          
          {fetchLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : dashboards.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3 className="empty-state-title">Nenhum dashboard cadastrado</h3>
              <p className="empty-state-description">
                Crie seu primeiro dashboard usando o formulário acima.
              </p>
            </div>
          ) : (
            <ul className="dashboard-list">
              {dashboards.map((dashboard) => (
                <li key={dashboard.id} className="dashboard-list-item">
                  <div className="dashboard-list-item-content">
                    <h4 className="dashboard-list-item-title">{dashboard.nome}</h4>
                    <p className="dashboard-list-item-description">{dashboard.descricao}</p>
                    {dashboard.link_power_bi && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--success-600)', marginTop: '0.25rem' }}>
                        ✓ Link configurado
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteDashboard(dashboard.id)}
                    className="btn btn-secondary"
                    style={{ 
                      background: 'var(--error-50)', 
                      color: 'var(--error-600)',
                      border: '1px solid var(--error-200)'
                    }}
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Novo painel de permissões por dashboard */}
        <DashboardAccessPanel />
      </div>
    </div>
  );
};

// Novo painel de permissões por dashboard
const DashboardAccessPanel = () => {
  const [dashboards, setDashboards] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardUsers, setDashboardUsers] = useState({}); // {dashboardId: [userId, ...]}
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userToAdd, setUserToAdd] = useState({}); // {dashboardId: userId}

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: dashboardsData } = await supabase.from('dashboards').select('id, nome');
      setDashboards(dashboardsData || []);
      const { data: usersData } = await supabase.from('usuarios').select('id, email');
      setUsers(usersData || []);
      // Buscar permissões de todos os dashboards
      const { data: permissions } = await supabase.from('user_dashboard_permissions').select('dashboard_id, user_id');
      const dashUsers = {};
      (dashboardsData || []).forEach(dash => {
        dashUsers[dash.id] = (permissions || [])
          .filter(p => p.dashboard_id === dash.id)
          .map(p => p.user_id);
      });
      setDashboardUsers(dashUsers);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAddUser = async (dashboardId) => {
    const userId = userToAdd[dashboardId];
    if (!userId) return;
    setLoading(true);
    await supabase
      .from('user_dashboard_permissions')
      .insert([{ user_id: userId, dashboard_id: dashboardId }]);
    setDashboardUsers(prev => ({
      ...prev,
      [dashboardId]: [...(prev[dashboardId] || []), userId]
    }));
    setUserToAdd(prev => ({ ...prev, [dashboardId]: '' }));
    setMessage('Usuário adicionado!');
    setLoading(false);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleRemoveUser = async (dashboardId, userId) => {
    setLoading(true);
    await supabase
      .from('user_dashboard_permissions')
      .delete()
      .eq('user_id', userId)
      .eq('dashboard_id', dashboardId);
    setDashboardUsers(prev => ({
      ...prev,
      [dashboardId]: (prev[dashboardId] || []).filter(id => id !== userId)
    }));
    setMessage('Usuário removido!');
    setLoading(false);
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="admin-permissions">
      <h3 className="section-title">Gerenciar Permissões de Dashboards</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        dashboards.map(dash => (
          <div key={dash.id} className="dashboard-permission-block" style={{marginBottom: 32, border: '1px solid #eee', borderRadius: 8, padding: 16}}>
            <h4 style={{marginBottom: 8}}>{dash.nome}</h4>
            <div>
              <strong>Usuários com acesso:</strong>
              <ul>
                {(dashboardUsers[dash.id] || []).map(userId => {
                  const user = users.find(u => u.id === userId);
                  return (
                    <li key={userId} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      {user ? user.email : userId}
                      <button
                        onClick={() => handleRemoveUser(dash.id, userId)}
                        className="btn btn-secondary"
                        style={{marginLeft: 8}}
                        disabled={loading}
                      >Remover</button>
                    </li>
                  );
                })}
              </ul>
              <div className="form-group" style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 8}}>
                <select
                  className="form-input"
                  value={userToAdd[dash.id] || ''}
                  onChange={e => setUserToAdd(prev => ({ ...prev, [dash.id]: e.target.value }))}
                  disabled={loading}
                >
                  <option value="">-- Escolha um usuário --</option>
                  {users
                    .filter(u => !(dashboardUsers[dash.id] || []).includes(u.id))
                    .map(u => (
                      <option key={u.id} value={u.id}>{u.email}</option>
                    ))}
                </select>
                <button
                  onClick={() => handleAddUser(dash.id)}
                  className="btn btn-primary"
                  disabled={loading || !(userToAdd[dash.id])}
                >Adicionar</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Admin;