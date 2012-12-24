$(document).ready(function() {
	
	var cropButton		= $('#cropButton'),
		dbChooser		= $("#db-chooser"),
		errorModal		= $('#errorModal'),
		errorMessage	= errorModal.find('h4'),
		progressBar		= $('#progressModal'),
		cropModal		= $('#cropModal'),
		content			= $('#content');
		
	var coordinates, src,
		name, type, 
		imgWidth, imgHeight,
		newWidth, newHeight,
		ratio, jcrop;
	
	dbChooser.on("DbxChooserSuccess", function(e) {

		e = e.originalEvent;

		name = e.files[0].name;
		src = e.files[0].link;
		
		type = name.split('.');
		type = type[1] || '';
		
		if (type.toLowerCase() != 'jpg') {
			showError('This file type is not supported! Choose a jpg.');
			return false;
		}
		
		if (e.files[0].bytes > 1024*1024) {
			showError('Please choose an image smaller than 1MB!');
			return false;
		}
		
		// If we have previously initialized jCrop:

		if(jcrop){
			jcrop.destroy();
			cropButton.hide();
		}
		
		progressBar.modal('show');

		var img = $('<img>');
		
		img.load(function() {
			
			imgWidth = img.width();
			imgHeight = img.height();
			
			
			if (imgWidth >= 575 || imgHeight >= 575) {
				
				// The image is too large, resize it to fit a 575x575 square!
				
				if (imgWidth > imgHeight) {	// Wide
					
					ratio = imgWidth / 575;
					newWidth = 575;
					newHeight = imgHeight / ratio;
					
				} else {	// Tall or square
					
					ratio = imgHeight / 575;
					newHeight = 575;
					newWidth = imgWidth / ratio;
					
				}
				
			} else {
				
				ratio = 1;
				newHeight = imgHeight;
				newWidth = imgWidth;
				
			}
			
			// Remove the old styles
			img.removeAttr('style');
			
			// Set the new width and height
			img.width(newWidth).height(newHeight);
			
			// Initialize jCrop
			img.Jcrop({
				onChange : showCropButton,
				onSelect : showCropButton
			}, function(){
				// Save the jCrop instance locally
				jcrop = this;
			});

			// Hide the progress bar
			progressBar.modal('hide');
		});
		
		// Show the image off screen, so we can
		// calculate the width and height properly
		img.css({
			'position' : 'absolute',
			'top' : -100000,
			'left' : -100000,
			'visibility' : 'hidden',
			'display' : 'block'
		});
		
		// Set the SRC attribute and trigger the load
		// function when the image is downloaded
		
		content.html(img.attr('src', src));

	});

	function showCropButton(c) {
		if (c.w == 0 || c.h == 0) {
			cropButton.hide();
		} else {
			cropButton.show();
			coordinates = c;
		}
	}

	function showError(err){
		errorMessage.text(err);
		errorModal.modal('show');
	}

	cropButton.click(function() {
		
		coordinates.x = Math.round(coordinates.x * ratio);
		coordinates.y = Math.round(coordinates.y * ratio);
		coordinates.w = Math.round(coordinates.w * ratio);
		coordinates.h = Math.round(coordinates.h * ratio);
		
		progressBar.modal('show');
		
		$.post('crop.php', {
			
			'coordinates' : coordinates,
			'src' : src
			
		}, function(r) {

			// Notice the "one" method - this
			// executes the callback only once
			
			progressBar.modal('hide').one('hidden', function() {
				
				cropModal.find('.modal-body').html('<img src="' + r + '" >');
				
				setTimeout(function() {
					cropModal.modal('show');
				}, 500);
				
			});
	
		});
	});
}); 