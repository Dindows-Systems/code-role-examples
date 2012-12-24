$(function(){
	
	if($.adblock){
		$.confirm({
			'title'		: 'Adblocker active!',
			'message'	: 'You are running an adblocker extension in your browser. You made a kitten cry. If you wish to continue to this website you might consider disabling it.',
			'buttons'	: {
				'I will!'	: {
					'class'	: 'blue',
					'action': function(){
						// Do nothing
						return;
					}
				},
				'Never!'	: {
					'class'	: 'gray',
					'action': function(){
						// Redirect to some page
						window.location = 'http://tutorialzine.com/';
					}
				}
			}
		});
	}
	
	
});
