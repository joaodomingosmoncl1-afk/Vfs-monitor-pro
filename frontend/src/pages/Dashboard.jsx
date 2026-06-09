import React, { useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import useEventsStore from '../stores/eventsStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const { events, stats, fetchEvents, fetchStats } = useEventsStore();

  useEffect(() => {
    if (token) {
      fetchEvents(token, { limit: 50 });
      fetchStats(token);
    }
  }, [token, fetchEvents, fetchStats]);

  const getStatusBadge = (status) => {
    return (
      <span className={`badge badge-${status}`}>
        {status === 'available' ? '✅ Disponível' : '❌ Sem vagas'}
      </span>
    );
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>🌍 VFS Monitor Pro</h1>
          <div className="navbar-right">
            <span className="user-email">{user?.email}</span>
            <button onClick={logout} className="btn-logout">Sair</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          {stats && stats.length > 0 && stats.map((stat) => (
            <div key={stat.route} className="stat-card">
              <h3>{stat.route === 'br' ? '🇧🇷 Brasil → Portugal' : '🇵🇹 Portugal → Brasil'}</h3>
              <div className="stat-value">{stat.available || 0}</div>
              <p className="stat-label">Vagas disponíveis (últimos 7 dias)</p>
              <small>Última verificação: {new Date(stat.last_check).toLocaleString('pt-PT')}</small>
            </div>
          ))}
        </div>

        <div className="events-section">
          <h2>📋 Histórico de Eventos</h2>
          <div className="events-table">
            <table>
              <thead>
                <tr>
                  <th>Rota</th>
                  <th>Status</th>
                  <th>Mensagem</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event.id}>
                      <td>
                        {event.route === 'br' ? '🇧🇷 Brasil → Portugal' : '🇵🇹 Portugal → Brasil'}
                      </td>
                      <td>{getStatusBadge(event.status)}</td>
                      <td>{event.message}</td>
                      <td>{new Date(event.created_at).toLocaleString('pt-PT')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state">Nenhum evento registado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
