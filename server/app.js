// ! BASIC CONFIG
const express = require('express'),
      app = express(),
      port = process.env.PORT || 3030,
      routes = require('./routes'),
      cors = require('cors'),
      // gal = require('google-auth-library'),
      mongoose = require('mongoose')

app.use(cors())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.use(routes)

// mongoose.connect('mongodb://allUser:!90997Sncm@ds249503.mlab.com:49503/testing')
mongoose.connect('mongodb://localhost/ecommerce', { useNewUrlParser: true })

app.listen(port, () => console.log(`Listening on ${port}`))