// src/pages/Login.js

import React, { useState } from 'react';
import supabase from '../services/supabase'; // Importando o cliente Supabase

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Erro no login: ' + error.message);
    } else {
      // Armazenando o token JWT (opcional)
      const jwtToken = data?.access_token;
      console.log('Token JWT:', jwtToken);

      // Chame o callback para login bem-sucedido
      onLoginSuccess(data.user);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Login;
