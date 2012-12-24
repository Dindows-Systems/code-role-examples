<?php

// Enter your Google API key here.
// You can obtain it from the API console
$key = 'ENTER YOUR API KEY HERE';


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['search'])) {
	
	$search = urlencode($_POST['search']);
	$url = 'https://www.googleapis.com/shopping/search/v1/public/products?key=' . $key . '&country=US&q=' . $search . '&maxResults=24';

	echo file_get_contents($url);
}

?>