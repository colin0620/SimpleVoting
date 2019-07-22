'use strict';

module.exports = function(app) {
	var appController = require('../controllers/appController');

	app.route('/').get(appController.list_all_campaigns); //list all campaigns

	app.route('/admin')
	.get(appController.show_admin_page) //admin login page
	.post(appController.admin_auth); //authentication

	app.route('/adminHome').get(appController.show_admin_homepage); //admin homepage

	app.route('/changePW').post(appController.change_admin_pw); //change admin password

	app.route('/logout').post(appController.admin_logout) //admin logout

	app.route('/addCampaign').post(appController.add_campaign); //add a campaign

	app.route('/campaign').get(appController.show_campaign); //show campaign details

	app.route('/submitVote').post(appController.submit_vote); //submit vote for candidate
};
