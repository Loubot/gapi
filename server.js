'use strict'

// server.js
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var app = express();
app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 5000;
var fs = require( 'fs' )
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var models = require('./models')

var passport = require("passport");
app.use( passport.initialize() )
var strategy = require('./config/strategy')( passport )

/* Include all express controllers */
fs.readdirSync('./controllers').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        var route = require('./controllers/' + file);
        route.controller( app, strategy );
        // route.controller( app, jwt, strategy );
    }
})








app.listen(port);
console.log('server started '+ port);