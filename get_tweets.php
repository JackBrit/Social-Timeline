<?php

require_once('twitter_proxy.php');

// Twitter OAuth Config options
$oauth_access_token = '104534121-j4bN20Jjihw0DlcYxFrhJyDm06sSR5xBMtIAKd5L';
$oauth_access_token_secret = '5hIE8fACfKHasMZUlYxbgjHK8j1tRRCXJS6cmDDwZCGJa';
$consumer_key = 'I3uIKrJeYdmKYoVbi9D9NFo6C';
$consumer_secret = 'bsb9KDtt2sgGJx5br7yI8ZPC05Bi8kosS5LGgWDovwOvvxWgCi';
$user_id = '104534121';
$screen_name = 'weareinsert';
$count = 5;

$twitter_url = 'statuses/user_timeline.json';
$twitter_url .= '?user_id=' . $user_id;
$twitter_url .= '&screen_name=' . $screen_name;
$twitter_url .= '&count=' . $count;

# Create the connection
$twitter = new TwitterProxy(
	$oauth_access_token,			// 'Access token' on https://apps.twitter.com
	$oauth_access_token_secret,		// 'Access token secret' on https://apps.twitter.com
	$consumer_key,					// 'API key' on https://apps.twitter.com
	$consumer_secret,				// 'API secret' on https://apps.twitter.com
	$user_id,						// User id (http://gettwitterid.com/)
	$screen_name,					// Twitter handle
	$count							// The number of tweets to pull out
);

# Migrate over to SSL/TLS
$twitter->ssl_verifypeer = true;

// Invoke the get method to retrieve results via a cURL request
$tweets = $twitter->get($twitter_url);

echo $tweets;

?>
