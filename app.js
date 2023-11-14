require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const https = require('https')
const hsts = require('./middleware/hsts')
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');



//DB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(()=> console.log('Db connected...'));
  

//Middleware
app.use(helmet());
app.use(cors({origin:'https://localhost:4200', optionsSuccessStatus: 200}))
app.use(express.json());
app.use(hsts);
app.use(morgan('tiny'));


//Routers
app.use('/api/auth', require("./routes/auth"));
app.use('/api/user', require("./routes/user"));
app.use('/api/post', require("./routes/post"));

app.use((reg,res,next)=>
{
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,ContentType,Accept,Authorization');
 res.setHeader('Access-Control-Allow-Methods', '*');
 next();
});

//Listen
https.createServer(
  {
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/certificate.pem'),
    passphrase: 'friedgreentomatoes',
  },
  app

).listen(3000);