<?php

/*
Plugin Name: Todo App
Plugin URI: http://tutorialzine.com
Description: This is a demo plugin for a Tutorialzine tutorial
Version: 1.0
Author: Martin Angelov
Author URI: http://tutorialzine.com
License: GPL2
*/


define('TZ_TODO_FILE', __FILE__);
define('TZ_TODO_PATH', plugin_dir_path(__FILE__));

require TZ_TODO_PATH.'includes/tzTodo.php';

new tzTodo();



?>