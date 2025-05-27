const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors('http://localhost:3000'));

const port = 3001;

const pokedexRouten = require('./pokedex.js');
const battleMechanixRouten = require('./battlemechanic.js')

app.use('',pokedexRouten);
app.use('/battlemechanic', battleMechanixRouten);

app.listen(port);
