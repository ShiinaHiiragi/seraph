const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path')
const http = require('http');
const https = require('https');
const express = require('express');

dotenv.config();
app = express();
app.use(express.static(path.join(__dirname, '../build')));
app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

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
        `cert/${process.env.REACT_APP_HOSTNAME}.crt`
      )
    ),
    key: fs.readFileSync(
      path.join(
        __dirname,
        `cert/${process.env.REACT_APP_HOSTNAME}.key`
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
