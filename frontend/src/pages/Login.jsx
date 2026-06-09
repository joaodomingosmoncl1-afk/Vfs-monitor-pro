import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';
import './Auth.css';

export default function Login() {
  const [step, setStep] = useState('email'); // email | otp
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const { requestOTP, verifyOTP, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Insira um email válido');
      return;
    }
    try {
      await requestOTP(email);
      toast.success('Código enviado para seu email!');
      setStep('otp');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao solicitar código');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      toast.error('Insira um código de 6 dígitos');
      return;
    }
    try {
      await verifyOTP(email, code);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Código inválido');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🌍 VFS Monitor Pro</h1>
        <p className="subtitle">Monitore vagas de visto em tempo real</p>

        {step === 'email' && (
          <form onSubmit={handleRequestOTP}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Enviando...' : 'Solicitar Código'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="code">Código OTP (6 dígitos)</label>
              <input
                id="code"
                type="text"
                maxLength="6"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                disabled={loading}
              />
              <small>Código enviado para {email}</small>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="btn-secondary"
            >
              Voltar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
