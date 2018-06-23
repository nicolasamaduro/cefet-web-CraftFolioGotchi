const express = require('express'),
      app = express()
      bodyParser = require('body-parser')

app.set('view engine', 'hbs')
app.set('views',__dirname+'\\..\\')
app.use(express.static(`${__dirname}/../`))
app.use(bodyParser.json());

const controller = require('./controller');
controller.set(app);

const server = app.listen(3000, () => {
  console.log('Escutando em: http://localhost:3000')
});
