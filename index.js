const express = require('express');

const app = express();

app.use(express.json());

const project = [];
let count = 0;

// MIDDLEWARE: Check if ID exists before trying to use it
checkId = (req, res, next) => {
  const id = project.find(proj => proj.id === req.params.id);
  if (!id)
    return res.status(400).json( {"error": "The ID is invalid!"} );
  return next();
}

// MIDDLEWARE: Counts the number of requests sent by the app
countRequests = (req, res, next) => {
  count++;
  console.log(`# of Requests: ${count}`);
  return next();
}

// CREATE PROJECT
app.post('/projects', countRequests, (req, res) => {
  const { id, title, tasks } = req.body;
  project.push({ id, title, tasks });
  return res.json(project);
});

// READ PROJECT
app.get('/projects', countRequests, (req, res) => {
  return res.json(project);
});

// UPDATE PROJECT TITLE
app.put('/projects/:id', checkId, countRequests, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  project.find(proj => proj.id === id).title = title;
  return res.json(project);
});

// DELETE PROJECT
app.delete('/projects/:id', checkId, countRequests, (req, res) => {
  const { id } = req.params;
  project.splice(project.find(proj => proj.id === id), 1);
  return res.send();
});

// CREATE TASKS
app.post('/projects/:id/tasks', checkId, countRequests, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  project.find(proj => proj.id === id).tasks.push(title);
  return res.json(project);
});

app.listen(3000);