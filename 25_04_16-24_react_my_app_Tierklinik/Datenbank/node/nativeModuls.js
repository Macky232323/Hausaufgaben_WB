 // importiere uns os
 const os = require("os")
 // import os from "os" // Diese ES6-Module Schreibweise nur möglich wenn in der package.json das Attribut "type": "module" hinzugefügt wird
 
 console.log(os.version())
 console.log(os.uptime())
 
 
 const fs = require("fs")
 
 fs.writeFile("message.txt","Hallo ich komme aus der hallo.js", (err) => {
     if (err) throw err;
     console.log("Die Datei wurde gespeichert")
 })