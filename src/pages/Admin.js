// src/pages/Admin.js

import React, { useState, useEffect } from 'react';
import supabase from '../services/supabase'; // Importando o cliente Supabase

const Admin = () => {
  const [dashboards, setDashboards] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [linkPowerBi, setLinkPowerBi] = useState('');

  useEffect(() => {
    const fetchDashboards = async () => {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*');

      if (error) {
        alert(error.message);
      } else {
        setDashboards(data);
      }
    };

    fetchDashboards();
  }, []);

  const handleCreateDashboard = async () => {
    const { data, error } = await supabase
      .from('dashboards')
      .insert([{ nome, descricao, link_power_bi: linkPowerBi }]);

    if (error) {
      alert(error.message);
    } else {
      setDashboards([...dashboards, data[0]]);
    }
  };

  return (
    <div>
      <h2>Cadastrar Novo Dashboard</h2>
      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
      <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" />
      <input type="url" value={linkPowerBi} onChange={(e) => setLinkPowerBi(e.target.value)} placeholder="Link do Power BI" />
      <button onClick={handleCreateDashboard}>Cadastrar</button>

      <h3>Dashboards Cadastrados</h3>
      <ul>
        {dashboards.map((dashboard) => (
          <li key={dashboard.id}>{dashboard.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
