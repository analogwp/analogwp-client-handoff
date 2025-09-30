/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { showConfirmation, showToast } from './ToastProvider';

const TaskDetail = ({ 
    comment, 
    user, 
    onStatusChange, 
    onDelete, 
    onBack,
    onPriorityChange,
    onUpdateComment,
    formatDate 
}) => {
    const [status, setStatus] = useState(comment.status);
    const [priority, setPriority] = useState(comment.priority || 'medium');
    const [isUpdating, setIsUpdating] = useState(false);
    // Initialize timesheet from comment data or empty array
    const [timeEntries, setTimeEntries] = useState(() => {
        try {
            return comment.timesheet ? JSON.parse(comment.timesheet) : [];
        } catch {
            return [];
        }
    });
    const [newTimeEntry, setNewTimeEntry] = useState({ hours: '', minutes: '', description: '' });

    // Update local state when comment changes (e.g., navigating between tasks)
    useEffect(() => {
        setStatus(comment.status);
        setPriority(comment.priority || 'medium');
        try {
            setTimeEntries(comment.timesheet ? JSON.parse(comment.timesheet) : []);
        } catch {
            setTimeEntries([]);
        }
    }, [comment.id, comment.status, comment.priority, comment.timesheet]);

    const getUserInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'open': return __('Open', 'analogwp-client-handoff');
            case 'in_progress': return __('In Progress', 'analogwp-client-handoff');
            case 'resolved': return __('Resolved', 'analogwp-client-handoff');
            default: return status;
        }
    };

    const handleStatusChange = async (newStatus) => {
        setIsUpdating(true);
        try {
            await onStatusChange(comment.id, newStatus);
            setStatus(newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
        setIsUpdating(false);
    };

    const handlePriorityChange = async (newPriority) => {
        setIsUpdating(true);
        try {
            if (onPriorityChange) {
                await onPriorityChange(comment.id, newPriority);
                setPriority(newPriority);
            }
        } catch (error) {
            console.error('Failed to update priority:', error);
        }
        setIsUpdating(false);
    };

    const handleDelete = async () => {
        const confirmed = await showConfirmation(
            __('Delete Comment', 'analogwp-client-handoff'),
            __('Are you sure you want to delete this comment? This action cannot be undone.', 'analogwp-client-handoff')
        );
        
        if (confirmed) {
            onDelete(comment.id);
        }
    };

    const addTimeEntry = async () => {
        if (!newTimeEntry.hours && !newTimeEntry.minutes) {
            showToast.error(__('Please enter hours or minutes', 'analogwp-client-handoff'));
            return;
        }
        
        const hours = parseInt(newTimeEntry.hours) || 0;
        const minutes = parseInt(newTimeEntry.minutes) || 0;
        
        if (hours < 0 || minutes < 0 || minutes >= 60) {
            showToast.error(__('Please enter valid time values', 'analogwp-client-handoff'));
            return;
        }
        
        const newEntry = {
            id: Date.now(),
            hours,
            minutes,
            description: newTimeEntry.description || __('Time entry', 'analogwp-client-handoff'),
            date: new Date().toISOString().split('T')[0]
        };
        
        const updatedEntries = [...timeEntries, newEntry];
        setTimeEntries(updatedEntries);
        
        // Persist to database
        try {
            await onUpdateComment(comment.id, { 
                timesheet: JSON.stringify(updatedEntries) 
            });
            setNewTimeEntry({ hours: '', minutes: '', description: '' });
            showToast.success(__('Time entry added successfully', 'analogwp-client-handoff'));
        } catch (error) {
            console.error('Error saving time entry:', error);
            // Revert the local state if saving failed
            setTimeEntries(timeEntries);
            showToast.error(__('Failed to save time entry', 'analogwp-client-handoff'));
        }
    };

    const removeTimeEntry = async (entryId) => {
        const updatedEntries = timeEntries.filter(entry => entry.id !== entryId);
        const originalEntries = [...timeEntries];
        setTimeEntries(updatedEntries);
        
        // Persist to database
        try {
            await onUpdateComment(comment.id, { 
                timesheet: JSON.stringify(updatedEntries) 
            });
            showToast.success(__('Time entry removed', 'analogwp-client-handoff'));
        } catch (error) {
            console.error('Error removing time entry:', error);
            // Revert the local state if saving failed
            setTimeEntries(originalEntries);
            showToast.error(__('Failed to remove time entry', 'analogwp-client-handoff'));
        }
    };

    const getTotalTime = () => {
        const totalMinutes = timeEntries.reduce((total, entry) => {
            return total + (entry.hours * 60) + entry.minutes;
        }, 0);
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        return { hours, minutes, totalMinutes };
    };    return (
        <div className="cht-task-detail">
            <div className="cht-task-detail-header">
                <button 
                    onClick={onBack}
                    className="cht-back-button"
                    title={__('Back to list', 'analogwp-client-handoff')}
                >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                    {__('Back', 'analogwp-client-handoff')}
                </button>
                
                <div className="cht-task-detail-actions">
                    <select 
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={isUpdating}
                        className="cht-status-select"
                    >
                        <option value="open">{__('Open', 'analogwp-client-handoff')}</option>
                        <option value="in_progress">{__('In Progress', 'analogwp-client-handoff')}</option>
                        <option value="resolved">{__('Resolved', 'analogwp-client-handoff')}</option>
                    </select>
                    
                    <select 
                        value={priority}
                        onChange={(e) => handlePriorityChange(e.target.value)}
                        disabled={isUpdating}
                        className="cht-priority-select"
                    >
                        <option value="low">{__('Low Priority', 'analogwp-client-handoff')}</option>
                        <option value="medium">{__('Medium Priority', 'analogwp-client-handoff')}</option>
                        <option value="high">{__('High Priority', 'analogwp-client-handoff')}</option>
                    </select>
                    
                    <button 
                        onClick={handleDelete}
                        className="cht-delete-button"
                        title={__('Delete comment', 'analogwp-client-handoff')}
                    >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11z"/>
                        </svg>
                        {__('Delete', 'analogwp-client-handoff')}
                    </button>
                </div>
            </div>

            <div className="cht-task-detail-content">
                <div className="cht-task-detail-main">
                    <div className="cht-task-detail-info">
                        <div className="cht-task-meta">
                            <div className="cht-task-priority">
                                <div 
                                    className="cht-priority-dot"
                                    style={{ backgroundColor: getPriorityColor(priority) }}
                                />
                                <span className="cht-priority-label">
                                    {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : __('Normal', 'analogwp-client-handoff')}
                                </span>
                            </div>
                            
                            <div className={`cht-status-badge cht-status-${status}`}>
                                {getStatusLabel(status)}
                            </div>
                        </div>
                        
                        <div className="cht-task-text">
                            <h2>{__('Comment', 'analogwp-client-handoff')}</h2>
                            <p>{comment.comment_text}</p>
                        </div>
                        
                        {comment.page_url && (
                            <div className="cht-task-page">
                                <h3>{__('Page URL', 'analogwp-client-handoff')}</h3>
                                <a href={comment.page_url} target="_blank" rel="noopener noreferrer">
                                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm.312-3.5h2.49c-.062-.89-.291-1.733-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
                                    </svg>
                                    {new URL(comment.page_url).pathname}
                                </a>
                            </div>
                        )}
                    </div>
                    
                    {/* Screenshot in main area */}
                    {comment.screenshot_url && (
                        <div className="cht-task-screenshot-main">
                            <h3>{__('Screenshot', 'analogwp-client-handoff')}</h3>
                            <div className="cht-screenshot-container-main">
                                <img 
                                    src={comment.screenshot_url} 
                                    alt={__('Task screenshot', 'analogwp-client-handoff')}
                                    onClick={() => window.open(comment.screenshot_url, '_blank')}
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Replies Section */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="cht-task-replies">
                            <h3>{__('Replies', 'analogwp-client-handoff')} ({comment.replies.length})</h3>
                            <div className="cht-replies-list">
                                {comment.replies.map((reply, index) => (
                                    <div key={reply.id || index} className="cht-reply-item">
                                        <div className="cht-reply-header">
                                            <div className="cht-reply-author">
                                                <div 
                                                    className="cht-reply-avatar"
                                                    style={{ backgroundColor: '#6b7280' }}
                                                >
                                                    {getUserInitials(reply.display_name || 'Unknown')}
                                                </div>
                                                <span className="cht-reply-name">
                                                    {reply.display_name || __('Unknown User', 'analogwp-client-handoff')}
                                                </span>
                                            </div>
                                            <span className="cht-reply-date">
                                                {formatDate(reply.created_at)}
                                            </span>
                                        </div>
                                        <div className="cht-reply-content">
                                            {reply.reply_text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="cht-task-detail-sidebar">
                    <div className="cht-task-detail-meta">
                        <h3>{__('Details', 'analogwp-client-handoff')}</h3>
                        
                        <div className="cht-task-user-detail">
                            <label>{__('Created by:', 'analogwp-client-handoff')}</label>
                            <div className="cht-user-info">
                                <div 
                                    className="cht-user-avatar"
                                    style={{ 
                                        backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none',
                                        backgroundColor: user?.avatar ? 'transparent' : '#6b7280'
                                    }}
                                >
                                    {!user?.avatar && getUserInitials(user?.name || 'Unknown')}
                                </div>
                                <span className="cht-user-name">
                                    {user?.name || __('Unknown User', 'analogwp-client-handoff')}
                                </span>
                            </div>
                        </div>
                        
                        <div className="cht-task-date-detail">
                            <label>{__('Created:', 'analogwp-client-handoff')}</label>
                            <span>{formatDate(comment.created_at)}</span>
                        </div>
                        
                        <div className="cht-task-id">
                            <label>{__('Comment ID:', 'analogwp-client-handoff')}</label>
                            <span>#{comment.id}</span>
                        </div>
                    </div>
                    
                    {/* Timesheet Section */}
                    <div className="cht-task-timesheet">
                        <h3>{__('Timesheet', 'analogwp-client-handoff')}</h3>
                        
                        {/* Add Time Entry */}
                        <div className="cht-add-time-entry">
                            <div className="cht-time-inputs">
                                <div className="cht-time-input-group">
                                    <input
                                        type="number"
                                        value={newTimeEntry.hours}
                                        onChange={(e) => setNewTimeEntry(prev => ({...prev, hours: e.target.value}))}
                                        placeholder="0"
                                        className="cht-time-input"
                                        min="0"
                                        max="23"
                                    />
                                    <label>{__('h', 'analogwp-client-handoff')}</label>
                                </div>
                                <div className="cht-time-input-group">
                                    <input
                                        type="number"
                                        value={newTimeEntry.minutes}
                                        onChange={(e) => setNewTimeEntry(prev => ({...prev, minutes: e.target.value}))}
                                        placeholder="0"
                                        className="cht-time-input"
                                        min="0"
                                        max="59"
                                    />
                                    <label>{__('m', 'analogwp-client-handoff')}</label>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={newTimeEntry.description}
                                onChange={(e) => setNewTimeEntry(prev => ({...prev, description: e.target.value}))}
                                placeholder={__('Description (optional)', 'analogwp-client-handoff')}
                                className="cht-time-description"
                            />
                            <button 
                                onClick={addTimeEntry}
                                className="cht-add-time-btn"
                            >
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                                {__('Add Time', 'analogwp-client-handoff')}
                            </button>
                        </div>
                        
                        {/* Time Entries List */}
                        {timeEntries.length > 0 && (
                            <div className="cht-time-entries">
                                <div className="cht-time-total">
                                    <strong>
                                        {__('Total: ', 'analogwp-client-handoff')}
                                        {getTotalTime().hours}h {getTotalTime().minutes}m
                                    </strong>
                                </div>
                                
                                <div className="cht-time-entries-list">
                                    {timeEntries.map(entry => (
                                        <div key={entry.id} className="cht-time-entry-item">
                                            <div className="cht-time-entry-info">
                                                <div className="cht-time-entry-duration">
                                                    {entry.hours}h {entry.minutes}m
                                                </div>
                                                <div className="cht-time-entry-desc">
                                                    {entry.description}
                                                </div>
                                                <div className="cht-time-entry-date">
                                                    {formatDate(entry.date)}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => removeTimeEntry(entry.id)}
                                                className="cht-remove-time-btn"
                                                title={__('Remove time entry', 'analogwp-client-handoff')}
                                            >
                                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;