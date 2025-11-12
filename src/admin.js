/**
 * WordPress dependencies
 */
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import UnifiedAdminApp from './admin/apps/UnifiedAdminApp';
import './admin/styles/admin.scss';

// Initialize unified admin app
document.addEventListener('DOMContentLoaded', function() {
    // Determine initial page based on URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    let initialPage = 'dashboard';
    
    if (page && page.includes('settings')) {
        initialPage = 'settings';
    }
    
    // Find the first available container and use it
    const containers = [
        { id: 'agwp-sn-admin-dashboard', page: 'dashboard' },
        { id: 'agwp-sn-admin-settings', page: 'settings' }
    ];

    for (const container of containers) {
        const element = document.getElementById(container.id);
        if (element) {
            // Use the initial page from URL, or fall back to container's default
            const pageToRender = page && page.includes('settings') ? 'settings' : 
                               page && page.includes('dashboard') ? 'dashboard' :
                               container.page;
            
            const root = createRoot(element);
            root.render(<UnifiedAdminApp initialPage={pageToRender} />);
            
            // Only render to the first found container to avoid duplicates
            break;
        }
    }
});