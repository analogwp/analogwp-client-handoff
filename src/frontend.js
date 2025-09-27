/**
 * WordPress dependencies
 */
import { render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import VisualCommentsApp from './components/VisualCommentsApp';
import './styles/frontend.scss';

// Initialize the Visual Comments App
document.addEventListener('DOMContentLoaded', function() {
    // Create container for the visual comments app
    const appContainer = document.createElement('div');
    appContainer.id = 'cht-visual-comments-app';
    document.body.appendChild(appContainer);
    
    // Render the React app
    render(<VisualCommentsApp />, appContainer);
});