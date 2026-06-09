# VFS Monitor Pro - Worker

## Configuração do Worker

O worker é um serviço que monitora continuamente as vagas VFS.

### Variáveis de Ambiente

Crie `.env` em `workers/`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/vfs_monitor
BACKEND_URL=http://localhost:3001
MONITOR_INTERVAL=30000
```

### Instalar Dependências

```bash
cd workers
npm install
```

### Iniciar Worker

```bash
npm start
```

## Como Funciona

1. A cada 30 segundos, o worker acessa as páginas de login VFS
2. Verifica se há vagas disponíveis usando keywords
3. Salva o status na base de dados
4. Notifica o backend via POST

### Rotas Monitoradas

- **BR**: https://visa.vfsglobal.com/bra/pt/prt/login (Brasil → Portugal)
- **PT**: https://visa.vfsglobal.com/prt/pt/bra/login (Portugal → Brasil)

### Publicar em Produção

O worker pode ser deployado em:
- Railway, Render, Heroku (com Playwright buildpack)
- AWS Lambda (com layer do Playwright)
- VPS dedicado
