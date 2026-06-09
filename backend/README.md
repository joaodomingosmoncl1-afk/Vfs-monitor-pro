# VFS Monitor Pro Backend

## Configuração

### 1. Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto `backend/`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vfs_monitor

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=sua_chave_secreta_muito_longa_e_complexa

# Email (Gmail)
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app_gmail

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000

# Worker
BACKEND_URL=http://localhost:3001
```

### 2. Criar Banco de Dados PostgreSQL

```bash
psql -U postgres
CREATE DATABASE vfs_monitor;
```

Depois execute o schema:
```bash
psql -U postgres -d vfs_monitor -f backend/db/schema.sql
```

### 3. Instalar Dependências

```bash
cd backend
npm install
```

### 4. Iniciar Backend

```bash
npm start
```

O servidor estará disponível em `http://localhost:3001`

## Endpoints da API

### Autenticação
- `POST /api/auth/request-otp` - Solicitar código OTP
- `POST /api/auth/verify` - Verificar OTP e fazer login

### Eventos
- `GET /api/events` - Listar eventos do utilizador
- `GET /api/events/stats` - Estatísticas de eventos

### Estatísticas
- `GET /api/stats` - Estatísticas gerais
- `GET /api/stats/by-route` - Estatísticas por rota

### Utilizador
- `GET /api/user/profile` - Obter perfil
- `PUT /api/user/profile` - Atualizar perfil
- `PUT /api/user/notifications` - Configurar notificações

## Troubleshooting

**Erro: `ECONNREFUSED` no Redis/PostgreSQL**
- Certifique-se que os serviços estão a correr
- Redis: `redis-server`
- PostgreSQL: `pg_ctl start`

**Erro: `Email not sending`**
- Use senha de app do Gmail (não a senha da conta)
- Ative "Less secure app access" ou use 2FA + app password
