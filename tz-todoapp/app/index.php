<?php

// Including the WordPress load file so
// we have access to the wordpress API
//require dirname(__FILE__).'/../../../../wp-load.php';

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Todo App Powered By WordPress | Tutorialzine Demo</title>
        
        <base href="<?php echo $base_url ?>"></base>
        
        <!-- The stylesheets -->
        <link rel="stylesheet" href="assets/css/styles.css" />
        
        <!--[if lt IE 9]>
          <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
        
        
        <script>
        
        	// This is the URL where we need to make our AJAX calls.
        	// We are making it available to JavaScript as a global variable.
        	
        	var ajaxurl = '<?php echo admin_url('admin-ajax.php')?>';
        </script>
    </head>
    
    <body>

		<div id="todo">
			<h2>Todo List <a href="#" class="add" title="Add new todo item!">✚</a></h2>
			<ul>
				<?php
				
					$query = new WP_Query( array( 'post_type'=>'tz_todo', 'order'=>'ASC'));
					
					// The Loop
					while ( $query->have_posts() ) : 
						$query->the_post();
						$done = get_post_meta(get_the_id(), 'status', true) == 'Completed';
					?>
					
						<li data-id="<?php the_id()?>" class="<?php echo ($done ? 'done' : '')?>">
							<input type="checkbox" <?php echo ($done ? 'checked="true"' : '')?> /> 
							<input type="text" value="<?php htmlspecialchars(the_title())?>" placeholder="Write your todo here" />
							<a href="#" class="delete" title="Delete">✖</a>
						</li>
					
					<?php endwhile; ?>
			</ul>
		</div>

        <footer>
	        <h2><i>Tutorial:</i> Todo App Powered By WordPress</h2>
            <a class="tzine" href="http://tutorialzine.com/2012/10/todo-app-wordpress/">Head on to <i>Tutorial<b>zine</b></i> to read and download</a>
        </footer>
        
        <!-- JavaScript includes.  -->
		<script src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
		<script src="assets/js/script.js"></script>

        <!-- BSA AdPacks code. Please ignore and remove.--> 
        <script src="http://cdn.tutorialzine.com/misc/adPacks/v1.js" async></script>
        
    </body>
</html>