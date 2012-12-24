$(document).ready(function(){
	var jqDockOpts = {duration: 200};
	$('#dock').jqDock(jqDockOpts);
	$('body').css({overflow: "hidden"});
	
	//initial hiding of dashboard + addition of 'closeZone'
	$('#dashboardWrapper')
		.css({
			position: 'absolute',
			top: '0px',
			left: '0px',
			width: '100%',
			height: '100%',
			opacity: '0'
		})
		.hide()
		.append('<div id="closeZone"></div>');
	
	//initial hiding of #dashPanel and addable widgets
	$('#addWidgets').css({bottom: '-118px'});
		
	//Position, and hiding of 'CloseZone'
	$('#closeZone')
		.css({
			position: 'absolute',
			top: '0px',
			left: '0px',
			zIndex: '99',
			width: '100%',
			height: '100%',
			opacity: '0.5',
			background: '#000'
		});
	
	//Launch Dashboard + initiation of 'closeZone'
	$('#dashboardLaunch').click(function(){
		$('#dashboardWrapper')
			.show()
			.animate({opacity: '1'}, 300);
	});
	
	//closeZone's job: closing the Dashboard
	$('#closeZone').click(function(){
		$('#dashboardWrapper')
			.animate({opacity: '0'}, 300)
			.hide(1);
		$('#openAddWidgets').css({background: 'url(images/opendashpanel.png)'});
		$('#addWidgets').animate({bottom: '-118px'}, 500);
		$('.closeWidget').hide();
	});
	
	//fadeout of dashboard and when a link is clicked within
	$('#dashboardWrapper a').click(function(){
		$('#dashboardWrapper').animate({opacity: '0'}, 300);
	});
	
	//draggables defenition
	$('.widget').draggable();
	$('.draggableWindow').draggable({handle: 'h1'});
	$('#addWidgets ul li img').draggable({helper: 'clone'});
	
	//droppable defenition
	$('#closeZone').droppable({
		accept: '.widgetThumb',
		drop: function(ev, ui){
			var x = ev.clientX - 100;
			var y = ev.clientY - 50;
			var widgetType = $(ui.draggable).attr('id');
			$('#widgets').append('<li class="widget '+widgetType+'Widget" style="left: '+ x +'px; top: '+ y +'px;"><img src="images/widgets/'+widgetType+'.png" alt="" /></li>');
			$('.stickyWidget').append('<textarea></textarea>');//needed to add textarea to newest DOM member
			$('.widget').draggable(); //needed to 'draggable' the newest DOM member
			$('.widget').append('<span class="closeWidget"><img src="images/closebox.png" alt=""/></span>');
			//click function of newest DOM element.
			$('.closeWidget').click(function(){
				$(this).parent().animate({opacity: '0'}, 300).animate({left: '-9999em'},1);
			});
		}
	});
	
	//Open finder from desktop item
	$('#macintoschHD').dblclick(function(){
		alert("Hey... Gimme a break, I've worked hard at this!");
	});
	
	//stacks
	$('.stack>img').toggle(function(){
		var vertical = 0;
		var horizontal = 0;
		$('~ul>li', this).each(function(){
			$(this).animate({top: '-' +vertical + 'px', left: horizontal + 'px'}, 300);
			vertical = vertical + 50;
			horizontal = (horizontal+1)*2;
		});
		$('~ul', this).animate({top: '-50px', left: '10px'}, 300).addClass('openStack');
		$('~ul>li>img', this).animate({width: '50px', marginLeft: '9px'}, 300);
	}, function(){
		//reverse above
		$('~ul',this).removeClass('openStack').children('li').animate({top: '20px', left: '-10px'}, 300);
		$('~ul>li>img',this).animate({width: '79px', marginLeft: '0'}, 300);
		//width: 50px;
	});
	
	//open/closing of the dashpanel
	$('#openAddWidgets').toggle(function(){
		//this opens the dashboard, animation and all, adds 'close' xs to widgets
		$(this).css({background: 'url(images/closedashpanel.png)'});
		$('#addWidgets').animate({bottom: '0px'}, 500);
		$('.widget').append('<span class="closeWidget"><img src="images/closebox.png" alt=""/></span>');
		//click function of newest DOM element.
		$('.closeWidget').click(function(){
			$(this).parent().animate({opacity: '0'}, 300).animate({left: '-9999em'},1);
		});
	}, function(){
		//opposite to above
		$(this).css({background: 'url(images/opendashpanel.png)'});
		$('#addWidgets').animate({bottom: '-118px'}, 500);
		$('.closeWidget').hide();
	});
});