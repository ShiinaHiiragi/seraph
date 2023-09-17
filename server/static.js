const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path')
const http = require('http');
const https = require('https');
const handler = require('serve-handler');
const express = require('express');

dotenv.config();
app = express();
app.get('*', (req, res) => handler(
  req,
  res,
  {
    public: path.join(__dirname, '../build/'),
    cleanUrls: true
  }
));

const disbableHTTPS = process.env.REACT_APP_PROTOCOL === 'http';
if (disbableHTTPS) {
  http
    .createServer(app)
    .listen(
      process.env.PORT,
      () => console.log(`Listening on port ${process.env.PORT}`)
    );
} else {
  httpsOption = {
    cert: fs.readFileSync(
      path.join(
        __dirname,
        `server/cert/${proces.env.REACT_APP_HOSTNAME}_bundle.crt`
      )
    ),
    key: fs.readFileSync(
      path.join(
        __dirname,
        `server/cert/${proces.env.REACT_APP_HOSTNAME}.key`
      )
    )
  };  
  https
    .createServer(httpsOption, app)
    .listen(
      process.env.PORT,
      () => console.log(`Listening on port ${process.env.PORT}`)
    );
}
