'use strict';
const md5 = require('md5');

var Campaign = require('../models/campaign.js');
var Admin = require('../models/admin.js');
var Votes = require('../models/votes.js');

/*==========================handling campaign================================*/
exports.list_all_campaigns = function(req, res) {
	Campaign.getAllCampaigns(function(err, campaigns) {
		if (err) res.send(err);
		var nowTime = new Date();
		if(campaigns.length > 0){
			for(var i = 0; i < campaigns.length;){
				if(campaigns[i].endTime == "Already ended.") break; //break if touched the ended campaign which is marked
				if(campaigns[i].endTime < nowTime){ //if campaign is ended
					campaigns[i].endTime = "Already ended."; //mark it
					campaigns.push(campaigns[i]); //push it to the end of the array
					campaigns.shift(); //remove it from the beginning
				} else i++;
			}
			res.render('index', {datas: campaigns});
		}
		res.end();
	});
};

exports.add_campaign = function(req, res) {
	var endTime = new Date(req.body.endTime); 
	var nowTime = new Date();
	if(endTime < nowTime) 
		res.render('adminHome', {msg: null, voteMsg: "Ending time is incorrect!"}); //check ending time is in the future
	else {
		var title = req.body.title;
		var startTime = nowTime;
		var endTime = endTime.toISOString().slice(0, 19).replace('T', ' '); //change to mysql datetime format
		var candidates = '{"candidates": ['; //change to json format
		for (var i = 1; req.body["candidate"+i] != null; i++){
			candidates += '{ "name": "'+req.body["candidate"+i] + '", "vote": "0" }, ';
		}
		candidates += '{ "name": "null", "vote": "0" }]}'; //last candidate set to "null" for detect the end
		
		Campaign.insertCampaign(title, startTime, endTime, candidates, function(err, msg){
			if (err) res.send(err);
			else res.render('adminHome', {msg: null, voteMsg: msg});
			res.end();
		});
	}
}

exports.show_campaign = function(req, res) {
	var campaignID = req.query.id;
	var link = 'http://'+req.get('host')+'/campaign?id='+campaignID; //link for fb comment api
	Campaign.getCampaign(campaignID, function (error, result){
		if (error) res.send(error);
		else {
			var data = result[0];
			var candidates = JSON.parse(data.candidates).candidates; //Get candidates array
			var endTime = data.endTime; 
			var nowTime = new Date();
			var submitDisable = "";
			if(endTime < nowTime) submitDisable = "disabled"; //if campaign is expired then disable submit button
			res.render('campaign', {data: data, candidates: candidates, link: link, submitDisable: submitDisable});
		}
		res.end();
	});
}

/*============================handing votes==============================*/
exports.submit_vote = function(req, res) {
	var campaignID = req.body.campaignID;
	var voteCandidate = req.body.voteCandidate;
	var HKID = req.body.HKID;
	var allCandidatesAndVotes = JSON.parse(req.body.candidatesJson).candidates;
	//console.log(allCandidatesAndVotes);
	
	var votes = 0;
	Votes.checkIfVotedForCampaign(HKID, campaignID, function(err, result){ //check if voted
		if (err) {
			res.json({ success: 0, msg: "Can't check if voted!"}); res.end();
		} else if (result.length > 0) { //voted
			res.json({ success: 0, msg: "You already voted for this campaign!"}); res.end();
		} else { //not voted
			Votes.countVotesForCampaignOfCandidate(voteCandidate, campaignID, function(err, result){ //count votes
				if (err) {
					res.json({ success: 0, msg: "Can't count votes!"}); res.end();
				} else votes = result.numOfVotes+1;
			});
			Votes.insertVote(HKID, voteCandidate, campaignID, function(err, result){ //insert vote
				if (err) {
					res.json({ success: 0, msg: "Can't insert vote!"}); res.end();
				}
			});
			allCandidatesAndVotes.forEach(function(data){ //prepare updated candidates json
				if(data.name == voteCandidate){
					data.vote = parseInt(votes) + 1;
					console.log(data.name + ", vote: " + data.vote);
				}
			});
			var candidatesJson = '{ "candidates": ' + JSON.stringify(allCandidatesAndVotes) + '}'
			//console.log(candidatesJson);
			Campaign.updateCandidatesVotes(campaignID, candidatesJson, function(err, result){
				if (err) {
					res.json({ success: 0, msg: "Can't update campaign candidate's vote!"}); res.end();
				} else {
					res.json({ success: 1, vote: votes}); res.end();
				}
			});
		}
	});
}

/*============================handing admin==============================*/
exports.show_admin_page = function(req, res) {
	res.render('admin', {msg: null});
};

exports.admin_auth = function(req, res) {
	var username = req.body.username;
	var password = md5(req.body.password);
	if (username && password) {
		Admin.getAdminInfo(username, password, function(err, admin) {
			if (err) res.send(err);
			if (admin.length > 0) { //username and pw are correct
				req.session.loggedin = true; //logged in
				res.redirect('/adminHome');
			} else { //failed
				res.render('admin', {msg: "Incorrect Username and/or Password!"});
			}			
			res.end();
		});
	} else { //didnt receive username and/or pw
		res.render('admin', {msg: "Please enter Username and Password!"});
		res.end();
	}
}

exports.show_admin_homepage = function(req, res) {
	if (req.session.loggedin)  //check if logged in
		res.render('adminHome', {msg: null, voteMsg: null});
	else  //no login
		res.redirect('/admin');
	res.end();
}

exports.change_admin_pw = function(req, res) {
	var oldPW = req.body.oldPassword;
	var newPW = req.body.newPassword;
	var newPW2 = req.body.newPassword2;
	if (oldPW && newPW && newPW2 && newPW.length >= 8){ //fields and new password length checking
		oldPW = md5(oldPW); newPW = md5(newPW); newPW2 = md5(newPW2); //hash all passwords
		Admin.getAdminInfo("admin", oldPW, function(err, admin) { //check if old password is correct
			if (err) res.send(err);
			if (admin.length > 0) { //username and pw are correct
				if(newPW == newPW2){ //new password matches
					Admin.changePW("admin", newPW, function(err, msg){ //change pw
						if (err) res.send(err);
						else res.render('adminHome', {msg: msg, voteMsg: null});
						res.end();
					});
				} else {
					res.render('adminHome', {msg: "New password does not match!", voteMsg: null}); //error
					res.end();
				}
			} else {
				res.render('adminHome', {msg: "Old password is incorrect!", voteMsg: null}); //error
				res.end();
			}
		});
	} else { //didnt receive both old and new password or new password < 8
		res.render('adminHome', {msg: "Please enter all fields & new password must be more than 7 words!", voteMsg: null});
		res.end();
	}	
}

exports.admin_logout = function(req, res) {
	req.session.loggedin = false; //reset login session
	res.redirect('/admin');
}
