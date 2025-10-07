/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useSettings } from './settings/SettingsProvider';

const TaskFilters = ({ filters, onFilterChange, sortBy, onSortChange, users }) => {
    const { categories } = useSettings();

    return (
        <div className="flex gap-3 items-center">
            <select 
                value={filters.status}
                onChange={(e) => onFilterChange({status: e.target.value})}
                className="px-3! py-1.5! border border-gray-200! rounded-md! text-sm focus:ring-2 focus:ring-gray-500! focus:border-gray-500! min-w-40!"
            >
                <option value="">{__('Filter by Status', 'analogwp-client-handoff')}</option>
                <option value="open">{__('Todo', 'analogwp-client-handoff')}</option>
                <option value="in_progress">{__('In Progress', 'analogwp-client-handoff')}</option>
                <option value="resolved">{__('Completed', 'analogwp-client-handoff')}</option>
            </select>
            
            <select 
                value={filters.user}
                onChange={(e) => onFilterChange({user: e.target.value})}
                className="px-3! py-1.5! border border-gray-200! rounded-md! text-sm focus:ring-2 focus:ring-gray-500! focus:border-gray-500! min-w-40!"
            >
                <option value="">{__('Filter by User', 'analogwp-client-handoff')}</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            
            <select 
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-3! py-1.5! border border-gray-200! rounded-md! text-sm focus:ring-2 focus:ring-gray-500! focus:border-gray-500! min-w-40!"
            >
                <option value="created_at">{__('Sort by Date', 'analogwp-client-handoff')}</option>
                <option value="updated_at">{__('Sort by Updated', 'analogwp-client-handoff')}</option>
                <option value="priority">{__('Sort by Priority', 'analogwp-client-handoff')}</option>
            </select>
            
            <select 
                value={filters.category}
                onChange={(e) => onFilterChange({category: e.target.value})}
                className="px-3! py-1.5! border border-gray-200! rounded-md! text-sm focus:ring-2 focus:ring-gray-500! focus:border-gray-500! min-w-40!"
            >
                <option value="">{__('Filter by Category', 'analogwp-client-handoff')}</option>
                {categories && categories.length > 0 ? (
                    categories.map(category => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))
                ) : (
                    <option disabled>{__('No categories available', 'analogwp-client-handoff')}</option>
                )}
            </select>
        </div>
    );
};

export default TaskFilters;