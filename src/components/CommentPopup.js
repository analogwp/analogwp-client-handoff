/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import html2canvas from 'html2canvas';

const CommentPopup = ({ position, selectedElement, onSave, onCancel }) => {
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Calculate popup position to keep it within viewport
    const getPopupStyle = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const popupWidth = 350;
        const popupHeight = 200;
        
        let left = position.x;
        let top = position.y;
        
        // Adjust horizontal position
        if (left + popupWidth > viewportWidth) {
            left = viewportWidth - popupWidth - 20;
        }
        if (left < 20) {
            left = 20;
        }
        
        // Adjust vertical position
        if (top + popupHeight > viewportHeight) {
            top = viewportHeight - popupHeight - 20;
        }
        if (top < 20) {
            top = 20;
        }
        
        return {
            position: 'fixed',
            left: `${left}px`,
            top: `${top}px`,
            zIndex: 100001
        };
    };

    // Capture screenshot of the selected element
    const captureScreenshot = async () => {
        try {
            // Find the actual element using the selector
            const element = document.querySelector(selectedElement.selector);
            if (!element) {
                console.warn('Element not found for selector:', selectedElement.selector);
                return '';
            }

            console.log('Starting screenshot capture for element:', element);

            // Create a temporary highlight with more visible styling
            const originalBorder = element.style.border;
            const originalBoxShadow = element.style.boxShadow;
            const originalOutline = element.style.outline;
            
            // Apply temporary highlight styles
            element.style.border = '3px solid #ff6b35';
            element.style.boxShadow = '0 0 0 2px rgba(255, 107, 53, 0.3)';
            element.style.outline = '2px solid #ff6b35';

            // Get element position and dimensions
            const rect = element.getBoundingClientRect();
            const padding = 20;
            
            // Calculate capture area
            const captureX = Math.max(0, rect.left + window.scrollX - padding);
            const captureY = Math.max(0, rect.top + window.scrollY - padding);
            const captureWidth = Math.min(rect.width + (padding * 2), window.innerWidth);
            const captureHeight = Math.min(rect.height + (padding * 2), window.innerHeight);

            console.log('Capture area:', { captureX, captureY, captureWidth, captureHeight });

            // Use html2canvas to capture the element
            const canvas = await html2canvas(element, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff', // White background instead of null
                scale: 1,
                logging: false,
                width: rect.width,
                height: rect.height,
                foreignObjectRendering: true,
                imageTimeout: 5000,
                removeContainer: true
            });

            // Restore original styles
            element.style.border = originalBorder;
            element.style.boxShadow = originalBoxShadow;
            element.style.outline = originalOutline;

            // Convert canvas to data URL with higher quality
            const dataURL = canvas.toDataURL('image/png', 1.0); // Use PNG with full quality
            console.log('Screenshot captured successfully, data URL length:', dataURL.length);
            
            return dataURL;
            
        } catch (error) {
            console.error('Error capturing screenshot:', error);
            
            // Fallback: try to capture a simple screenshot of the viewport area
            try {
                console.log('Attempting fallback screenshot capture');
                const canvas = await html2canvas(document.body, {
                    x: selectedElement.element.getBoundingClientRect().left,
                    y: selectedElement.element.getBoundingClientRect().top,
                    width: selectedElement.element.getBoundingClientRect().width,
                    height: selectedElement.element.getBoundingClientRect().height,
                    useCORS: true,
                    allowTaint: true,
                    scale: 0.5
                });
                
                const fallbackDataURL = canvas.toDataURL('image/jpeg', 0.7);
                console.log('Fallback screenshot captured, data URL length:', fallbackDataURL.length);
                return fallbackDataURL;
            } catch (fallbackError) {
                console.error('Fallback screenshot also failed:', fallbackError);
                return '';
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        
        setIsLoading(true);
        
        try {
            // Capture screenshot
            const screenshotUrl = await captureScreenshot();
            
            // Save comment
            await onSave(comment.trim(), screenshotUrl);
            
        } catch (error) {
            console.error('Error saving comment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="cht-comment-popup-overlay">
            <div className="cht-comment-popup" style={getPopupStyle()}>
                <div className="cht-popup-header">
                    <h4>{__('Add Comment', 'client-handoff-toolkit')}</h4>
                    <button 
                        onClick={onCancel}
                        className="cht-popup-close"
                        disabled={isLoading}
                    >
                        ×
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="cht-popup-body">
                        <div className="cht-element-info">
                            <small>
                                {__('Element:', 'client-handoff-toolkit')} 
                                <code>{selectedElement.selector}</code>
                            </small>
                        </div>
                        
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={__('Describe the issue or feedback...', 'client-handoff-toolkit')}
                            className="cht-comment-textarea"
                            rows="4"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>
                    
                    <div className="cht-popup-footer">
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="cht-btn cht-btn-secondary"
                            disabled={isLoading}
                        >
                            {__('Cancel', 'client-handoff-toolkit')}
                        </button>
                        
                        <button 
                            type="submit" 
                            className="cht-btn cht-btn-primary"
                            disabled={isLoading || !comment.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <span className="cht-spinner"></span>
                                    {__('Saving...', 'client-handoff-toolkit')}
                                </>
                            ) : (
                                __('Save Comment', 'client-handoff-toolkit')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentPopup;