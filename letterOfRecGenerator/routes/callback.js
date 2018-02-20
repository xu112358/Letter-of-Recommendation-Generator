function (req, res) {
  console.log('hi');

  const qs = querystring.parse(url.parse(req.url).query);
  res.redirect('/recommender-dashboard');
  oAuth2Client.getToken(qs.code, (err, tokens) => {
    if (err) {
      console.error('Error getting oAuth tokens: ' + err);
      return callback(err);
    }
    oAuth2Client.credentials = tokens;
    res.end('Authentication successful! Please return to the console.');
    callback(null, this.oAuth2Client);
    server.close();
  });