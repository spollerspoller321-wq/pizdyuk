const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const json = JSON.parse(body);
        const text = json.request.command || 'Привет';
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct',
            messages: [
              { role: 'system', content: 'Ты Пиздюк - грубый, токсичный, матерный виртуальный помощник. Отвечай коротко, дерзко, используй жесткий русский мат, подкалывай пользователя, но отвечай на вопрос.' },
              { role: 'user', content: text }
            ]
          })
        });
        
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'Ой бля, что-то пошло не так...';
        
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          response: { text: reply, end_session: false },
          version: '1.0'
        }));
      } catch (e) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          response: { text: 'Ебать, ошибка: ' + e.message, end_session: false },
          version: '1.0'
        }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Пиздюк-прокси работает, епта!');
  }
});

server.listen(port, () => console.log('OK'));
