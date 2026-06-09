# VFS Monitor Pro

Aplicação de monitorização de vagas de visto VFS (Brasil ↔ Portugal).

## 📋 Estrutura do Projeto

```
vfs-monitor-pro/
├── backend/
│   ├── src/
│   │   ├── index.js                    # Servidor principal
│   │   ├── routes/
│   │   │   ├── auth.js                 # Autenticação OTP
│   │   │   ├── events.js               # Eventos de monitorização
│   │   │   ├── stats.js                # Estatísticas
│   │   │   └── user.js                 # Perfil do utilizador
│   │   └── services/
│   │       └── email.js                # Envio de emails
│   ├── db/
│   │   └── schema.sql                  # Schema PostgreSQL
│   ├── package.json
│   ├── README.md
│   └── .env.example
├── workers/
│   ├── monitorWorker.js                # Monitor de vagas
│   ├── package.json
│   └── README.md
└── README.md
```

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install
npm start
```

### 2. Worker

```bash
cd workers
npm install
npm start
```

## 🔑 Tecnologias

- **Backend**: Node.js + Express + Socket.io
- **Database**: PostgreSQL
- **Cache**: Redis
- **Worker**: Playwright + Node.js
- **Auth**: JWT + OTP por Email

## 📌 Próximas Etapas

- [ ] Frontend (React/Vue)
- [ ] Sistema de notificações (Email + Push)
- [ ] Dashboard com gráficos
- [ ] Alertas em tempo real
- [ ] Deploy em produção

## 📝 Licença

MIT
