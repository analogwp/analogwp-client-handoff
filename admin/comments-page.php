<?php
// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Get all comments for admin view
global $wpdb;
$table_name = $wpdb->prefix . 'cht_comments';
$replies_table = $wpdb->prefix . 'cht_comment_replies';

$comments = $wpdb->get_results(
	"
    SELECT c.*, u.display_name, p.post_title
    FROM $table_name c
    LEFT JOIN {$wpdb->users} u ON c.user_id = u.ID
    LEFT JOIN {$wpdb->posts} p ON c.post_id = p.ID
    ORDER BY c.created_at DESC
"
);
?>

<div class="wrap">
	<h1><?php _e( 'Visual Comments Management', 'client-handoff-toolkit' ); ?></h1>
	
	<div class="cht-comments-dashboard">
		<div class="cht-filter-bar">
			<select id="cht-status-filter">
				<option value=""><?php _e( 'All Statuses', 'client-handoff-toolkit' ); ?></option>
				<option value="open"><?php _e( 'Open', 'client-handoff-toolkit' ); ?></option>
				<option value="in_progress"><?php _e( 'In Progress', 'client-handoff-toolkit' ); ?></option>
				<option value="resolved"><?php _e( 'Resolved', 'client-handoff-toolkit' ); ?></option>
			</select>
			
			<input type="text" id="cht-search-comments" placeholder="<?php _e( 'Search comments...', 'client-handoff-toolkit' ); ?>" />
			
			<button type="button" class="button" id="cht-export-comments">
				<?php _e( 'Export CSV', 'client-handoff-toolkit' ); ?>
			</button>
		</div>
		
		<div class="cht-comments-table-wrap">
			<table class="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						<th><?php _e( 'Screenshot', 'client-handoff-toolkit' ); ?></th>
						<th><?php _e( 'Comment', 'client-handoff-toolkit' ); ?></th>
						<th><?php _e( 'Page/Post', 'client-handoff-toolkit' ); ?></th>
						<th><?php _e( 'Author', 'client-handoff-toolkit' ); ?></th>
						<th><?php _e( 'Status', 'client-handoff-toolkit' ); ?></th>
						<th><?php _e( 'Date', 'client-handoff-toolkit' ); ?></th>
						<th><?php _e( 'Actions', 'client-handoff-toolkit' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php if ( empty( $comments ) ) : ?>
						<tr>
							<td colspan="7" class="no-comments">
								<?php _e( 'No comments found. Start by enabling visual comments on your frontend pages.', 'client-handoff-toolkit' ); ?>
							</td>
						</tr>
					<?php else : ?>
						<?php foreach ( $comments as $comment ) : ?>
							<tr data-comment-id="<?php echo esc_attr( $comment->id ); ?>" 
								data-status="<?php echo esc_attr( $comment->status ); ?>">
								<td class="screenshot-column">
									<?php if ( $comment->screenshot_url ) : ?>
										<img src="<?php echo esc_url( $comment->screenshot_url ); ?>" 
											 alt="<?php _e( 'Comment Screenshot', 'client-handoff-toolkit' ); ?>"
											 class="cht-screenshot-thumb" />
									<?php else : ?>
										<span class="no-screenshot"><?php _e( 'No screenshot', 'client-handoff-toolkit' ); ?></span>
									<?php endif; ?>
								</td>
								
								<td class="comment-column">
									<div class="comment-text">
										<?php echo esc_html( wp_trim_words( $comment->comment_text, 20 ) ); ?>
									</div>
									<?php if ( $comment->element_selector ) : ?>
										<div class="element-selector">
											<small><?php _e( 'Element:', 'client-handoff-toolkit' ); ?> 
											<code><?php echo esc_html( $comment->element_selector ); ?></code></small>
										</div>
									<?php endif; ?>
								</td>
								
								<td>
									<?php if ( $comment->post_title ) : ?>
										<a href="<?php echo esc_url( $comment->page_url ); ?>" target="_blank">
											<?php echo esc_html( $comment->post_title ); ?>
										</a>
									<?php else : ?>
										<a href="<?php echo esc_url( $comment->page_url ); ?>" target="_blank">
											<?php _e( 'View Page', 'client-handoff-toolkit' ); ?>
										</a>
									<?php endif; ?>
								</td>
								
								<td><?php echo esc_html( $comment->display_name ); ?></td>
								
								<td>
									<select class="cht-status-dropdown" data-comment-id="<?php echo esc_attr( $comment->id ); ?>">
										<option value="open" <?php selected( $comment->status, 'open' ); ?>><?php _e( 'Open', 'client-handoff-toolkit' ); ?></option>
										<option value="in_progress" <?php selected( $comment->status, 'in_progress' ); ?>><?php _e( 'In Progress', 'client-handoff-toolkit' ); ?></option>
										<option value="resolved" <?php selected( $comment->status, 'resolved' ); ?>><?php _e( 'Resolved', 'client-handoff-toolkit' ); ?></option>
									</select>
								</td>
								
								<td><?php echo esc_html( mysql2date( 'M j, Y g:i A', $comment->created_at ) ); ?></td>
								
								<td class="actions-column">
									<button type="button" class="button button-small cht-view-comment" 
											data-comment-id="<?php echo esc_attr( $comment->id ); ?>">
										<?php _e( 'View', 'client-handoff-toolkit' ); ?>
									</button>
									
									<button type="button" class="button button-small cht-goto-page" 
											data-url="<?php echo esc_attr( $comment->page_url ); ?>"
											data-x="<?php echo esc_attr( $comment->x_position ); ?>"
											data-y="<?php echo esc_attr( $comment->y_position ); ?>">
										<?php _e( 'Go to Page', 'client-handoff-toolkit' ); ?>
									</button>
									
									<button type="button" class="button button-small button-link-delete cht-delete-comment" 
											data-comment-id="<?php echo esc_attr( $comment->id ); ?>"
											title="<?php esc_attr_e( 'Delete Comment', 'client-handoff-toolkit' ); ?>">
										<?php esc_html_e( 'Delete', 'client-handoff-toolkit' ); ?>
									</button>
								</td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Comment Details Modal -->
<div id="cht-comment-modal" class="cht-modal" style="display: none;">
	<div class="cht-modal-content">
		<div class="cht-modal-header">
			<h3><?php _e( 'Comment Details', 'client-handoff-toolkit' ); ?></h3>
			<button type="button" class="cht-modal-close">&times;</button>
		</div>
		
		<div class="cht-modal-body">
			<div id="cht-modal-content-area">
				<!-- Content loaded via AJAX -->
			</div>
		</div>
	</div>
</div>

<style>
.cht-comments-dashboard {
	margin-top: 20px;
}

.cht-filter-bar {
	background: #fff;
	border: 1px solid #c3c4c7;
	border-radius: 4px;
	padding: 15px;
	margin-bottom: 20px;
	display: flex;
	gap: 15px;
	align-items: center;
}

.cht-filter-bar select,
.cht-filter-bar input {
	margin: 0;
}

.cht-comments-table-wrap {
	background: #fff;
	border: 1px solid #c3c4c7;
	border-radius: 4px;
}

.screenshot-column {
	width: 80px;
}

.cht-screenshot-thumb {
	max-width: 60px;
	max-height: 60px;
	border-radius: 3px;
	cursor: pointer;
}

.comment-column {
	max-width: 300px;
}

.comment-text {
	font-weight: 500;
	margin-bottom: 5px;
}

.element-selector {
	color: #646970;
}

.element-selector code {
	background: #f0f0f1;
	padding: 2px 5px;
	border-radius: 3px;
	font-size: 11px;
}

.cht-status-dropdown {
	min-width: 120px;
}

.no-comments {
	text-align: center;
	color: #646970;
	font-style: italic;
	padding: 40px 20px;
}

.no-screenshot {
	color: #646970;
	font-size: 12px;
}

/* Modal Styles */
.cht-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	z-index: 100000;
	display: flex;
	align-items: center;
	justify-content: center;
}

.cht-modal-content {
	background: #fff;
	border-radius: 4px;
	max-width: 800px;
	width: 90%;
	max-height: 90%;
	overflow: hidden;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.cht-modal-header {
	padding: 20px;
	border-bottom: 1px solid #c3c4c7;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.cht-modal-header h3 {
	margin: 0;
}

.cht-modal-close {
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #646970;
}

.cht-modal-close:hover {
	color: #d63638;
}

.cht-modal-body {
	padding: 20px;
	overflow-y: auto;
	max-height: calc(90vh - 100px);
}

.cht-delete-comment {
	color: #d63638 !important;
}

.cht-delete-comment:hover {
	color: #b32d2e !important;
	background-color: #fef7f7 !important;
}
</style>

<script>
jQuery(document).ready(function($) {
	// Delete comment functionality
	$(document).on('click', '.cht-delete-comment', function(e) {
		e.preventDefault();
		
		var commentId = $(this).data('comment-id');
		var row = $(this).closest('tr');
		
		if (!confirm('<?php esc_html_e( 'Are you sure you want to delete this comment? This action cannot be undone.', 'client-handoff-toolkit' ); ?>')) {
			return;
		}
		
		// Disable button and show loading state
		$(this).prop('disabled', true).text('<?php esc_html_e( 'Deleting...', 'client-handoff-toolkit' ); ?>');
		
		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: {
				action: 'cht_delete_comment',
				comment_id: commentId,
				nonce: '<?php echo esc_js( wp_create_nonce( 'cht_nonce' ) ); ?>'
			},
			success: function(response) {
				if (response.success) {
					// Remove the row with animation
					row.fadeOut(300, function() {
						$(this).remove();
						
						// Check if this was the last comment
						if ($('.wp-list-table tbody tr').length === 0) {
							$('.wp-list-table tbody').html('<tr><td colspan="7" class="no-comments"><?php esc_html_e( 'No comments found. Start by enabling visual comments on your frontend pages.', 'client-handoff-toolkit' ); ?></td></tr>');
						}
					});
					
					// Show success message
					$('<div class="notice notice-success is-dismissible"><p>' + response.data.message + '</p></div>')
						.insertAfter('.wrap h1')
						.delay(3000)
						.fadeOut();
				} else {
					alert('<?php esc_html_e( 'Error: ', 'client-handoff-toolkit' ); ?>' + response.data.message);
					// Re-enable button
					$(this).prop('disabled', false).text('<?php esc_html_e( 'Delete', 'client-handoff-toolkit' ); ?>');
				}
			},
			error: function() {
				alert('<?php esc_html_e( 'An error occurred while deleting the comment.', 'client-handoff-toolkit' ); ?>');
				// Re-enable button
				$(this).prop('disabled', false).text('<?php esc_html_e( 'Delete', 'client-handoff-toolkit' ); ?>');
			}
		});
	});
});
</script>
