const express = require("express");
const { createServer } = require('http');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv')
const server = createServer(app);
const morgan = require('morgan')
app.set('port', process.argv[2] || 8000);
const port = process.env.PORT || app.get('port');
const bodyParser = require('body-parser');
const mongoose  = require("mongoose");
const routers = require("./router");

dotenv.config();

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(morgan("common"))

app.use(express.static(__dirname + '/public/build'));
console.log(__dirname + '/public/build')

routers(app);

mongoose.connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log('Connect Db success!')
  })
  .catch((err) => {
    console.log(err)
  })

server.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
  });