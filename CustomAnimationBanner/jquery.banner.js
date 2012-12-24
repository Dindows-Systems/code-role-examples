(function($) {
	$.fn.banner = function(options) {
		var opts = $.extend({}, $.fn.banner.defaults, options);
		return this.each(function() {
			$this 				= $(this);
			var o 				= $.meta ? $.extend({}, opts, $this.data()) : opts;
			var banner_width 	= $this.width();
			//the areas
			var $areas			= $this.find('.ca_zone');
			//no step for now
			var step 			= 0;
			//change step from o.speed in o.speed seconds
			if(o.steps.length > 0)
			setInterval(function(){
				++step;
				//from last jump to first
				if(step > o.total_steps) step = 1;
				
				$areas.each(function(){
					var $area 		= $(this);
					var idx			= $area.index();
					//the element where the images are located for this area
					var $wrap		= $area.find('.ca_wrap');
					//current shown image
					var $current	= $wrap.find('img:visible');
					var current_idx = $current.index();
					var config		= o.steps[step-1][idx];
					//the next image position
					var next_idx 	= config[0].to;
					//the effect to use
					var effect		= config[1].effect;
					//if it's a different image than the current one:
					if(parseInt(current_idx+1) != next_idx){
						//next element to appear
						var $next 	= $wrap.find('img:nth-child('+ next_idx +')');
						$next.css({'width':'100%','height':'100%'});
						//which effect to use?
						switch(effect){
							case 'zoomOut-zoomInRotated':
								$next.css({'width':'0px','height':'0px'}).show();
								$current.stop().animate({'width':'0px','height':'0px'},300,function(){
									$current.removeClass('ca_shown').hide();
									$next.addClass('ca_shown').stop().animate({'width':'100%','height':'100%','rotate':'1080deg'},300);
								});
								break;
							case 'zoomOutRotated-zoomInRotated':
								$next.css({'width':'0px','height':'0px'}).show();
								$current.stop().animate({'width':'0px','height':'0px','rotate':'1080deg'},300,function(){
									$current.removeClass('ca_shown').hide();
									$next.addClass('ca_shown').stop().animate({'width':'100%','height':'100%','rotate':'1080deg'},300);
								});
								break;	
							case 'zoomOut-zoomIn':
								$next.css({'width':'0px','height':'0px'}).show();
								$current.stop().animate({'width':'0px','height':'0px'},300,function(){
									$current.removeClass('ca_shown').hide();
									$next.addClass('ca_shown').stop().animate({'width':'100%','height':'100%'},300);
								});
								break;
							case 'slideOutRight-slideInRight':
								$area.data('l',$area.css('left'));
								$area.stop().animate({'left': banner_width + 20 + 'px'},300,function(){
									$current.removeClass('ca_shown').hide();
									$next.addClass('ca_shown').show();
									$area.animate({'left': $area.data('l')},300);//try 'easeOutBack'
								});
								break;	
							case 'slideOutLeft-slideInLeft':
								$area.data('l',$area.css('left'));
								$area.stop().animate({'left': 0-$area.width()-20 + 'px'},300,function(){
									$current.removeClass('ca_shown').hide();
									$next.addClass('ca_shown').show();
									$area.animate({'left': $area.data('l')},300);
								});
								break;
							case 'slideOutTop-slideInTop':
								$area.data('t',$area.css('top'));
								$area.stop().animate({'top': 0-$area.height()-20 + 'px'},300,function(){
									$current.removeClass('ca_shown').hide();
									$next.addClass('ca_shown').show();
									$area.animate({'top': $area.data('t')},300,'easeOutBounce');
								});
								break;
							case 'slideOutBottom-slideInTop':
								$area.data('t',$area.css('top'));
								
								$area.stop().animate({'top': $area.height()+20 + 'px'},300,function(){
									$area.css('top',0-$area.height()-20 + 'px');
									$current.removeClass('ca_shown').hide();
									$next.addClass('ca_shown').show();
									$area.animate({'top': $area.data('t')},300,'easeOutBounce');
								});
								break;
							case 'slideOutTop-slideInBottom':
								$area.data('t',$area.css('top'));
								
								$area.stop().animate({'top': 0-$area.height()-20 + 'px'},300,function(){
									$area.css('top',$area.height()+20 + 'px');
									$current.removeClass('ca_shown').hide();
									$next.addClass('ca_shown').show();
									$area.animate({'top': $area.data('t')},300,'easeInOutBack');
								});
								break;
							/*
							Other possible effects:
							
							case 'fadeOut-fadeIn':
								$current.fadeOut(500,function(){
									$current.removeClass('ca_shown');
									$next.fadeIn(700,function(){$(this).addClass('ca_shown')});
								});
								break;
							case 'fadeOut-zoomIn':
								$next.css({'width':'0px','height':'0px'}).show();
								$current.fadeOut(500,function(){
									$current.removeClass('ca_shown');
									$next.addClass('ca_shown').stop().animate({'width':'100%','height':'100%'},500);
								});
								break;
								
							case 'zoomOut-fadeIn':
								$current.stop().animate({'width':'0px','height':'0px'},300,function(){
									$current.removeClass('ca_shown').hide();
									$next.fadeIn(700,function(){$(this).addClass('ca_shown')});
								});
								break;
							
							etc...	
							*/		
							default:
								$current.removeClass('ca_shown').hide();
								$next.addClass('ca_shown').show();
						}
					}
						
				});
			},o.speed);
		});
	};
	$.fn.banner.defaults = {
		steps   	: [],
		total_steps : 1,
		speed		: 5000	
	};	
})(jQuery);