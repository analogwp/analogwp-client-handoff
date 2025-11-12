/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const CommentOverlay = () => {
    const [isVisible, setIsVisible] = useState(true);

    // Hide overlay after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="sn-overlay" onClick={() => setIsVisible(false)}>
            <div className="sn-overlay-message">
                <div className="sn-overlay-content">
                    <button 
                        className="sn-overlay-close"
                        onClick={() => setIsVisible(false)}
                        aria-label={__('Close overlay', 'analogwp-site-notes')}
                    >
                        ×
                    </button>
                    <h3>{__('Visual Comments Mode Active', 'analogwp-site-notes')}</h3>
                    <p>{__('Click on any element to add a comment', 'analogwp-site-notes')}</p>
                    <div className="sn-overlay-instructions">
                        <div className="sn-instruction-item">
                            <span className="sn-instruction-icon">👆</span>
                            <span>{__('Click elements to comment', 'analogwp-site-notes')}</span>
                        </div>
                        <div className="sn-instruction-item">
                            <span className="sn-instruction-icon">📸</span>
                            <span>{__('Screenshots auto-captured', 'analogwp-site-notes')}</span>
                        </div>
                        <div className="sn-instruction-item">
                            <span className="sn-instruction-icon">💬</span>
                            <span>{__('Reply and track progress', 'analogwp-site-notes')}</span>
                        </div>
                    </div>
                    <div className="sn-overlay-hint">
                        <small>{__('This message will disappear in 3 seconds', 'analogwp-site-notes')}</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentOverlay;