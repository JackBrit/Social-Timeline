<?php
$client_id="a7f5863e4a4f48b3ba01b7b5fd824bf5";
$access_token="408847466.a7f5863.e638e02041044a1b8d486ca68a515ceb";
$photo_count=5;

$json_link="https://api.instagram.com/v1/users/self/media/recent/?";
$json_link.="access_token={$access_token}&count={$photo_count}";

$array = file_get_contents($json_link);
$myJSONString = json_encode($array);
$myArray = json_decode($myJSONString);

echo $myArray;
?>
