# Guia de Setup e Deploy - VFS Monitor Pro

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Git

---

## 🔧 Setup Local

### 1. Clonar o Repositório

```bash
git clone https://github.com/joaodomingosmoncl1-afk/Vfs-monitor-pro.git
cd Vfs-monitor-pro
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
```

**Editar `.env`:**
```env
DATABASE_URL=postgresql://postgres:senha@localhost:5432/vfs_monitor
REDIS_URL=redis://localhost:6379
JWT_SECRET=gerar_uma_chave_aleatoria_minimo_32_caracteres
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app_gmail
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Criar Base de Dados:**

```bash
# Linux/Mac
psql -U postgres -c "CREATE DATABASE vfs_monitor;"
psql -U postgres -d vfs_monitor -f db/schema.sql

# Windows (PowerShell)
psql -U postgres -c "CREATE DATABASE vfs_monitor;"
psql -U postgres -d vfs_monitor -f db/schema.sql
```

**Iniciar Backend:**

```bash
npm start
# Backend rodando em http://localhost:3001
```

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env
npm install
```

**Editar `.env`:**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

**Iniciar Frontend:**

```bash
npm start
# Frontend rodando em http://localhost:3000
```

### 4. Setup Worker

```bash
cd workers
cp .env.example .env
npm install
```

**Editar `.env`:**
```env
DATABASE_URL=postgresql://postgres:senha@localhost:5432/vfs_monitor
BACKEND_URL=http://localhost:3001
MONITOR_INTERVAL=30000
```

**Iniciar Worker:**

```bash
npm start
# Worker começará a monitorizar vagas a cada 30 segundos
```

---

## 🚀 Deploy em Produção

### Opção 1: Railway (Recomendado - Simples)

#### Deploy Backend + Worker

1. **Criar conta em [railway.app](https://railway.app)**

2. **Conectar GitHub**
   - Fazer push para seu repositório
   - Railway detecta automaticamente

3. **Backend:**
   ```bash
   railway init
   # Selecionar Node.js
   railway link
   railway up
   ```

4. **Configurar Variáveis:**
   - Ir em "Variables" no dashboard
   - Adicionar todas as variáveis do `.env`
   - Certificar que DATABASE_URL e REDIS_URL apontam aos serviços Railway

5. **Worker (Serviço Separado):**
   - Criar novo projeto Railway
   - Mesmo processo mas com comando: `cd workers && npm install && npm start`

#### Deploy Frontend

```bash
# Vercel (Mais fácil)
cd frontend
npm install -g vercel
vercel
```

---

### Opção 2: Vercel + Render + Railway

#### Frontend - Vercel

1. Fazer push para GitHub
2. Ir em [vercel.com](https://vercel.com)
3. Selecionar repositório
4. Configurar variáveis de ambiente:
   ```
   REACT_APP_API_URL=https://seu-backend.railway.app/api
   ```
5. Deploy automático

#### Backend - Render

1. Ir em [render.com](https://render.com)
2. Selecionar "New" > "Web Service"
3. Conectar GitHub
4. Configurar:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
5. Adicionar variáveis de ambiente
6. Deploy

#### Database - Railway ou Render

**Railway:**
1. Criar novo projeto
2. Selecionar "PostgreSQL"
3. Copiar CONNECTION STRING → `DATABASE_URL`

**Redis:**
1. No mesmo projeto Railway, adicionar "Redis"
2. Copiar CONNECTION URL → `REDIS_URL`

---

### Opção 3: Docker (Para Equipas)

Criar `docker-compose.yml` na raiz:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: senha_segura
      POSTGRES_DB: vfs_monitor
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:senha_segura@postgres:5432/vfs_monitor
      REDIS_URL: redis://redis:6379
      JWT_SECRET: chave_secreta_muito_longa
      EMAIL_USER: seu_email@gmail.com
      EMAIL_PASS: sua_senha_app
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001/api

  worker:
    build: ./workers
    environment:
      DATABASE_URL: postgresql://postgres:senha_segura@postgres:5432/vfs_monitor
      BACKEND_URL: http://backend:3001
    depends_on:
      - postgres
      - backend

volumes:
  postgres_data:
```

**Iniciar:**

```bash
docker-compose up
```

---

## 📧 Configurar Email Gmail

1. Ir em [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Gerar "App Password" para Gmail
3. Copiar a senha de 16 caracteres
4. Usar em `EMAIL_PASS` no `.env`

---

## 🔑 Gerar JWT_SECRET Seguro

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📱 Variáveis de Ambiente por Ambiente

### Desenvolvimento (localhost)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/vfs_monitor
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev_secret_12345678901234567890
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_app_password
PORT=3001
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

### Produção (Railway/Vercel)
```env
DATABASE_URL=postgresql://user:pass@railway.app:5432/db
REDIS_URL=redis://railway.app:6379
JWT_SECRET=prod_secret_muito_longo_aleatorio_32_chars_minimo
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_app_password
PORT=3001
FRONTEND_URL=https://seu-app.vercel.app
BACKEND_URL=https://seu-backend.railway.app
```

---

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED" PostgreSQL
```bash
# Iniciar PostgreSQL
# macOS (Homebrew)
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
```

### Erro: "Redis connection refused"
```bash
# Iniciar Redis
redis-server
```

### Erro: "CORS bloqueado"
- Verificar `FRONTEND_URL` no backend
- Verificar `REACT_APP_API_URL` no frontend
- Certificar que CORS está ativado no backend

### Worker não envia eventos
- Verificar logs: `npm start`
- Certificar que BACKEND_URL está correto
- Verificar conectividade com base de dados

---

## 📊 Monitorizar em Produção

### Railway
- Dashboard em https://railway.app
- Ver logs, métricas, consumo de recursos

### Vercel
- Dashboard em https://vercel.com
- Análise de performance, edge functions

### Database Backups
```bash
# Backup PostgreSQL
pg_dump -U postgres -d vfs_monitor > backup.sql

# Restaurar
psql -U postgres -d vfs_monitor < backup.sql
```

---

## ✅ Checklist de Deploy

- [ ] Database criada em produção
- [ ] Redis configurado
- [ ] Variáveis de ambiente definidas
- [ ] Email (Gmail) configurado
- [ ] JWT_SECRET gerado (mínimo 32 caracteres)
- [ ] Backend deployado e respondendo
- [ ] Frontend deployado e conectando ao backend
- [ ] Worker deployado e monitorando
- [ ] Testes de ponta a ponta (login, monitorização)
- [ ] SSL/HTTPS ativado (automático em Railway/Vercel)
- [ ] Backups configurados
- [ ] Monitoragem e alertas ativados

---

## 💬 Suporte

Para problemas específicos, consulte os READMEs individuais:
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Worker: `workers/README.md`
