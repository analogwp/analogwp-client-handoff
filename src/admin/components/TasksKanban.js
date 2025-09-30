/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TaskCard from './TaskCard';
import TaskDetail from './TaskDetail';
import AddTaskModal from './AddTaskModal';

const TasksKanban = ({ comments, onUpdateComment, onDelete, onAddTask, users, categories, pages, onAddComment, activeView = 'kanban' }) => {
    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const handleAddNew = () => {
        setEditingTask(null);
        setShowAddModal(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowAddModal(true);
    };

    const handleSaveTask = async (taskData) => {
        if (editingTask) {
            // Update existing task
            if (onUpdateComment) {
                await onUpdateComment(editingTask.id, taskData);
            }
        } else {
            // Create new task
            if (onAddTask) {
                await onAddTask(taskData);
            }
        }
        setShowAddModal(false);
        setEditingTask(null);
    };

    const handleStatusChange = (id, status) => {
        if (onUpdateComment) {
            onUpdateComment(id, { status });
        }
    };

    const handleDelete = (id) => {
        if (onDelete) {
            onDelete(id);
        }
    };

    const statuses = [
        { 
            key: 'open', 
            title: __('Todo', 'analogwp-client-handoff'),
            color: '#f59e0b',
            icon: '📋'
        },
        { 
            key: 'in_progress', 
            title: __('In Progress', 'analogwp-client-handoff'),
            color: '#3b82f6',
            icon: '⏳'
        },
        { 
            key: 'resolved', 
            title: __('Completed', 'analogwp-client-handoff'),
            color: '#10b981',
            icon: '✅'
        }
    ];

    const getCommentsByStatus = (status) => {
        return comments.filter(comment => comment.status === status);
    };

    const getUserById = (userId) => {
        return users.find(user => user.id === parseInt(userId));
    };

    const handleDragStart = (e, comment) => {
        setDraggedItem(comment);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        if (draggedItem && draggedItem.status !== newStatus) {
            onUpdateComment(draggedItem.id, { status: newStatus });
        }
        setDraggedItem(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    const handleCardClick = (comment) => {
        setSelectedTask(comment);
    };

    const handleDeleteAndClose = async (id) => {
        if (onDelete) {
            await onDelete(id);
            // Close the detail view after successful deletion
            setSelectedTask(null);
        }
    };

    const handleBackToList = () => {
        setSelectedTask(null);
    };

    // Show detail view if a task is selected
    if (selectedTask) {
        return (
            <TaskDetail
                comment={selectedTask}
                user={selectedTask.user || getUserById(selectedTask.user_id)}
                onStatusChange={(id, status) => onUpdateComment(id, { status })}
                onPriorityChange={(id, priority) => onUpdateComment(id, { priority })}
                onUpdateComment={onUpdateComment}
                onDelete={handleDeleteAndClose}
                onBack={handleBackToList}
                formatDate={formatDate}
            />
        );
    }

    // Render add task modal
    const renderAddTaskModal = () => (
        <AddTaskModal
            isOpen={showAddModal}
            onClose={() => {
                setShowAddModal(false);
                setEditingTask(null);
            }}
            onSave={handleSaveTask}
            users={users}
            pages={pages || []}
            editTask={editingTask}
        />
    );

    if (activeView === 'list') {
        return (
            <div className="cht-tasks-list">
                <div className="cht-list-header">
                    <div className="cht-list-title">{__('All Tasks', 'analogwp-client-handoff')}</div>
                    <div className="cht-list-count">{comments.length} {__('tasks', 'analogwp-client-handoff')}</div>
                </div>
                <div className="cht-list-content">
                    {comments.map(comment => (
                        <div 
                            key={comment.id} 
                            className="cht-list-item"
                            onClick={() => handleCardClick(comment)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="cht-list-status">
                                <span className={`cht-status-badge cht-status-${comment.status}`}>
                                    {statuses.find(s => s.key === comment.status)?.icon}
                                </span>
                            </div>
                            <div className="cht-list-content-area">
                                <div className="cht-list-title">{comment.comment_text}</div>
                                <div className="cht-list-meta">
                                    <span className="cht-list-user">
                                        {(comment.user && comment.user.name) || getUserById(comment.user_id)?.name || __('Unknown User', 'analogwp-client-handoff')}
                                    </span>
                                    <span className="cht-list-date">{formatDate(comment.created_at)}</span>
                                    {comment.page_url && (
                                        <span className="cht-list-page">{comment.page_url}</span>
                                    )}
                                </div>
                            </div>
                            <div className="cht-list-actions">
                                <select 
                                    value={comment.status}
                                    onChange={(e) => handleStatusChange(comment.id, e.target.value)}
                                    className="cht-status-select"
                                >
                                    {statuses.map(status => (
                                        <option key={status.key} value={status.key}>
                                            {status.title}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditTask(comment);
                                    }}
                                    className="cht-edit-btn"
                                    title={__('Edit', 'analogwp-client-handoff')}
                                >
                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L4.5 15.207l-4 1a.5.5 0 0 1-.606-.606l1-4L12.146.146zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                    </svg>
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(comment.id);
                                    }}
                                    className="cht-delete-btn"
                                    title={__('Delete', 'analogwp-client-handoff')}
                                >
                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="cht-kanban-board">
            {statuses.map(status => (
                <div 
                    key={status.key}
                    className="cht-kanban-column"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status.key)}
                >
                    <div className="cht-column-header">
                        <div className="cht-column-title">
                            <span className="cht-column-icon" style={{ color: status.color }}>
                                {status.icon}
                            </span>
                            <span className="cht-column-text">{status.title}</span>
                        </div>
                        <div className="cht-column-count">
                            {getCommentsByStatus(status.key).length}
                        </div>
                    </div>
                    
                    <div className="cht-column-content">
                        {getCommentsByStatus(status.key).map(comment => (
                            <TaskCard
                                key={comment.id}
                                comment={comment}
                                user={comment.user || getUserById(comment.user_id)}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                                onEdit={handleEditTask}
                                onDragStart={handleDragStart}
                                onCardClick={handleCardClick}
                                formatDate={formatDate}
                            />
                        ))}
                        
                        {status.key !== 'resolved' && (
                            <button 
                                className="cht-add-task-btn"
                                onClick={handleAddNew}
                            >
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                                {__('Add new', 'analogwp-client-handoff')}
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {renderAddTaskModal()}
        </div>
    );
};

export default TasksKanban;