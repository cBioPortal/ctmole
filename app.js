'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/trialsByMutations']) {
    console.log('try this:\ncurl http://localhost:10010/trialsByMutations?gene=braf&alteration=fusion,v600k');
  }
  if (swaggerExpress.runner.swagger.paths['/trialsByCancersMutations']) {
    console.log('try this:\ncurl http://localhost:10010/trialsByCancersMutations?gene=braf&alteration=fusion,v600k');
  }
});



