<?php
/**
 * Main class for the plugin.
 *
 * @copyright SmallTownDev
 * @package AnalogWP\SiteNotes
 */

namespace AnalogWP\SiteNotes;

use AnalogWP\SiteNotes\Admin\Admin;
use AnalogWP\SiteNotes\Ajax\Ajax;
use AnalogWP\SiteNotes\Assets;

/**
 * Main plugin class
 *
 * @since 1.0.0
 */
final class Plugin {

	/**
	 * Plugin instance.
	 *
	 * @since 1.0.0
	 * @var Plugin|null
	 */
	private static $instance = null;

	/**
	 * Database manager instance.
	 *
	 * @since 1.0.0
	 * @var Database|null
	 */
	public $database = null;

	/**
	 * Admin manager instance.
	 *
	 * @since 1.0.0
	 * @var Admin|null
	 */
	public $admin = null;

	/**
	 * AJAX manager instance.
	 *
	 * @since 1.0.0
	 * @var Ajax|null
	 */
	public $ajax = null;

	/**
	 * Assets manager instance.
	 *
	 * @since 1.0.0
	 * @var Assets|null
	 */
	public $assets = null;

	/**
	 * Get plugin instance.
	 *
	 * @since 1.0.0
	 * @return Plugin|null
	 */
	public static function get_instance() {
		return self::$instance;
	}

	/**
	 * Loads the plugin main instance and initializes it.
	 *
	 * @return bool True if the plugin main instance could be loaded, false otherwise.
	 */
	public static function load() {
		if ( null !== self::$instance ) {
			return false;
		}

		self::$instance = new self();
		self::$instance->init();

		do_action( 'analog_site_notes_loaded' );

		return true;
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		$this->includes();
	}

	/**
	 * Include required files.
	 *
	 * @since 1.0.0
	 */
	private function includes() {
		// Core classes.
		require_once AGWP_SN_PLUGIN_PATH . 'includes/class-database.php';
		require_once AGWP_SN_PLUGIN_PATH . 'includes/class-assets.php';
		require_once AGWP_SN_PLUGIN_PATH . 'includes/admin/class-admin.php';
		require_once AGWP_SN_PLUGIN_PATH . 'includes/ajax/class-ajax.php';
		require_once AGWP_SN_PLUGIN_PATH . 'includes/class-extensions.php';
	}

	/**
	 * Initialize plugin.
	 *
	 * @since 1.0.0
	 */
	private function init() {
		// Initialize core components.
		$this->database = new Database();
		$this->assets   = new Assets();
		$this->admin    = new Admin();
		$this->ajax     = new Ajax();

		// Multisite: Create tables when a new site is created.
		if ( is_multisite() ) {
			add_action( 'wpmu_new_blog', array( $this, 'create_tables_on_new_blog' ), 10, 1 );
			add_filter( 'wpmu_drop_tables', array( $this, 'drop_tables_on_blog_delete' ) );
		}

		// Register activation and deactivation hooks.
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );
	}

	/**
	 * Plugin activation.
	 *
	 * @since 1.0.0
	 * @param bool $network_wide Whether the plugin is being activated network-wide.
	 */
	public function activate( $network_wide = false ) {
		// Create database tables.
		if ( ! $this->database ) {
			$this->database = new Database();
		}

		// Handle multisite activation.
		if ( is_multisite() && $network_wide ) {
			// Get all blogs.
			$blog_ids = get_sites( array( 'fields' => 'ids' ) );

			foreach ( $blog_ids as $blog_id ) {
				switch_to_blog( $blog_id );
				$this->database->create_tables();
				update_option( 'agwp_sn_version', AGWP_SN_VERSION );
				restore_current_blog();
			}
		} else {
			// Single site or single blog activation.
			$this->database->create_tables();
			update_option( 'agwp_sn_version', AGWP_SN_VERSION );
		}

		// Flush rewrite rules.
		flush_rewrite_rules();

		do_action( 'agwp_sn_activated' );
	}

	/**
	 * Plugin deactivation.
	 *
	 * @since 1.0.0
	 */
	public function deactivate() {
		// Flush rewrite rules.
		flush_rewrite_rules();

		do_action( 'agwp_sn_deactivated' );
	}

	/**
	 * Create tables when a new blog is created in multisite.
	 *
	 * @since 1.0.0
	 * @param int $blog_id Blog ID of the created blog.
	 */
	public function create_tables_on_new_blog( $blog_id ) {
		if ( ! is_multisite() ) {
			return;
		}

		switch_to_blog( $blog_id );
		$this->database->create_tables();
		update_option( 'agwp_sn_version', AGWP_SN_VERSION );
		restore_current_blog();
	}

	/**
	 * Drop plugin tables when a blog is deleted in multisite.
	 *
	 * @since 1.0.0
	 * @param array $tables Tables to drop.
	 * @return array Modified tables array.
	 */
	public function drop_tables_on_blog_delete( $tables ) {
		global $wpdb;

		$tables[] = $wpdb->prefix . 'agwp_sn_comments';
		$tables[] = $wpdb->prefix . 'agwp_sn_comment_replies';

		return $tables;
	}

	/**
	 * Check if current user has access to site notes functionality.
	 *
	 * @since 1.0.0
	 * @return bool True if user has access.
	 */
	public static function user_has_access() {
		// Administrators always have access.
		if ( current_user_can( 'manage_options' ) ) {
			return true;
		}

		// Get allowed roles from settings.
		$settings      = get_option( 'agwp_sn_settings', array() );
		$allowed_roles = isset( $settings['general']['allowed_roles'] ) ? $settings['general']['allowed_roles'] : array( 'administrator', 'editor' );

		// Ensure administrator is always in the list.
		if ( ! in_array( 'administrator', $allowed_roles, true ) ) {
			$allowed_roles[] = 'administrator';
		}

		// Get current user.
		$user = wp_get_current_user();

		if ( ! $user || ! $user->exists() ) {
			return false;
		}

		// Check if user has any of the allowed roles.
		foreach ( $allowed_roles as $role ) {
			if ( in_array( $role, $user->roles, true ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if frontend comments are enabled.
	 *
	 * @since 1.0.0
	 * @return bool True if frontend comments are enabled.
	 */
	public static function frontend_comments_enabled() {
		$settings = get_option( 'agwp_sn_settings', array() );
		return isset( $settings['general']['enable_frontend_comments'] ) ? (bool) $settings['general']['enable_frontend_comments'] : true;
	}

	/**
	 * Prevent cloning.
	 *
	 * @since 1.0.0
	 */
	private function __clone() {}

	/**
	 * Prevent unserialization.
	 *
	 * @since 1.0.0
	 */
	public function __wakeup() {}
}
