const express = require("express");
const app = express ();
app.use(express.json());
const sqlite3 = require('sqlite3').verbose();
let sql; 

const db = new sqlite3.Database('./tasks.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

//create table
// sql = `CREATE TABLE Users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password_hash TEXT)`;
// db.run(sql);

// sql = `CREATE TABLE Tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, status TEXT, assignee_id INTEGER, created_at DATETIME, updated_at DATETIME, FOREIGN KEY(assignee_id) REFERENCES Users(id))`;
// db.run(sql);

app.post("/tasks", async(request, response) => {
    const taskDetails = request.body;
    const {
        id, title, description, status, assignee_id, created_at, updated_at} = taskDetails;
    
    const addTaskQuery = `INSERT INTO tasks(id, title, description, status, assignee_id, created_at, updated_at) 
    VALUES(${id}, '${title}', '${description}', '${status}', ${assignee_id}, '${created_at}', '${updated_at}' );`;
    const dbResponse = await db.run(addTaskQuery);
    const taskId = dbResponse.lastId;
    response.send({id: taskId});
});

app.get('/tasks', async(request, response) => {
    const { taskId } = request.params;
    const getTaskQuery = `SELECT * FROM tasks;`;
    const tasksArray = await db.all(getTaskQuery);
    response.send(tasksArray);
});

app.get('/tasks/:id', async(request, response) => {
    const { taskId } = request.params;
    const getTask = `SELECT * FROM tasks WHERE id = ${taskId};`;
    const tasksArray = await db.all(getTask);
    response.send(tasksArray);
});

app.put("/tasks/:id", async(request, response) => {
    const {taskId} = request.params;
    const taskDetails = request.body;
    const {
        id, title, description, status, assignee_id, created_at, updated_at} = taskDetails;
    
    const updateTaskQuery = `UPDATE tasks 
    SET id = ${id}, title='${title}', description ='${description}', status='${status}', assignee_id = ${assignee_id}, created_at='${created_at}', updated_at= '${updated_at}' WHERE id = ${taskId} ;`;
    const dbResponse = await db.run(addTaskQuery);
    await db.run(updateTaskQuery);
    response.send("Task updated");
});

app.delete("/tasks/:id", async(request, response) => {
    const { taskId } = request.params;
    const deleteTask = `DELETE FROM tasks WHERE id = ${taskId};`;
    await db.run(deleteTask);
    response.send("Book Deleted");
});
app.listen(3000);