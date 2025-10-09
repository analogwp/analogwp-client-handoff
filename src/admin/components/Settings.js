/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingsProvider from './settings/SettingsProvider';
import ExtensionsProvider, { useExtensions } from './extensions/ExtensionsProvider';
import SettingsHeader from './settings/SettingsHeader';
import GeneralSettings from './settings/GeneralSettings';
import AccessControlSettings from './settings/AccessControlSettings';
import LabelsAndFiltersSettings from './settings/LabelsAndFiltersSettings';
import AdvancedSettings from './settings/AdvancedSettings';

const ModernSettings = () => {
    const [activeTab, setActiveTab] = useState('general');

    // Prevent users from leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // This will be managed by the SettingsProvider context
            // through hasUnsavedChanges state
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    return (
        <ExtensionsProvider>
            <SettingsContent activeTab={activeTab} setActiveTab={setActiveTab} />
        </ExtensionsProvider>
    );
};

const SettingsContent = ({ activeTab, setActiveTab }) => {
    const renderTabContent = () => {

        switch (activeTab) {
            case 'general':
                return <GeneralSettings />;
            case 'access-control':
                return <AccessControlSettings />;
            case 'labels-filters':
                return <LabelsAndFiltersSettings />;
            case 'advanced':
                return <AdvancedSettings />;
            default:
                return <GeneralSettings />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <SettingsHeader 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
            />
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ModernSettings;