const axios = require('axios').default;
const qs = require('qs');
const https = require('https');

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});
instance.defaults.headers.common['Content-Type'] = 'application/json';

const buff = Buffer.from(
  'sRNnSQWnoCuelGXXAInsbM39_cQa:FswDAJ8iJwdQooVrNNLaSYLdZbga',
  'utf-8',
);
const base64 = buff.toString('base64');
console.log({ base64 });

instance('https://apisandbox.enzona.net/token', {
  data: qs.stringify({
    grant_type: 'client_credentials',
    scope: 'enzona_business_payment',
  }),
  headers: {
    Authorization: `Basic ${base64}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  method: 'post',
})
  .then((response) => console.log(response.data))
  .catch((err) => console.log({ err: err }));
