/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ViewToggle from './ViewToggle';
import TaskFilters from './TaskFilters';

const TasksControls = ({ 
    activeView, 
    onViewChange, 
    filters, 
    onFilterChange, 
    sortBy, 
    onSortChange, 
    users 
}) => {
    return (
        <div className="mb-5">
            <div className="py-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between items-start sm:items-center">
                    <ViewToggle 
                        activeView={activeView}
                        onViewChange={onViewChange}
                    />
                    
                    <TaskFilters 
                        filters={filters}
                        onFilterChange={onFilterChange}
                        sortBy={sortBy}
                        onSortChange={onSortChange}
                        users={users}
                    />
                </div>
            </div>
        </div>
    );
};

export default TasksControls;