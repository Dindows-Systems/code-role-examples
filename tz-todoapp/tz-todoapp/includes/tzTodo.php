<?php

class tzTodo {
	
	public function __construct(){
		
		add_action( 'init', array($this,'init'));
		add_filter( "manage_tz_todo_posts_columns", array($this, 'change_columns'));
		
		// The two last optional arguments to this function are the 
		// priority (10) and number of arguments that the function expects (2):
		
		add_action( "manage_posts_custom_column", array($this, "custom_columns") , 10, 2 );
		
		// These hooks will handle AJAX interactions. We need to handle
		// ajax requests from both logged in users and anonymous ones:
		
		add_action('wp_ajax_nopriv_tz_ajax', array($this,'ajax'));
		add_action('wp_ajax_tz_ajax', array($this,'ajax'));
	}
	
	public function init(){
		
		// When a URL like /todo is requested from the,
		// blog we will directly include the index.php
		// file of the application and exit 
		
		if( preg_match('/\/todo\/?$/',$_SERVER['REQUEST_URI'])){
			$base_url = plugins_url( 'app/' , TZ_TODO_FILE);
			require TZ_TODO_PATH.'/app/index.php';
			exit;
		}
		
		$this->add_post_type();
	}

	// This method is called when an
	// AJAX request is made to the plugin
	
	public function ajax(){
		$id = -1; 
		$data = '';
		$verb = '';
		
		$response = array();
		
		if(isset($_POST['verb'])){
			$verb = $_POST['verb'];
		}
		
		if(isset($_POST['id'])){
			$id = (int)$_POST['id'];
		}
		
		if(isset($_POST['data'])){
			$data = wp_strip_all_tags($_POST['data']);
		}
		
		$post = null;
		
		if($id != -1){
			$post = get_post($id);
			
			// Make sure that the passed id actually
			// belongs to a post of the tz_todo type
			
			if($post && $post->post_type != 'tz_todo'){
				exit;
			}
		}
		
		switch($verb){
			case 'save':
				
				$todo_item = array(
					'post_title' => $data,
					'post_content' => '',
					'post_status' => 'publish',
					'post_type' => 'tz_todo',
				);
				
				if($post){
					
					// Adding an id to the array will cause 
					// the post with that id to be edited
					// instead of a new entry to be created.
					
					$todo_item['ID'] = $post->ID;
				}
				
				$response['id'] = wp_insert_post($todo_item);
			break;
			
			case 'check':
				
				if($post){
					update_post_meta($post->ID, 'status', 'Completed');
				}
				
			break;
			
			case 'uncheck':
				
				if($post){
					delete_post_meta($post->ID, 'status');
				}
				
			break;
			
			case 'delete':
				if($post){
					wp_delete_post($post->ID);
				}
			break;
		}
	
		// Print the response as json and exit
		header("Content-type: application/json");
		die(json_encode($response));
		 
	}
	
	private function add_post_type(){
		
		// The register_post_type function
		// will make a new Todo item entry
		// in the wordpress admin menu
		
		register_post_type( 'tz_todo',
			array(
				'labels' => array(
					'name' => __( 'Todo items' ),
					'singular_name' => __( 'Todo item' )
				),
				'public' => true,
				'supports' => array('title')	// Only a title is allowed for this type
			)
		);
	}
	
	public function change_columns($cols){
		
		// We need to customize the columns 
		// shown when viewing the Todo items
		// post type to include a status field
		
		$cols = array(
			'cb'       => '<input type="checkbox" />',
			'title'      => __( 'Task' ),
			'status' => __( 'Status' ),
			'date'     => __( 'Date' ),
		);
		
		return $cols;
	}

	public function custom_columns( $column, $post_id ) {
		
		// Add content to the status column
		
		switch ( $column ) {

			case "status":
				// We are requesting the status meta item
				
				$status = get_post_meta( $post_id, 'status', true);
				
				if($status != 'Completed'){
					$status = 'Not completed';
				}
				
				echo $status;
				
				break;
		}
	}
	
}
