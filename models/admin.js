'user strict';

var con = require('../db.js');

//admin object constructor
var Admin = function(admin){
	this.id = admin.id;
	this.username = admin.username;
	this.password = admin.password;
}

Admin.getAdminInfo = function (username, password, result) {
	con.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
		if(error) {
			console.log("error: ", error);
			result(error, null);
		}else{
			result(null, results);
		}
	});
}

Admin.changePW = function (username, newPW, result) {
	con.query('UPDATE admin SET password = ? WHERE username = ?', [newPW, username], function(error, results, fields){
		if(error) {
			console.log("error: ", error);
			result(error, null);
		}else{
			result(null, "Password is changed!");
		}
	});
}

module.exports = Admin;
