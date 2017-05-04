$(function(){

	$.ajax({
		url: 'get_insta.php',
		type: 'GET',
		success: function(response) {

			console.log(response);

			if (typeof response.errors === 'undefined' || response.errors.length < 1) {

				var $tweets = $('<div></div>');
				$.each(response, function(i, obj) {

					var date = Date.parse(obj.created_at);

					$tweets.append(obj.text);
				});

				$('.tweets-container').html($tweets);

			} else {
				$('.tweets-container p:first').text('Response error');
			}
		},
		error: function(errors) {
			$('.tweets-container p:first').text('Request error');
		}
	});
});

function getFeed() {
	this.loading = false
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

getFeed.prototype.parseTwitterFeed = function(res){
    var new_res = []

    for(var i = 0; i < res.length; i++){

        var obj = {
              text: res[i].text,
              date: res[i].created_at
        }
        new_res.push(obj);
    }
 		return new_res
}

getFeed.prototype.parseInstaFeed = function(res){
  var new_res = []

  for(var i = 0; i < res.length; i++){

      var obj = {
            text: res[i].name,
            date: res[i].phone
      }
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
	this.mergeFeed();
}

getFeed.prototype.sortMyFeed = function (){
	this.results.sort(function(a, b){
    var keyA = new Date(a.date),
        keyB = new Date(b.date);
    // Compare the 2 dates
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
	});
}

var a = new getFeed();
a.callFeed();
a.sortMyFeed();
a.results = a.results.reverse()

console.log(a);
