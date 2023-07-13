require('dotenv').config();
const { createServer, ServerResponse } = require('http');
const app = require('./app');

const PORT = process.env.PORT ?? 3000;

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`http server running on http://localhost:${PORT}`);
})