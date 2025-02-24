const express = require("express");
const { createServer } = require('http');
const app = express();
const dotenv = require('dotenv')
const cors = require('cors')
const server = createServer(app);
app.set('port', process.argv[2] || 8000);
const port = process.env.PORT || app.get('port');
const mongoose  = require("mongoose");
const routers = require("./router");
const bodyParser = require("body-parser");

dotenv.config();

app.use(express.static(__dirname + '/public/build'));
console.log(__dirname + '/public/build')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));


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