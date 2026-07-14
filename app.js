const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const json = JSON.parse(body);
                const text = json.request.command;
            } catch (e) {
                // ошибка
            }
            res.end();
        });
    } else {
        res.end('Bot is running');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
