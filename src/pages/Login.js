// src/pages/Login.js

import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Buscar o papel real do usuário na tabela usuarios
        let userRole = 'user';
        if (data.user && data.user.id) {
          const { data: usuarioData } = await supabase
            .from('usuarios')
            .select('role_id')
            .eq('id', data.user.id)
            .single();
          if (usuarioData && usuarioData.role_id) {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('nome')
              .eq('id', usuarioData.role_id)
              .single();
            if (roleData && roleData.nome) {
              userRole = roleData.nome;
            }
          }
        }
        onLoginSuccess({ ...data.user, role: userRole });
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setError('Cadastro realizado! Verifique seu e-mail para confirmar.');
        setIsSignUp(false); // Volta para login após cadastro
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card fade-in">
        <div className="card-header">
          <h1 className="title">Dashboard Analytics</h1>
          <p className="subtitle">{isSignUp ? 'Cadastre-se para acessar seus dashboards' : 'Faça login para acessar seus dashboards'}</p>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  {isSignUp ? 'Cadastrando...' : 'Entrando...'}
                </>
              ) : (
                isSignUp ? 'Cadastrar' : 'Entrar'
              )}
            </button>
          </form>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              className="btn btn-link"
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? 'Já tem conta? Faça login'
                : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;