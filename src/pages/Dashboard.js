// src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import supabase from '../services/supabase'; // Importando o cliente Supabase

const Dashboard = () => {
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    const fetchDashboards = async () => {
      const { data, error } = await supabase
        .from('dashboards')
        .select('id, nome, descricao, link_power_bi')
        .eq('user_id', supabase.auth.user().id); // Ajuste para pegar dashboards do usuário logado.

      if (error) {
        alert('Erro ao buscar dashboards: ' + error.message);
      } else {
        setDashboards(data);
      }
    };

    fetchDashboards();
  }, []);

  return (
    <div>
      {dashboards.map((dashboard) => (
        <div key={dashboard.id}>
          <h3>{dashboard.nome}</h3>
          <p>{dashboard.descricao}</p>
          <iframe
            src={dashboard.link_power_bi}
            width="600"
            height="400"
            title={dashboard.nome}
          ></iframe>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
