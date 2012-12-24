$(function(){

	var saveTimer;
	var todoHolder = $('#todo');

	// Listen for the input event in the text fields:
	todoHolder.on('input','li input[type=text]', function(e){

		// This callback is run on every key press
		
		var todo = $(this),
			li = todo.closest('li');
			
		// We are clearing the save timer, so that 
		// sending the AJAX request will only 
		// happen once the user has stopped typing
		
		clearTimeout(saveTimer);
		
		saveTimer = setTimeout(function(){
			
			ajaxAction('save', li.data('id'), todo.val()).done(function(r){
				if(r.id != li.data('id')){
					// The item has been written to the database
					// for the first time. Update its id.
					li.data('id', r.id);
				}
			});
			
		}, 1000);
		
	});
		
	// Listen for change events on the checkboxes
	todoHolder.on('change', 'li input[type=checkbox]',function(e){
		
		var checkbox = $(this),
			li = checkbox.closest('li');
		
		li.toggleClass('done',checkbox.is(':checked'));
		
		if(checkbox.is(':checked')){
			ajaxAction('check', li.data('id'));
		}
		else{
			ajaxAction('uncheck', li.data('id'));
		}
		
	});
	
	// Listen for clicks on the delete link
	todoHolder.on('click', 'li .delete',function(e){
		
		e.preventDefault();
		
		var li = $(this).closest('li');
		
		li.fadeOut(function(){
			li.remove();
		});
		
		if(li.data('id') != 0){
			
			// No need to delete items if they are missing an id.
			// This would mean that the item we are deleting
			// does not exist in the database, so the AJAX 
			// request is unnecessary.
			ajaxAction('delete', li.data('id'));
		}
				
	});
	
	// Clicks on the add new item button)
	todoHolder.on('click','a.add', function(e){
		e.preventDefault();
		
		var item = $('<li data-id="0">'+
			'<input type="checkbox" /> <input type="text" val="" placeholder="Write your todo here" />'+
			'<a href="#" class="delete">✖</a>'+
			'</li>');
		
		todoHolder.find('ul').append(item);
		
		// We are not running an AJAX request when creating elements.
		// We are only writing them to the database when text is entered.
	});
	
	// A help function for running AJAX requests
	function ajaxAction(verb, id, data){
		
		// Notice that we are returning a deferred
		
		return $.post(ajaxurl, {
			'action': 'tz_ajax', 
			'verb':verb, 
			'id': id, 
			'data': data
		}, 'json');

	}
});
