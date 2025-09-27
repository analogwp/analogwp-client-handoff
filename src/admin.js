/**
 * WordPress dependencies
 */
import { render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdminDashboard from './admin/AdminDashboard';
import './styles/admin.scss';

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    const dashboardContainer = document.getElementById('cht-admin-dashboard');
    if (dashboardContainer) {
        render(<AdminDashboard />, dashboardContainer);
    }
});