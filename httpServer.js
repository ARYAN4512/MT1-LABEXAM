import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;

// Resolve directory name for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory Task Array
let tasks = [
    { id: 1, taskName: "Setup Database", assignedTo: "Rahul Sharma", status: "Completed" },
    { id: 2, taskName: "Design Dashboard", assignedTo: "Priya Singh", status: "Pending" }
];

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // Route: GET /
    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Employee Task Management Application</h1>');
    }
    // Route: GET /tasks
    else if (method === 'GET' && url === '/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    }
    // Route: GET /about
    else if (method === 'GET' && url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h2>About: Employee Task Management Application built using Node.js HTTP & FS modules.</h2>');
    }
    // Route: GET /home (Serve HTML using FS module)
    else if (method === 'GET' && url === '/home') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error: Unable to read file' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    // Route: POST /add-task
    else if (method === 'POST' && url === '/add-task') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newTask = JSON.parse(body);

                // Validation
                if (!newTask.id || !newTask.taskName || !newTask.assignedTo || !newTask.status) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Validation Error: Required fields (id, taskName, assignedTo, status) missing." }));
                }

                tasks.push(newTask);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Task added successfully', task: newTask }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON payload format' }));
            }
        });
    }
    // 404 Not Found Handling
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});