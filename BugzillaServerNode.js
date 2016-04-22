var http = require('http');
var underScore = require('underscore');
var myFireBase = require('firebase');
var express = require('express');
var app = express();
var fs = require('fs');
//var myFireBaseListien = require('./public/js/nodeFireBase.js');
//var responseOnRealTime = myFireBaseListien();
var port = 5000;
var realTimeDeviceStates;

app.use(express.static('Public'));
app.use(express.static('Views'));

app.get('/Home', function (req, res) {
    res.sendfile('Views/TrackMeRehab.html');
});


app.listen(port, function (err) {
    console.log("I am workig !");

});


       