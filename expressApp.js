import express from 'express';

const app = express();
const PORT = 4000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Sample Employee Tasks (At least 3 records)
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Database Schema Design",
        assignedTo: "Anita Roy",
        status: "Completed",
        priority: "High"
    },
    {
        id: 3,
        taskName: "Configure CI/CD Pipeline",
        assignedTo: "Vikas Kumar",
        status: "In Progress",
        priority: "Medium"
    }
];

// GET /tasks - Retrieve all employee tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET /tasks/:id - Retrieve a task by ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: `Task with ID ${taskId} not found` });
    }
    res.status(200).json(task);
});

// POST /tasks - Add a new task
app.post('/tasks', (req, res) => {
    const { id, taskName, assignedTo, status, priority } = req.body;

    if (!id || !taskName || !assignedTo || !status || !priority) {
        return res.status(400).json({ message: "Invalid request: missing required fields." });
    }

    const existingTask = tasks.find(t => t.id === id);
    if (existingTask) {
        return res.status(400).json({ message: `Task with ID ${id} already exists.` });
    }

    const newTask = { id, taskName, assignedTo, status, priority };
    tasks.push(newTask);

    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });
});

// PUT /tasks/:id - Update task details
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: `Task with ID ${taskId} not found` });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    // Update fields
    tasks[taskIndex] = {
        id: taskId,
        taskName: taskName || tasks[taskIndex].taskName,
        assignedTo: assignedTo || tasks[taskIndex].assignedTo,
        status: status || tasks[taskIndex].status,
        priority: priority || tasks[taskIndex].priority
    };

    res.status(200).json({
        message: "Task updated successfully",
        task: tasks[taskIndex]
    });
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: `Task with ID ${taskId} not found` });
    }

    tasks.splice(taskIndex, 1);

    res.status(200).json({ message: `Task with ID ${taskId} deleted successfully` });
});

// Handle Invalid Routes
app.use((req, res) => {
    res.status(404).json({ message: "Route Not Found" });
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});