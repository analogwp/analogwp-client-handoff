/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Task status definitions
 * Central source of truth for all task statuses in the application
 */
export const TASK_STATUSES = [
    { 
        key: 'open', 
        title: __('Open', 'analogwp-client-handoff'),
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
        title: __('Resolved', 'analogwp-client-handoff'),
        color: '#10b981',
        icon: '✅'
    }
];

/**
 * Get status details by key
 * @param {string} statusKey - The status key to lookup
 * @returns {Object|undefined} Status object or undefined if not found
 */
export const getStatusByKey = (statusKey) => {
    return TASK_STATUSES.find(status => status.key === statusKey);
};

/**
 * Get all status keys
 * @returns {Array<string>} Array of status keys
 */
export const getStatusKeys = () => {
    return TASK_STATUSES.map(status => status.key);
};
