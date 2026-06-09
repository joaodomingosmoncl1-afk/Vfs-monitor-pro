const { chromium } = require('playwright');
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const MONITOR_INTERVAL = process.env.MONITOR_INTERVAL || 30000;

async function checkRoute(route) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let status = 'error', message = '';
  
  try {
    const url = route === 'br' 
      ? 'https://visa.vfsglobal.com/bra/pt/prt/login'
      : 'https://visa.vfsglobal.com/prt/pt/bra/login';
    
    await page.goto(url, { timeout: 20000 });
    const html = await page.content();
    const lower = html.toLowerCase();
    
    const hasAvailable = lower.includes('book appointment') || lower.includes('agendar') || lower.includes('available slot');
    const hasNoSlots = lower.includes('no appointment') || lower.includes('sem vagas');
    
    if (hasAvailable && !hasNoSlots) { 
      status = 'available'; 
      message = 'Vaga disponível'; 
    } else { 
      status = 'unavailable'; 
      message = 'Sem vagas'; 
    }
  } catch (err) { 
    message = err.message; 
    console.error(`Erro ao verificar ${route}:`, err);
  } finally { 
    await browser.close(); 
  }
  
  try {
    await pool.query(
      'INSERT INTO events (route, status, message) VALUES ($1, $2, $3)',
      [route, status, message]
    );
  } catch (dbErr) {
    console.error('Erro ao salvar evento:', dbErr);
  }
  
  try {
    await axios.post(`${BACKEND_URL}/api/internal/event`, { route, status, message });
  } catch (e) {
    console.log('Backend notificação falhou (esperado se offline)');
  }
  
  console.log(`[${new Date().toISOString()}] ${route} -> ${status}`);
}

async function loop() {
  while (true) {
    try {
      await Promise.all([checkRoute('br'), checkRoute('pt')]);
    } catch (err) {
      console.error('Erro na iteração:', err);
    }
    await new Promise(r => setTimeout(r, MONITOR_INTERVAL));
  }
}

console.log(`Worker iniciado. Intervalo: ${MONITOR_INTERVAL}ms`);
loop();
