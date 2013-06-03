// var SendGrid = require('sendgrid').SendGrid;
// var sendgrid = new SendGrid(user, key);

exports.create = function(req, res){
  var name = req.param('name'),
      email = req.param('email');

  var client = global.redisClient;

  client.hexists('emails', email, function(err, exists){
    if (exists) {
      // handle exist case
      console.log('EMAIL ALREADY EXISTS:', email);
      res.send(400);
      return;
    }
    var data = {
      name: name,
      email: email
    };

    client.hset('emails', email, JSON.stringify(data), function (err, reply) {
      console.log('ADDED ACCOUNT:', email);
      res.json(201, data);
    });
  });
};
