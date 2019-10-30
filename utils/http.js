const https = require('https');

module.exports.getJson = url => new Promise((resolve, reject) => {
  https.get(url, (resp) => {
    let data = '';

    resp
      .on('data', (chunk) => {
        data += chunk;
      })
      .on('end', () => resolve(JSON.parse(data)))
      .on('error', error => reject(error));
  });
});
