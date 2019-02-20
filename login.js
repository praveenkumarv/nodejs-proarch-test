var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'nodelogindb'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function (request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;

				var today = new Date();
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/dashboard.html'));
	} else {
		response.send('Please <a href="/">login</a> to view this page!');
	}
});

app.get('/registration', function (request, response) {
	response.sendFile(path.join(__dirname + '/registration.html'));
});

app.get('/logout', function (request, response) {
	if (request.session.loggedin) {
		request.session.loggedin = false;
		request.session.username = "";
		response.redirect('/');
	}
});

app.get('/getuser', function (request, response) {
	if (request.session.loggedin == true) {
		var username = request.session.username;

		connection.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
			if (results.length > 0) {
				var today = new Date();
				var usersData = {
					"firstname": results[0].firstname,
					"lastname": results[0].lastname,
					"username": results[0].username,
					"email": results[0].email,
					"dob": results[0].dob,
					"skills": results[0].skills,
					"country": results[0].country,
					"created": today,
					"modified": today
				}
				console.log(usersData);
				response.contentType('application/json');
				response.send(JSON.stringify(usersData));
			}
		});
	}
});

app.post('/register', function (request, response) {
	var date, today, month;
	d = new Date();
	month = d.getMonth() + 1;
	today = d.getFullYear() + "-" + month + "-" + d.getDate();

	var username = request.body.username;
	var firstname = request.body.firstname;
	var lastname = request.body.lastname;
	var email = request.body.email;
	var password = request.body.password;
	var dob = request.body.dob;
	var skills = request.body.skills;
	var country = request.body.country;
	var createdOn = today;
	var updatedOn = today;

	if (username && password && email) {
		var sql = "";
		sql = "INSERT INTO users (username,firstname,lastname,email,password,dob,skills,country,createdOn,updatedOn) VALUES ('" + username + "','" + firstname + "','" + lastname + "','" + email + "','" + password + "','" + dob + "','" + skills + "','" + country + "','" + createdOn + "','" + updatedOn + "')";
		connection.query(sql, function (err, result) {
			if (err) throw err;
			response.send('Please <a href="/">login</a> to view this page!');
		});
	}
});

app.listen(3000, function () {
	console.log('listening on port 3000');
});