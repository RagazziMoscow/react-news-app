var express = require('express');
var app = express();

const port = process.env.PORT || 8000;

app.use('/', express.static(__dirname + '/static'));

app.listen(port, ()=> {
    console.log(`Server started on the port ${port}`);
});
