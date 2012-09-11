/*
 * saytweet.js
 */

var sys = require('sys');
var exec = require('child_process').exec
var program = require('commander');
var twitter = require('ntwitter');
var tw = new twitter({
	consumer_key: "",
	consumer_secret: "",
	access_token_key: "",
	access_token_secret: ""
});

var since_id = '';
var tweets = [];

program.prompt('Tweet Search Term: ', function(query) {
	console.log('-> searching twitter for: ' + query);
	process.stdin.destroy();
	// -- initial search
	tw.search(query, {since_id: since_id}, function(err, data) {
		if(err) { console.log(err); }
		if(data) {
			since_id = data.max_id_str;
			var result_total = data.results.length;
			for(i=0; i<result_total; i++) {
				tweets.push(data.results[i]);
			}
		}
	});
	saytweet();
	// -- interval search
	setInterval(function() {
		tw.search(query, {since_id: since_id}, function(err, data) {
			if(err) {
				console.log(err);
			}
			if(data) {
				since_id = data.max_id_str;
				var result_total = data.results.length;
				for(i=0; i<result_total; i++) {
					tweets.push(data.results[i]);
				}
			}
		});
	}, 5000);
});

var saytweet = function() {
	if(tweets.length > 0) {
		var say_string = "@" + tweets[0].from_user + ": " + tweets[0].text
		console.log("@" + tweets[0].from_user + " - " + tweets[0].text);
		exec("say \""+	say_string	+"\"", function() {
			tweets.splice(0,1);
			saytweet();
		});
	} else {
		setTimeout(function() {
			saytweet();
		}, 10000);
	}
}

