/**
 * WordPress dependencies
 */
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import VisualCommentsApp from './frontend/components/VisualCommentsApp';
import './frontend/styles/frontend.scss';

// Debug logging
console.log('CHT: Frontend script loaded!');
console.log('CHT: Document ready state:', document.readyState);
console.log('CHT: chtAjax available:', typeof chtAjax !== 'undefined');

// Simple initialization function
function initVisualComments() {
    console.log('CHT: Initializing Visual Comments');
    
    // Ensure chtAjax is available
    if (typeof chtAjax === 'undefined') {
        console.error('CHT: chtAjax object not found');
        return;
    }
    
    console.log('CHT: chtAjax found:', chtAjax);
    
    // Check if React is available
    if (typeof createRoot === 'undefined') {
        console.error('CHT: createRoot not available');
        // Fallback to simple version
        createSimpleInterface();
        return;
    }
    
    // Create container for the visual comments app
    const appContainer = document.createElement('div');
    appContainer.id = 'cht-visual-comments-app';
    document.body.appendChild(appContainer);
    
    console.log('CHT: Container created, mounting React app');
    
    try {
        // Create root and render the React app
        const root = createRoot(appContainer);
        root.render(<VisualCommentsApp />);
        console.log('CHT: React app mounted successfully');
    } catch (error) {
        console.error('CHT: Error mounting React app:', error);
        // Fallback to simple version
        appContainer.remove();
        createSimpleInterface();
    }
}

// Fallback simple interface (like our test version)
function createSimpleInterface() {
    console.log('CHT: Creating simple interface fallback');
    
    const appContainer = document.createElement('div');
    appContainer.id = 'cht-visual-comments-app';
    appContainer.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        width: 300px;
        height: 300px;
        background: #ffffff;
        border: 2px solid #0073aa;
        border-radius: 5px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 999999;
        font-family: Arial, sans-serif;
        overflow-y: auto;
    `;
    
    appContainer.innerHTML = `
        <h3>CHT Visual Comments (Fallback)</h3>
        <p>✅ JavaScript is working!</p>
        <p>⚠️ React fallback mode</p>
        <p><strong>Post ID:</strong> ${chtAjax.postId}</p>
        <button onclick="this.parentNode.style.display='none'" style="float: right;">Close</button>
        <hr>
        <div>Basic visual commenting interface would appear here.</div>
    `;
    
    document.body.appendChild(appContainer);
}

// Multiple initialization strategies
if (document.readyState === 'loading') {
    console.log('CHT: DOM loading, adding DOMContentLoaded listener');
    document.addEventListener('DOMContentLoaded', initVisualComments);
} else {
    // DOM is already loaded
    console.log('CHT: DOM already loaded, initializing immediately');
    initVisualComments();
}

// Fallback - also try after window load
window.addEventListener('load', function() {
    if (!document.getElementById('cht-visual-comments-app')) {
        console.log('CHT: Fallback initialization');
        initVisualComments();
    } else {
        console.log('CHT: App already initialized');
    }
});