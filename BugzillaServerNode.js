
var express = require('express');
var app = express();

var realTimeDeviceStates;
app.set('port', (process.env.PORT || 9000));
app.use(express.static(__dirname + '/Public'));
app.use(express.static(__dirname + '/Views'));

app.set('views', __dirname + '/Views');


//app.use(express.static('Public'));
//app.use(express.static('Views'));

app.get('/Show', function (req, res) {
    res.sendfile('Views/TrackMeRehab.html');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});




       