import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate } from 'uuid';

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

let users: User[] = [];

const sendResponse = (res: ServerResponse, statusCode: number, data: any) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const getRequestBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const getAllUsers = (res: ServerResponse) => {
  sendResponse(res, 200, users);
};

export const getUserById = (id: string, res: ServerResponse) => {
  const isValid = validate(id);
  if (!isValid)
    sendResponse(res, 400, { message: 'Invalid Id' });
  else {
    const user = users.find((u) => u.id === id);
    if (user) {
      sendResponse(res, 200, user);
    } else {
      sendResponse(res, 404, { message: 'User not found' });
    }
  }
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { username, age, hobbies } = await getRequestBody(req);

    if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
      sendResponse(res, 400, { message: 'Invalid input data' });
      return;
    }

    const newUser: User = {
      id: uuidv4(),
      username,
      age,
      hobbies,
    };

    users.push(newUser);
    sendResponse(res, 201, newUser);
  } catch (error) {
    sendResponse(res, 400, { message: 'Invalid JSON data' });
  }
};

export const updateUser = async (id: string, req: IncomingMessage, res: ServerResponse) => {
  try {
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      sendResponse(res, 404, { message: 'User not found' });
      return;
    }

    const { username, age, hobbies } = await getRequestBody(req);

    if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
      sendResponse(res, 400, { message: 'Invalid input data' });
      return;
    }

    users[userIndex] = { id, username, age, hobbies };
    sendResponse(res, 200, users[userIndex]);
  } catch (error) {
    sendResponse(res, 400, { message: 'Invalid JSON data' });
  }
};

export const deleteUser = (id: string, res: ServerResponse) => {
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    sendResponse(res, 404, { message: 'User not found' });
  } else {
    users.splice(userIndex, 1);
    sendResponse(res, 204, null);
  }
};
