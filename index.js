var express = require('express');
var app = express();
var logger = require('morgan');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var session = require('express-session');


app.use(logger(':method :url :status :user-agent :remote-addr :response-time ms'));

app.use(express.static('./'));

app.get("/", function (req, res) {
    res.render('../index.html')
})

app.listen(port, function () {
    console.log("Server Started On Port " + port);
})
