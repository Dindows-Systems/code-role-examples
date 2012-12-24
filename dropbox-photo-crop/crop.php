<?php

$filename_length = 10;
$dir = 'tmp/'; // where to store the cropped images


if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['src'])) {

	$src = $_POST['src'];
	$coordinates = $_POST['coordinates'];

	$url = parse_url($src);
	$info = get_headers($src, 1);

	// Only allow photos from dropbox
	if ($url['host'] == 'dl.dropbox.com') {
		
		if ($info['Content-Type'] == 'image/jpeg' && $info['Content-Length'] < 1024*1024) {
			
			// Cache the remote file locally
			$cache = $dir . md5($src);
			
			if(!file_exists($cache)){
				file_put_contents($cache, file_get_contents($src));
			}
			
			// Original image
			$img = imagecreatefromjpeg($cache);
			
			// New image
			$dst = imagecreatetruecolor($coordinates['w'], $coordinates['h']);
			
			// Copy and resize it depending on the crop area
			imagecopyresampled($dst, $img, 0, 0, $coordinates['x'], $coordinates['y'], $coordinates['w'], $coordinates['h'], $coordinates['w'], $coordinates['h']);

			// Generate a temporary name and write the file to disk
			$name = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $filename_length);
			imagejpeg($dst, $dir . $name . '.jpg');

			// Print it for jQuery
			echo $dir . $name . '.jpg';
			
		} else {
			echo 1;
		}
	} else {
		echo 2;
	}

}

