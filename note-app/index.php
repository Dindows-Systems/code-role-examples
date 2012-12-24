<?php

$note_name = 'note.txt';
$uniqueNotePerIP = true;

if($uniqueNotePerIP){
	
	// Use the user's IP as the name of the note.
	// This is useful when you have many people
	// using the app simultaneously.
	
	if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
		$note_name = 'notes/'.$_SERVER['HTTP_X_FORWARDED_FOR'].'.txt';
	}
	else{
		$note_name = 'notes/'.$_SERVER['REMOTE_ADDR'].'.txt';
	}
}


if(isset($_SERVER['HTTP_X_REQUESTED_WITH'])){
	// This is an AJAX request
	
	if(isset($_POST['note'])){
		// Write the file to disk
		file_put_contents($note_name, $_POST['note']);
		echo '{"saved":1}';
	}
	
	exit;
}

$note_content = '';

if( file_exists($note_name) ){
	$note_content = htmlspecialchars( file_get_contents($note_name) );
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Simple AJAX Note Taking App | Tutorialzine Demo</title>
        
        <!-- Our stylesheet -->
        <link rel="stylesheet" href="assets/css/styles.css" />
        
        <!-- A custom google handwriting font -->
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Courgette" />

        
        <!--[if lt IE 9]>
          <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
    </head>
    
    <body>

		<div id="pad">
			<h2>Note</h2>
			<textarea id="note"><?php echo $note_content ?></textarea>
		</div>

		<p class="credit">PSD by <a href="http://365psd.com/day/3-39/" target="_blank">Mathieu Berenguer</a></p>

        <footer>
	        <h2><i>Tutorial:</i> Simple AJAX Note Taking App</h2>
            <a class="tzine" href="http://tutorialzine.com/2012/09/simple-note-taking-app-ajax/">Head on to <i>Tutorial<b>zine</b></i> to read and download</a>
        </footer>
        
        <!-- JavaScript includes. -->
		<script src="http://code.jquery.com/jquery-1.8.1.min.js"></script>
		<script src="assets/js/script.js"></script>
     
    </body>
</html>
