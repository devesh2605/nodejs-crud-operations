var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var cors = require('cors');
var database = require('./Database/database');


/*Import Required Routers*/
var employeeRouter = require('./Routers/employeeRouter');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));

var PORT = process.env.PORT || 3000;

/*Routers*/
app.use('/employee', employeeRouter);

app.listen(PORT, function() {
    console.log('Server listening on ' + PORT);
});