// In order to use the MinIO JavaScript API to generate the pre-signed URL, begin by instantiating
// a `Minio.Client` object and pass in the values for your server.
// The example below uses values for play.min.io:9000

const Minio = require('minio');

var client = new Minio.Client({
  endPoint: '152.206.177.203',
  port: 9000,
  useSSL: false,
  accessKey: 'minio',
  secretKey: 'minio123',
});

// Instantiate an `express` server and expose an endpoint called `/presignedUrl` as a `GET` request that
// accepts a filename through a query parameter called `name`. For the implementation of this endpoint,
// invoke [`presignedPutObject`](https://docs.min.io/docs/javascript-client-api-reference#presignedPutObject)
// on the `Minio.Client` instance to generate a pre-signed URL, and return that URL in the response:

// express is a small HTTP server wrapper, but this works with any HTTP server
const server = require('express')();

server.get('/presignedUrl', (req, res) => {
  client.presignedPutObject(
    'saturday.static',
    req.query.name + '1',
    (err, url) => {
      if (err) throw err;
      res.end(url);
    },
  );
});

server.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8080);
