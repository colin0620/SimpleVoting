'user strict';

var con = require('../db.js');

//Campaign object constructor
var Votes = function(vote){
	this.HKID = vote.HKID;
	this.voteCandidate = vote.voteCandidate;
	this.campaignID = vote.campaignID;
}

Votes.countVotesForCampaignOfCandidate = function (voteCandidate, campaignID, result) { //get all Votes for a campaign of a candidate
	con.query("SELECT COUNT(HKID) AS numOfVotes FROM votes WHERE campaignID = ? AND voteCandidate = ?", [campaignID, voteCandidate], function (error, results, fields) {
		if(error) {
			console.log("error: ", error);
			result(error, null);
		}else{
			result(null, results);
		}
	});
}

Votes.checkIfVotedForCampaign = function (HKID, campaignID, result) { //check if a person was voted for a campaign
	con.query("SELECT * FROM votes WHERE HKID = ? AND campaignID = ?", [HKID, campaignID], function (error, results, fields){
		if(error) {
			console.log("error: ", error);
			result(error, null);
		}else{
			result(null, results);
		}
	});	
}

Votes.insertVote = function (HKID, voteCandidate, campaignID, result) { //insert new vote
	con.query("INSERT INTO votes (HKID, voteCandidate, campaignID) VALUES (?, ?, ?)", [HKID, voteCandidate, campaignID], function(error, results, fields){
		if(error) {
			console.log("error: ", error);
			result(error, null);
		}else{
			result(null, true);
		}
	});
}

module.exports = Votes;
