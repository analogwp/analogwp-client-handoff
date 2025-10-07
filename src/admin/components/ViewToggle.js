/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Button from './ui/Button';

const ViewToggle = ({ activeView, onViewChange }) => {
    return (
        <div className="flex rounded-lg gap-2">
						<Button 
								variant={activeView === 'kanban' ? 'primary' : 'secondary'}
								onClick={() => onViewChange('kanban')}
						>
								{__('Kanban', 'analogwp-client-handoff')}
						</Button>
						<Button 
								variant={activeView === 'list' ? 'primary' : 'secondary'}
								onClick={() => onViewChange('list')}
						>
								{__('List', 'analogwp-client-handoff')}
						</Button>
        </div>
    );
};

export default ViewToggle;