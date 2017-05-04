function getFeed(element) {
	this.loading = false
	this.element = $(element);
  this.results = [];
  this.feeds = [
    {
      name: 'Twitter',
      url: 'get_tweets.php',
			clean: this.parseTwitterFeed
    },
    {
      name: 'Insta',
      url: 'get_insta.php',
			clean: this.parseInstaFeed
    }
  ]
}

/*String.prototype.parseURL = function() {
    return this.replace(/[A-Za-z0-9-_]+[A-Za-z0-9-_:%&~?/.=]+/g, function(url) {

    });
};*/

String.prototype.parseTwitterUsername = function() {
    return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
        var username = u.replace("@","")
        return u.link("http://twitter.com/"+username);
    });
};

String.prototype.parseInstaUsername = function() {
    return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
        var username = u.replace("@","")
        return u.link("http://instagram.com/"+username);
    });
};

String.prototype.parseTwitterHashtag = function() {
    return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
        var tag = t.replace("#","%23")
        return t.link("https://twitter.com/search?q="+tag);
    });
};

String.prototype.parseInstaHashtag = function() {
    return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
        var tag = t.replace("#","")
        return t.link("https://www.instagram.com/explore/tags/"+tag);
    });
};

getFeed.prototype.parseTwitterFeed = function(res){

    var new_res = []

    for(var i = 0; i < res.length; i++){

				var str = res[i].text;
				var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
				var text = str.replace(exp,"<a href='$1'>$1</a>");
				var username = res[i].user.screen_name;
				var user = 'http://twitter.com/'+ username;

				var tweet = text;
				tweet = tweet.parseTwitterUsername().parseTwitterHashtag();

				var date = new Date(res[i].created_at);
        var obj = {
              text: tweet,
              date: date,
							user: user,
							feed: "twitter"
        }

				var jsonData = obj;

				$(".report").data("feed",jsonData);
        new_res.push(obj);
    }
 		return new_res
}

getFeed.prototype.parseInstaFeed = function(res){
  var new_res = []

  for(var i = 0; i < res.data.length; i++){

		var jsonDate = res.data[i].caption.created_time;
		var date = new Date(parseInt(jsonDate) * 1000);

		var text = res.data[i].caption.text;
		var username = res.data[i].user.username;
		var user = 'http://instagram.com/'+ username;
		var image = res.data[i].images.standard_resolution.url;
		text = text.parseInstaUsername().parseInstaHashtag();

		var date = new Date(date);

		var obj = {
      text: text,
			date: date,
			image: image,
			user: user,
			feed: "instagram"
    }

		var jsonData = obj;

		new_res.push(obj);
  }

	return new_res
}

getFeed.prototype.mergeFeed = function(){
  var arrays = this.results;
  this.results = [].concat.apply([], arrays);
}

getFeed.prototype.callFeed = function(){
	this.loading = true

  for(var i = 0; i < this.feeds.length; i++){
    var res = $.ajax({
			dataType: "json",
			contentType: "application/json",
      url: this.feeds[i].url,
      async: false
    });

    if(res.status === 200){
			//if you dont have a clean function it will ignore that feed
			var parsedJson = (this.feeds[i].clean) ? this.feeds[i].clean(res.responseJSON) : [];
			if (parsedJson.length > 0){
				this.results.push(parsedJson)
			}
    }
  }
	this.loading = false
	// MERGE THE TWO ARRAYS TOGETHER
	this.mergeFeed();
}

getFeed.prototype.sortMyFeed = function (){

	this.results.sort(function (a, b) {
    var keyA = new Date (a.date),
        keyB = new Date (b.date);

    // Compare the 2 dates
    if(keyA > keyB) return -1;
    if(keyA < keyB) return 1;
    return 0;
	});
}

getFeed.prototype.printMyFeed = function (){

	var data = this.results;

	var html = "";
  for(var i = 0; i < data.length; i++){

			var date = moment(data[i].date).endOf('min').fromNow();
			var feed = data[i].feed;

			html += "<div class='card " + feed + "'>";
			html += "<div class='img'><img src='" + data[i].image + "'/></div>";
			html += "<div class='text'>";
			html += data[i].text;
			html += "<a target='_blank' href='" + data[i].user + "'>";
			html += "<span class='icon icon-" + feed + "'></span>";
			html += "</a>";
			html += "</div>";
      html += "<div class='date'>" + date + "</div>";
			//html += "<div class='report'>REPORT</div>"
			html += "</div>";
  }

	this.element.html(html);
}


var a = new getFeed('#timeline');
a.callFeed();
a.sortMyFeed();
a.printMyFeed();
