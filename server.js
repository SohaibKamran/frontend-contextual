var express = require('express');
// const fs =require('fs');
// var csc = require('country-state-city').default;
var app = express();

app.use(express.static('./dist/contxtual'));
app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/contxtual'})
);

app.listen(process.env.PORT || 4000);
