const express = require('express'),
      app = express()
      bodyParser = require('body-parser')
      path = require('path'),
      controller = require('./controller');

app.set('view engine', 'hbs')
app.set('views',path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '..', 'static')))
app.use(express.static(path.join(__dirname, '..', 'node_modules')))
app.use(bodyParser.json());

controller.set(app);

const server = app.listen(3000, () => {
  console.log('Escutando em: http://localhost:3000')
});
