var express = require('express'),
    thinky = require('thinky')({'host': '46.101.58.10', 'port': 28015, 'db': 'pluttig'}),
    r = thinky.r,
    exphbs = require('express-handlebars'),
    randomstring = require("randomstring"),
    bodyParser = require('body-parser'),
    validUrl = require('valid-url');

var plutties = thinky.createModel('Plutties', {
  'id': String,
  'url': String
});

var fourofour = function(req, res) {
  return function(error) {
        console.log(error.message);
        return res.send(500, {error: error.message});
  }
}

var genUrl = function(req, res, prefix) {
  var plutti = new plutties({'id': prefix, 'url': req.body.plutti.url});
  plutti.save().then(function(object) {
    return res.json({
      'success': 'http://pluttig.nu/'+prefix
    });
  });
}

var app = express();
app.set('views', __dirname+'\\views');
app.set('view engine', 'hbs');
app.set('layout', 'layouts/layout');
app.engine('hbs', exphbs({defaultLayout: 'layout', layoutsDir: __dirname+'\\views\\layouts', extname: '.hbs'}));
app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.json());


app.route('/').get(function(req, res) {
  res.render('index');
});

app.route('/').post(function(req, res) {
  if(req.body.plutti.url) {
    if(validUrl.isWebUri(req.body.plutti.url)) {
      var prefix = false;
      if(req.body.plutti.requested) {
        plutties.filter({id: req.body.plutti.requested}).run().then(function(prefixCount) {
            if(prefixCount.length > 0) {
              return res.json({
                'error': 'Den önskade URLen finns redan registrerad!'
              });
            }else{
              prefix = req.body.plutti.requested;
              return genUrl(req, res, prefix);
            }
        });
      }else{
        prefix = randomstring.generate(8);
        return genUrl(req, res, prefix);
      }
    }else{
      return res.json({
        'error': 'Felaktig URL!'
      });
    }
  }
});

app.route('/:prefix').get(function(req, res) {
  console.log(req.params.prefix);
  plutties.get(req.params.prefix).run().then(function(plutti) {
    res.redirect(301, 'http://'+plutti.url);
    //console.log(plutti.url)
  }).error(fourofour(req, res));
});

app.listen(81);
