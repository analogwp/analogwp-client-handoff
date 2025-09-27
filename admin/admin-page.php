<?php
// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="wrap">
	<h1><?php _e( 'Client Handoff Toolkit', 'client-handoff-toolkit' ); ?></h1>
	
	<div class="cht-admin-dashboard">
		<div class="cht-stats-grid">
			<div class="cht-stat-card">
				<h3><?php _e( 'Open Comments', 'client-handoff-toolkit' ); ?></h3>
				<div class="cht-stat-number" id="open-comments-count">0</div>
			</div>
			
			<div class="cht-stat-card">
				<h3><?php _e( 'Resolved Comments', 'client-handoff-toolkit' ); ?></h3>
				<div class="cht-stat-number" id="resolved-comments-count">0</div>
			</div>
			
			<div class="cht-stat-card">
				<h3><?php _e( 'Total Comments', 'client-handoff-toolkit' ); ?></h3>
				<div class="cht-stat-number" id="total-comments-count">0</div>
			</div>
		</div>
		
		<div class="cht-settings-section">
			<h2><?php _e( 'Settings', 'client-handoff-toolkit' ); ?></h2>
			
			<form method="post" action="options.php">
				<?php
				settings_fields( 'cht_settings' );
				do_settings_sections( 'cht_settings' );
				?>
				
				<table class="form-table">
					<tr>
						<th scope="row">
							<label for="cht_enable_frontend_comments">
								<?php _e( 'Enable Frontend Comments', 'client-handoff-toolkit' ); ?>
							</label>
						</th>
						<td>
							<input type="checkbox" id="cht_enable_frontend_comments" 
								   name="cht_enable_frontend_comments" value="1" 
								   <?php checked( get_option( 'cht_enable_frontend_comments', 1 ) ); ?> />
							<p class="description">
								<?php _e( 'Allow users to add visual comments on the frontend.', 'client-handoff-toolkit' ); ?>
							</p>
						</td>
					</tr>
					
					<tr>
						<th scope="row">
							<label for="cht_auto_screenshot">
								<?php _e( 'Auto Screenshot', 'client-handoff-toolkit' ); ?>
							</label>
						</th>
						<td>
							<input type="checkbox" id="cht_auto_screenshot" 
								   name="cht_auto_screenshot" value="1" 
								   <?php checked( get_option( 'cht_auto_screenshot', 1 ) ); ?> />
							<p class="description">
								<?php _e( 'Automatically capture screenshots of commented elements.', 'client-handoff-toolkit' ); ?>
							</p>
						</td>
					</tr>
					
					<tr>
						<th scope="row">
							<label for="cht_comment_roles">
								<?php _e( 'Allowed User Roles', 'client-handoff-toolkit' ); ?>
							</label>
						</th>
						<td>
							<?php
							$roles = wp_roles()->get_names();
							$allowed_roles = get_option( 'cht_comment_roles', array( 'administrator', 'editor' ) );
							?>
							
							<?php foreach ( $roles as $role_key => $role_name ) : ?>
								<label>
									<input type="checkbox" name="cht_comment_roles[]" 
										   value="<?php echo esc_attr( $role_key ); ?>"
										   <?php checked( in_array( $role_key, $allowed_roles ) ); ?> />
									<?php echo esc_html( $role_name ); ?>
								</label><br>
							<?php endforeach; ?>
							
							<p class="description">
								<?php _e( 'Select which user roles can add visual comments.', 'client-handoff-toolkit' ); ?>
							</p>
						</td>
					</tr>
				</table>
				
				<?php submit_button(); ?>
			</form>
		</div>
		
		<div class="cht-recent-comments">
			<h2><?php _e( 'Recent Comments', 'client-handoff-toolkit' ); ?></h2>
			<div id="cht-recent-comments-list">
				<!-- Comments will be loaded here via AJAX -->
			</div>
		</div>
	</div>
</div>

<style>
.cht-admin-dashboard {
	margin-top: 20px;
}

.cht-stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 20px;
	margin-bottom: 30px;
}

.cht-stat-card {
	background: #fff;
	border: 1px solid #c3c4c7;
	border-radius: 4px;
	padding: 20px;
	text-align: center;
	box-shadow: 0 1px 1px rgba(0,0,0,0.04);
}

.cht-stat-card h3 {
	margin: 0 0 10px 0;
	font-size: 14px;
	color: #646970;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.cht-stat-number {
	font-size: 32px;
	font-weight: bold;
	color: #2271b1;
}

.cht-settings-section,
.cht-recent-comments {
	background: #fff;
	border: 1px solid #c3c4c7;
	border-radius: 4px;
	padding: 20px;
	margin-bottom: 20px;
	box-shadow: 0 1px 1px rgba(0,0,0,0.04);
}

.cht-settings-section h2,
.cht-recent-comments h2 {
	margin-top: 0;
	padding-bottom: 10px;
	border-bottom: 1px solid #c3c4c7;
}

#cht-recent-comments-list {
	margin-top: 15px;
}
</style>
