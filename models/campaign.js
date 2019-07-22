'user strict';

var con = require('../db.js');

//Campaign object constructor
var Campaign = function(campaign){
	this.id = campaign.id;
	this.title = campaign.title;
	this.startTime = campaign.startTime;
	this.endTime = campaign.endTime;
	this.candidates = campaign.candidates;
}

Campaign.getAllCampaigns = function (result) { //get all campaigns
	con.query("SELECT * FROM campaign ORDER BY endTime", function (error, results, fields) {
		if(error) {
			console.log("error: ", error);
			result(error, null);
		}else{
			result(null, results);
		}
	});
}

Campaign.getCampaign = function (id, result) { //get one campaign
	con.query("SELECT * FROM campaign WHERE id = ?", [id], function (error, results, fields) {
		if(error) {
			console.log("error: ", error);
			result(error, null);
		} else {
			result(null, results);
		}
	});
}

Campaign.insertCampaign = function (title, startTime, endTime, candidates, result) { //insert a campaign
	con.query("INSERT INTO campaign (title, startTime, endTime, candidates) VALUES (?, ?, ?, ?)", [title, startTime, endTime, candidates], function(error, results, fields){
		if(error) {
			console.log("error: ", error);
			result(error, null);
		}else{
			result(null, "New campaign is created!");
		}
	});
}

Campaign.updateCandidatesVotes = function (id, candidates, result) { //update number of votes
	con.query("UPDATE campaign SET candidates = ? WHERE id = ?", [candidates, id], function(error, results, fields){
		if(error) {
			console.log("error: ", error);
			result(error, null);
		}else{
			result(null, true);
		}
	});
} 

module.exports = Campaign;
