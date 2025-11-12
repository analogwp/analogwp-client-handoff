<?php
/**
 * Plugin Name: Site Notes
 * Plugin URI: https://github.com/analogwp/analogwp-site-notes
 * Description: A comprehensive solution for agency-client transitions with visual commenting system, maintenance scheduling, and client-friendly editing mode.
 * Version: 1.0.1
 * Author: AnalogWP
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: analogwp-site-notes
 * Requires at least: 6.2
 * Tested up to: 6.8.3
 * Requires PHP: 7.4
 *
 * @package AnalogWP_Site_Notes
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants.
if ( ! defined( 'AGWP_SN_VERSION' ) ) {
	define( 'AGWP_SN_VERSION', '1.0.1' );
}

if ( ! defined( 'AGWP_SN_PLUGIN_URL' ) ) {
	define( 'AGWP_SN_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

if ( ! defined( 'AGWP_SN_PLUGIN_PATH' ) ) {
	define( 'AGWP_SN_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'AGWP_SN_PLUGIN_FILE' ) ) {
	define( 'AGWP_SN_PLUGIN_FILE', __FILE__ );
}

/**
 * Load the main plugin class.
 */
require_once AGWP_SN_PLUGIN_PATH . 'includes/class-plugin.php';

\AnalogWP\SiteNotes\Plugin::load();
