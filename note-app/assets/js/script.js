$(function(){
	
	var note = $('#note');
	
	var saveTimer,
		lineHeight = parseInt(note.css('line-height')),
		minHeight = parseInt(note.css('min-height')),
		lastHeight = minHeight,
		newHeight = 0,
		newLines = 0;
		
	var countLinesRegex = new RegExp('\n','g');
	
	// The input event is triggered on key press-es,
	// cut/paste and even on undo/redo.
	
	note.on('input',function(e){
		
		// Clearing the timeout prevents
		// saving on every key press
		clearTimeout(saveTimer);
		saveTimer = setTimeout(ajaxSaveNote, 2000);
		
		// Count the number of new lines
		newLines = note.val().match(countLinesRegex);
		
		if(!newLines){
			newLines = [];
		}
		
		// Increase the height of the note (if needed)
		newHeight = Math.max((newLines.length + 1)*lineHeight, minHeight);
		
		// This will increase/decrease the height only once per change
		if(newHeight != lastHeight){
			note.height(newHeight);
			lastHeight = newHeight;
		}
	}).trigger('input');	// This line will resize the note on page load
	
	function ajaxSaveNote(){
		
		// Trigger an AJAX POST request to save the note
		$.post('index.php', { 'note' : note.val() });
	}
	
});
