import React from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { __ } from '@wordpress/i18n';
import TaskCard from './TaskCard';
import TaskDetail from './TaskDetail';
import AddTaskModal from './AddTaskModal';
import TasksControls from '../TasksControls';
import DroppableColumn from './DroppableColumn';

const TasksKanbanView = ({
    selectedTask,
    onTaskDetailProps,
    sensors,
    activeId,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    filters,
    onFilterChange,
    sortBy,
    onSortChange,
    users,
    statuses,
    getCommentsByStatus,
    getUserById,
    handleStatusChange,
    handleDelete,
    handleEditTask,
    handleCardClick,
    formatDate,
    handleAddNew,
    showAddModal,
    handleCloseModal,
    handleSaveTask,
    pages,
    editingTask,
    activeView,
    onViewChange
}) => {
    return (
        <div>
            {/* Task Detail View - Full Page */}
            {selectedTask && (
                <TaskDetail
                    {...onTaskDetailProps}
                />
            )}

            {/* Main Kanban Board */}
            {!selectedTask && (
                <DndContext 
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <TasksControls 
                        activeView={activeView}
                        onViewChange={onViewChange}
                        filters={filters}
                        onFilterChange={onFilterChange}
                        sortBy={sortBy}
                        onSortChange={onSortChange}
                        users={users}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statuses.map(status => (
                        <DroppableColumn key={status.key} id={status.key} status={status.key}>
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg" style={{ color: status.color }}>
                                        {status.icon}
                                    </span>
                                    <span className="text-lg font-semibold text-gray-900">{status.title}</span>
                                </div>
                                <div className="bg-white text-gray-600 text-base font-medium px-2 py-1 rounded-full">
                                    {getCommentsByStatus(status.key).length}
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {getCommentsByStatus(status.key).map(comment => (
                                    <TaskCard
                                        key={comment.id}
                                        comment={comment}
                                        user={comment.user || getUserById(comment.user_id)}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDelete}
                                        onEdit={handleEditTask}
                                        onCardClick={handleCardClick}
                                        formatDate={formatDate}
                                    />
                                ))}
                                
                                {status.key !== 'resolved' && (
                                    <button 
                                        className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:cursor-pointer transition-colors duration-200"
                                        onClick={handleAddNew}
                                    >
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                        </svg>
                                        <span className="text-sm font-medium">{__('Add new', 'analogwp-client-handoff')}</span>
                                    </button>
                                )}
                            </div>
                        </DroppableColumn>
                    ))}
                    </div>
                    
                    {/* Drag Overlay - shows the card being dragged */}
                    <DragOverlay>
                        {activeId && draggedItem ? (
                            <div className="transform rotate-6 opacity-90">
                                <TaskCard
                                    comment={draggedItem}
                                    user={draggedItem.user || getUserById(draggedItem.user_id)}
                                    onStatusChange={() => {}}
                                    onDelete={() => {}}
                                    onEdit={() => {}}
                                    onCardClick={() => {}}
                                    formatDate={formatDate}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
            
            {/* Add/Edit Task Sidebar */}
            {showAddModal && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-transparent z-40"
                        onClick={handleCloseModal}
                    />
                    
                    {/* Sidebar */}
                    <div className="fixed top-[32px] right-0 w-96 h-[calc(100vh-32px)] bg-white shadow-xl z-50 overflow-y-auto">
                        <AddTaskModal
                            isOpen={true}
                            onClose={handleCloseModal}
                            onSave={handleSaveTask}
                            users={users}
                            pages={pages || []}
                            editTask={editingTask}
                            statuses={statuses}
                            isSidebar={true}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default TasksKanbanView;