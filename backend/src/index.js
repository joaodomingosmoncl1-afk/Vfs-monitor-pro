require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const { createClient } = require('redis');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const statsRoutes = require('./routes/stats');
const userRoutes = require('./routes/user');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const db = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

app.set('db', db);
app.set('redis', redis);
app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Backend on port ${PORT}`));
