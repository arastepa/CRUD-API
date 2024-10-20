import { createServer, IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from './users';

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || '';
  const method = req.method || '';
  const idMatch = url.match(/^\/users\/([a-zA-Z0-9-]+)$/);
  
  if (url === '/users' && method === 'GET') {
    getAllUsers(res);
  } else if (idMatch && method === 'GET') {
    const userId = idMatch[1];
    getUserById(userId, res);
  } else if (url === '/users' && method === 'POST') {
    createUser(req, res);
  } else if (idMatch && method === 'PUT') {
    const userId = idMatch[1];
    updateUser(userId, req, res);
  } else if (idMatch && method === 'DELETE') {
    const userId = idMatch[1];
    deleteUser(userId, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
