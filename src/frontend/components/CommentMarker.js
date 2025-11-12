/**
 * WordPress dependencies
 */
import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Draggable from 'react-draggable';

/**
 * Internal dependencies
 */
import { getStatusByKey } from '../constants/taskStatuses';
import { Button } from './ui';
import logger from '../../shared/utils/logger';

const CommentMarker = ({ 
    comment, 
    isSelected, 
    onSelect, 
    onAddReply, 
    onUpdateStatus, 
    canManageComments 
}) => {
    const [replyText, setReplyText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const popupRef = useRef(null);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onSelect();
            }
        };

        if (isSelected) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isSelected, onSelect]);

    // Handle reply submission
    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setIsSubmittingReply(true);
        try {
            await onAddReply(comment.id, replyText.trim());
            setReplyText('');
            setShowReplyForm(false);
        } catch (error) {
            logger.error('Error submitting reply:', error);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    // Handle status change
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        onUpdateStatus(comment.id, newStatus);
    };

    // Scroll to element when marker is clicked
    const scrollToElement = () => {
        try {
            const element = document.querySelector(comment.element_selector);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Add temporary highlight
                const originalBorder = element.style.border;
                const originalTransition = element.style.transition;
                
                element.style.transition = 'border 0.3s ease';
                element.style.border = '3px solid #ff6b35';
                
                setTimeout(() => {
                    element.style.border = originalBorder;
                    element.style.transition = originalTransition;
                }, 2000);
            }
        } catch (error) {
            logger.error('Error finding element:', error);
        }
    };

    const getStatusIcon = (status) => {
        const statusObj = getStatusByKey(status);
        return statusObj ? statusObj.icon : '📋';
    };

    const getStatusLabel = (status) => {
        const statusObj = getStatusByKey(status);
        return statusObj ? statusObj.title : status;
    };

    return (
        <>
            <div
                className={`sn-comment-marker ${isSelected ? 'selected' : ''} ${comment.status}`}
                style={{
                    position: 'absolute',
                    left: `${comment.x_position}px`,
                    top: `${comment.y_position}px`,
                    zIndex: 10000,
                    transform: 'translate(-50%, -50%)', // Center the marker on the exact point
                    pointerEvents: 'auto'
                }}
                onClick={onSelect}
                title={comment.comment_text}
            >
                <div className="sn-marker-dot">
                    <span className="sn-marker-icon">{getStatusIcon(comment.status)}</span>
                    <span className="sn-marker-number">{comment.id}</span>
                </div>
                
                <div className="sn-marker-pulse"></div>
            </div>

            {isSelected && (
                <Draggable 
                    handle=".sn-popup-header"
                    onStart={() => setIsDragging(true)}
                    onStop={() => setTimeout(() => setIsDragging(false), 100)}
                >
                    <div
                        ref={popupRef}
                        className="sn-comment-detail-popup"
                        data-sn-ignore="true"
                        data-dragging={isDragging}
                        style={{
                            position: 'fixed',
                            left: `${Math.min(comment.x_position - window.pageXOffset + 30, window.innerWidth - 400)}px`,
                            top: `${Math.max(20, comment.y_position - window.pageYOffset - 100)}px`,
                            zIndex: 100001
                        }}
                    >
                        <div className="sn-popup-header">
                            <div className="sn-popup-title">
                                <strong>{__('Comment', 'analogwp-site-notes')} #{comment.id}</strong>
                                <span className="sn-status-badge">
                                    <span className="sn-status-icon">{getStatusIcon(comment.status)}</span>
                                    {getStatusLabel(comment.status)}
                                </span>
                            </div>
                            <button onClick={onSelect} className="sn-popup-close">×</button>
                        </div>

                        <div className="sn-popup-content">
                            {/* Screenshot */}
                            {comment.screenshot_url && (
                                <div className="sn-comment-screenshot">
                                    <img 
                                        src={comment.screenshot_url} 
                                        alt={__('Comment Screenshot', 'analogwp-site-notes')}
                                        onClick={() => window.open(comment.screenshot_url, '_blank')}
                                    />
                                </div>
                            )}

                            {/* Main Comment */}
                            <div className="sn-comment-content">
                                <div className="sn-comment-meta">
                                    <strong>{comment.display_name}</strong>
                                    <span className="sn-comment-date">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </span>
                                </div>
                                {comment.comment_title && (
                                    <h5 className="sn-comment-title">{comment.comment_title}</h5>
                                )}
                                <p className="sn-comment-text">{comment.comment_text}</p>
                                
                                {comment.element_selector && (
                                    <div className="sn-element-info">
                                        <small>
                                            {__('Element:', 'analogwp-site-notes')} 
                                            <code>{comment.element_selector}</code>
                                            <button 
                                                onClick={scrollToElement}
                                                className="sn-goto-element"
                                            >
                                                {__('Go to', 'analogwp-site-notes')}
                                            </button>
                                        </small>
                                    </div>
                                )}
                            </div>

                            {/* Status Management */}
                            {canManageComments && (
                                <div className="sn-status-controls">
                                    <label>
                                        {__('Status:', 'analogwp-site-notes')}
                                        <select 
                                            value={comment.status} 
                                            onChange={handleStatusChange}
                                            className="sn-status-select"
                                        >
                                            <option value="open">{__('Open', 'analogwp-site-notes')}</option>
                                            <option value="in_progress">{__('In Progress', 'analogwp-site-notes')}</option>
                                            <option value="resolved">{__('Resolved', 'analogwp-site-notes')}</option>
                                        </select>
                                    </label>
                                </div>
                            )}

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="sn-replies">
                                    <h5>{__('Replies:', 'analogwp-site-notes')}</h5>
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="sn-reply">
                                            <div className="sn-reply-meta">
                                                <strong>{reply.display_name}</strong>
                                                <span className="sn-reply-date">
                                                    {new Date(reply.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <p>{reply.reply_text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reply Form */}
                            {showReplyForm ? (
                                <form onSubmit={handleReplySubmit} className="sn-reply-form">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={__('Type your reply...', 'analogwp-site-notes')}
                                        rows="3"
                                        disabled={isSubmittingReply}
                                    />
                                    <div className="sn-reply-actions">
                                        <Button 
                                            variant="secondary"
                                            onClick={() => {
                                                setShowReplyForm(false);
                                                setReplyText('');
                                            }}
                                            disabled={isSubmittingReply}
                                        >
                                            {__('Cancel', 'analogwp-site-notes')}
                                        </Button>
                                        <Button 
                                            type="submit"
                                            variant="primary"
                                            disabled={isSubmittingReply || !replyText.trim()}
                                            loading={isSubmittingReply}
                                        >
                                            {isSubmittingReply ? 
                                                __('Replying...', 'analogwp-site-notes') : 
                                                __('Reply', 'analogwp-site-notes')
                                            }
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="sn-comment-actions">
                                    <Button 
                                        variant="secondary"
                                        onClick={() => setShowReplyForm(true)}
                                    >
                                        {__('Reply', 'analogwp-site-notes')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Draggable>
            )}
        </>
    );
};

export default CommentMarker;