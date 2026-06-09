const { chromium } = require('playwright');
const { Pool } = require('pg');
const axios = require('axios');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

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
    const has = lower.includes('book appointment') || lower.includes('agendar') || lower.includes('available slot');
    const no = lower.includes('no appointment') || lower.includes('sem vagas');
    if (has && !no) { status = 'available'; message = 'Vaga disponível'; }
    else { status = 'unavailable'; message = 'Sem vagas'; }
  } catch (err) { message = err.message; }
  finally { await browser.close(); }
  await pool.query('INSERT INTO events (route, status, message) VALUES ($1, $2, $3)', [route, status, message]);
  await axios.post(`${BACKEND_URL}/api/internal/event`, { route, status, message }).catch(e=>console.log);
  console.log(`${route} -> ${status}`);
}

async function loop() {
  while (true) {
    await Promise.all([checkRoute('br'), checkRoute('pt')]);
    await new Promise(r => setTimeout(r, 30000));
  }
}
loop();
