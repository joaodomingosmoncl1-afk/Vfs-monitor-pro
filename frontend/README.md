# VFS Monitor Pro - Frontend

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie `.env`:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

### 3. Iniciar Aplicação

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📱 Funcionalidades

- ✅ Autenticação com OTP por email
- ✅ Dashboard com estatísticas em tempo real
- ✅ Histórico de eventos de monitorização
- ✅ Filtros por rota e status
- ✅ Interface responsiva (mobile-first)

## 📁 Estrutura

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── Auth.css
│   │   └── Dashboard.css
│   ├── stores/
│   │   ├── authStore.js
│   │   └── eventsStore.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🔧 Build para Produção

```bash
npm run build
```

Os ficheiros compilados estarão em `build/`

## 📦 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Fazer upload da pasta 'build' no Netlify
```

## 🐛 Troubleshooting

**Erro: CORS bloqueado**
- Certifique-se que o backend está rodando em `http://localhost:3001`
- Verifique `REACT_APP_API_URL` no `.env`

**Erro: Socket.io não conecta**
- Backend deve ter Socket.io habilitado
- Verifique `REACT_APP_WS_URL`
