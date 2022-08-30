const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const Router = require('./routes');
const server = require('http').createServer(app);


const port = 3000;


app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());






app.use('/hotel/admin', Router.admin);
app.use('/hotel', Router.customer);

server.listen(port, () => {
    console.log('listening on port ' + port);
});