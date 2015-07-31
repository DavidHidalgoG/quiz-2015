var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();
var partials = require ('express-partials');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('Quiz 2015'));
app.use(session({ secret: 'Quiz 2015', resave: true, saveUninitialized: true }));

// Helpers dinamicos:
app.use(function(req, res, next) {

  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/[Ll]?ogin|\/[Ll]?ogout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

//Desloguemos al usuario se pasa mas de dos minutos de inactividad
app.use(function(req, res, next)
{
    var limiteInactividad = 2 * 60 * 1000; //2 minutos en milisegundos
    var horaActual = (new Date()).getTime();
    if(req.session.user){
        if(horaActual >(req.session.horaUltimoAcceso + limiteInactividad))
        {
            //Destruimos sesion por pasar limite de inactividad
            delete req.session.user;
        }
        else
        {
            //Actualizamos hora ultimo acceso
            req.session.horaUltimoAcceso = horaActual;
        }
    }
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
