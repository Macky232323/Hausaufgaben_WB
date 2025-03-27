const express = require("express");
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

app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000&quot;);
});

app.get("/randomname", (req, res) => {
    res.send("Du hast erfolgreich die /randomname Route angesprochen");
  });