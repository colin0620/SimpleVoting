const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const app_name = require('./package.json').name + ' app';

/*=======================================*/
app.listen(3000, function () {
	console.log('listening on port 3000!')
});

/*app.listen(process.env.PORT, function () {
	console.log(app_name + ' listening on ' + process.env.HOST + ':' + process.env.PORT);
});*/

app.set('view engine', 'ejs'); //allow to render ejs files(html) in "views/" folder
app.use(express.static('public')); //allow to access css files in "public/css/" folder
app.use(session({ //allow session control
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true })); //able to access elements in body through req.body object
app.use(bodyParser.json());

var routes = require('./routes/appRoutes'); //importing route
routes(app); //register the route

