$(document).ready(function(){
	
    var saveTimer,
    	searchBox = $('#q'),
    	products =  $('#products'),
    	message = $('#message'),
    	preloader = $('#preload');
    
    preloader.css('visibility','hidden');
  
    searchBox.on('input',function(e){
    	
        // Clearing the timeout prevents
        // saving on every key press
        clearTimeout(saveTimer);
        
        // If the field is not empty, schedule a search
        if($.trim(searchBox.val()).length > 0) {
            saveTimer = setTimeout(ajaxProductsSearch, 2000);
        }
    });
    
    $('form').submit(function(e){
		e.preventDefault();
		
		if($.trim(searchBox.val()).length > 0) {
			clearTimeout(saveTimer);
			ajaxProductsSearch();
		}
    });
    
    function ajaxProductsSearch(){
    	
        products.empty();
        preloader.css('visibility','visible')
        
        // Issue a request to the proxy
        $.post('proxy.php', {
            'search' : searchBox.val()
        },
        function(data) {
       
       		if(data.totalItems == 0){
       			
       			preloader.css('visibility','hidden');
       			message.html("We couldn't find anything!").show();
       			return false;
       		}
       
            $.each(data.items, function(i, item){
            	
                var html = ' <a class="product" data-price="$ '+item.product.inventories[0]['price']+'" href="'+item.product['link']+'" target="_blank">';
                
                // If the product has images
                if(item.product.images && item.product.images.length > 0){
                	html += '<img alt="'+item.product.author['name']+'" src="'+ item.product.images[0]['link']+'"/>';
                }
                                        
                html+='<span>'+item.product.author['name'].substr(0, 20)+'</span></a> ';
                                         
                
                products.append(html);
            });
            
            preloader.css('visibility','hidden');
            
        },'json');
    }
    
});
