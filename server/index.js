import { createServer } from './app.js';

const PORT = process.env.PORT || 3000;

const server = createServer();
server.listen(PORT, () => {
  console.log(`BENGA ENVIOS server running at http://localhost:${PORT}`);
});
