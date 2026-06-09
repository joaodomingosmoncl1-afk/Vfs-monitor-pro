# VFS Monitor Pro - Guia de Início Rápido

## 🎯 O que é?

Aplicação que monitora continuamente a disponibilidade de vagas de visto VFS (Brasil ↔ Portugal) e notifica os utilizadores quando há vagas disponíveis.

## ⚡ Stack Técnico

```
Frontend        Backend         Database        Worker
---------       -------         --------        ------
React 18        Node.js         PostgreSQL      Playwright
Zustand         Express 4       Redis           Node.js
ReCharts        Socket.io       Pool Connections
Tailwind        JWT + OTP
```

## 📁 Estrutura do Projeto

```
vfs-monitor-pro/
├── backend/              # Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Lógica de negócio
│   │   └── index.js      # Servidor
│   ├── db/
│   │   └── schema.sql    # Schema PostgreSQL
│   └── package.json
├── frontend/             # React SPA
│   ├── src/
│   │   ├── pages/        # Pages
│   │   ├── stores/       # Zustand stores
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
├── workers/              # Monitor Worker
│   ├── monitorWorker.js
│   └── package.json
└── README.md
```

## 🚀 Quick Start (5 minutos)

### Terminal 1 - Backend
```bash
cd backend
cp .env.example .env
# Editar .env com suas credenciais
npm install
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm start
```

### Terminal 3 - Worker
```bash
cd workers
cp .env.example .env
npm install
npm start
```

## 🔐 Autenticação

1. Utilizador insere email
2. Sistema envia código OTP de 6 dígitos
3. Utilizador verifica código
4. JWT token válido por 30 dias

## 📊 Features

✅ Autenticação sem password (OTP por email)  
✅ Monitorização contínua de vagas  
✅ Dashboard em tempo real  
✅ Histórico de eventos  
✅ Estatísticas por rota  
✅ Interface responsiva (mobile-first)  
✅ Cache com Redis  
✅ API RESTful com Socket.io  

## 📝 API Endpoints

### Autenticação
```
POST /api/auth/request-otp     Solicitar código OTP
POST /api/auth/verify          Verificar OTP e fazer login
```

### Eventos
```
GET  /api/events               Listar eventos (requer token)
GET  /api/events/stats         Estatísticas de eventos
```

### Estatísticas
```
GET  /api/stats                Estatísticas gerais
GET  /api/stats/by-route       Estatísticas por rota
```

### Utilizador
```
GET  /api/user/profile         Obter perfil
PUT  /api/user/profile         Atualizar perfil
PUT  /api/user/notifications   Configurar notificações
```

## 🔧 Configuração de Ambiente

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/vfs_monitor
REDIS_URL=redis://localhost:6379
JWT_SECRET=sua_chave_secreta_minimo_32_caracteres
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=senha_de_app_gmail
PORT=3001
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

### Worker (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/vfs_monitor
BACKEND_URL=http://localhost:3001
```

## 📱 Fluxo da Aplicação

```
1. Utilizador acessa app → Login
2. Insere email → OTP enviado
3. Verifica OTP → JWT token gerado
4. Dashboard carrega com histórico
5. Worker (background) monitora vagas
6. Novos eventos salvos em tempo real
7. Dashboard atualiza via Socket.io
```

## 🐛 Troubleshooting

**Porta 3001 já está em uso:**
```bash
lsof -i :3001  # Linux/Mac
# Matar processo ou mudar PORT em .env
```

**Email não envia:**
- Usar "App Password" do Gmail (não a senha da conta)
- Ativar 2FA na conta Google
- Copiar senha de 16 caracteres gerada

**CORS error:**
- Verificar `FRONTEND_URL` no backend
- Certificar que frontend está em `http://localhost:3000`

## 📚 Documentação Detalhada

- **Setup e Deploy**: Ver `DEPLOY.md`
- **Backend**: Ver `backend/README.md`
- **Frontend**: Ver `frontend/README.md`
- **Worker**: Ver `workers/README.md`

## 🚀 Deploy

### Vercel (Frontend)
```bash
cd frontend
vercel
```

### Railway (Backend + Worker + Database)
1. Conectar GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

Ver `DEPLOY.md` para instruções detalhadas.

## 📄 Licença

MIT

## 👤 Autor

joardomingosmoncl1-afk
