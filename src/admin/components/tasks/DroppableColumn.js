/**
 * dnd-kit dependencies
 */
import { useDroppable } from '@dnd-kit/core';

/**
 * Droppable column component for drag and drop functionality
 */
const DroppableColumn = ({ id, children, status }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        data: {
            status: status,
        },
    });

    return (
        <div 
            ref={setNodeRef}
            className={`bg-gray-50 rounded-lg p-4 min-h-96 transition-all duration-200 ${
                isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed shadow-lg' : ''
            }`}
        >
            {children}
        </div>
    );
};

export default DroppableColumn;