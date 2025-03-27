const express = require("express");
const generateName = require('sillyname');
const app = express();

app.get("/", (req, res) => {
  res.send("Willkommen bei meiner eigenen API!");
});

app.get("/data", (req, res) => {
  res.json([
    { id: 1, name: "Max" },
    { id: 2, name: "Lena" }
  ]);
});

app.listen(5001, () => {
  console.log("Server läuft auf http://localhost:5001");
});

app.get("/randomname", (req, res) => {
  const name = generateName();
  res.send(name);
});

const users = [
  { id: 1, name: "Nassima", city: "Berlin" },
  { id: 2, name: "Suheib", city: "Frankfurt" },
  { id: 3, name: "Alex", city: "Erfurt" },
  { id: 4, name: "Lena", city: "Hamburg" },
  { id: 15, name: "Ronny", city: "Leipzig" },
];

app.get("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundUser = users.find(user => user.id == id);
  if (foundUser) {
    res.json(foundUser);
  } else {
    res.status(404).send({ error: "User not found mit ID:" + id });
  }
});