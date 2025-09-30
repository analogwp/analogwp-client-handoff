/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { showToast } from './ToastProvider';

/**
 * External dependencies
 */
import { TrashIcon, PencilIcon, PlusIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

/**
 * Internal dependencies
 */

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        general: {
            allowed_roles: ['administrator', 'editor'],
            auto_screenshot: true,
            screenshot_quality: 0.8,
            comments_per_page: 20
        },
        users: {
            notification_emails: true,
            user_assignment: true,
            guest_comments: false
        },
        categories: []
    });
    const [categories, setCategories] = useState([
        { id: 1, name: 'Page Building', color: '#3498db' },
        { id: 2, name: 'SEO', color: '#e74c3c' },
        { id: 3, name: 'Content', color: '#2ecc71' },
        { id: 4, name: 'Shop Management', color: '#f39c12' }
    ]);
    const [newCategory, setNewCategory] = useState('');
    const [saving, setSaving] = useState(false);
    const [feedbackEmail, setFeedbackEmail] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const tabs = [
        { id: 'general', label: __('General', 'analogwp-client-handoff') },
        { id: 'users', label: __('Users', 'analogwp-client-handoff') },
        { id: 'categories', label: __('Categories', 'analogwp-client-handoff') }
    ];

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await fetch(agwpChtAjax.ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'agwp_cht_get_settings',
                    nonce: agwpChtAjax.nonce
                })
            });

            const data = await response.json();
            if (data.success) {
                setSettings(data.data.settings || settings);
                setCategories(data.data.categories || categories);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const response = await fetch(agwpChtAjax.ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'agwp_cht_save_settings',
                    nonce: agwpChtAjax.nonce,
                    settings: JSON.stringify(settings),
                    categories: JSON.stringify(categories)
                })
            });

            const data = await response.json();
            if (data.success) {
                showToast.success(__('Settings saved successfully!', 'analogwp-client-handoff'));
            } else {
                showToast.error(__('Error saving settings. Please try again.', 'analogwp-client-handoff'));
            }
        } catch (err) {
            console.error('Error saving settings:', err);
            showToast.error(__('Error saving settings. Please try again.', 'analogwp-client-handoff'));
        } finally {
            setSaving(false);
        }
    };

    const addCategory = () => {
        if (newCategory.trim()) {
            const newCat = {
                id: Date.now(),
                name: newCategory.trim(),
                color: '#3498db'
            };
            setCategories([...categories, newCat]);
            setNewCategory('');
        }
    };

    const deleteCategory = (id) => {
        setCategories(categories.filter(cat => cat.id !== id));
    };

    const editCategory = (id, newName) => {
        setCategories(categories.map(cat => 
            cat.id === id ? { ...cat, name: newName } : cat
        ));
    };

    const sendFeedback = async () => {
        if (!feedbackEmail.trim() || !feedbackMessage.trim()) {
            return;
        }

        try {
            const response = await fetch(agwpChtAjax.ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'agwp_cht_send_feedback',
                    nonce: agwpChtAjax.nonce,
                    email: feedbackEmail,
                    message: feedbackMessage
                })
            });

            const data = await response.json();
            if (data.success) {
                setFeedbackEmail('');
                setFeedbackMessage('');
                showToast.success(__('Thank you for your feedback!', 'analogwp-client-handoff'));
            }
        } catch (err) {
            console.error('Error sending feedback:', err);
            showToast.error(__('Error sending feedback. Please try again.', 'analogwp-client-handoff'));
        }
    };

    const renderGeneralTab = () => (
        <div className="cht-settings-section">
            <h3>{__('General Settings', 'analogwp-client-handoff')}</h3>
            
            <div className="cht-setting-group">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.general.auto_screenshot}
                        onChange={(e) => setSettings({
                            ...settings,
                            general: { ...settings.general, auto_screenshot: e.target.checked }
                        })}
                    />
                    {__('Enable automatic screenshots', 'analogwp-client-handoff')}
                </label>
                <p className="description">
                    {__('Automatically capture screenshots when comments are created', 'analogwp-client-handoff')}
                </p>
            </div>

            <div className="cht-setting-group">
                <label>{__('Screenshot Quality', 'analogwp-client-handoff')}</label>
                <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.general.screenshot_quality}
                    onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, screenshot_quality: parseFloat(e.target.value) }
                    })}
                />
                <span>{Math.round(settings.general.screenshot_quality * 100)}%</span>
            </div>

            <div className="cht-setting-group">
                <label>{__('Comments per page', 'analogwp-client-handoff')}</label>
                <input
                    type="number"
                    value={settings.general.comments_per_page}
                    onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, comments_per_page: parseInt(e.target.value) }
                    })}
                />
            </div>
        </div>
    );

    const renderUsersTab = () => (
        <div className="cht-settings-section">
            <h3>{__('User Settings', 'analogwp-client-handoff')}</h3>
            
            <div className="cht-setting-group">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.users.notification_emails}
                        onChange={(e) => setSettings({
                            ...settings,
                            users: { ...settings.users, notification_emails: e.target.checked }
                        })}
                    />
                    {__('Enable email notifications', 'analogwp-client-handoff')}
                </label>
            </div>

            <div className="cht-setting-group">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.users.user_assignment}
                        onChange={(e) => setSettings({
                            ...settings,
                            users: { ...settings.users, user_assignment: e.target.checked }
                        })}
                    />
                    {__('Enable user assignment', 'analogwp-client-handoff')}
                </label>
            </div>

            <div className="cht-setting-group">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.users.guest_comments}
                        onChange={(e) => setSettings({
                            ...settings,
                            users: { ...settings.users, guest_comments: e.target.checked }
                        })}
                    />
                    {__('Allow guest comments', 'analogwp-client-handoff')}
                </label>
            </div>
        </div>
    );

    const renderCategoriesTab = () => (
        <div className="cht-settings-section">
            <div className="cht-categories-container">
                <div className="cht-categories-left">
                    <h3>{__('Add or edit Categories', 'analogwp-client-handoff')}</h3>
                    <p>
                        {__('When you create a task, you will be able to assign it any of the categories below. You can create as many categories as you want', 'analogwp-client-handoff')}
                    </p>

                    <div className="cht-add-category">
                        <input
                            type="text"
                            placeholder={__('New Category', 'analogwp-client-handoff')}
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                        />
                        <button 
                            className="button button-primary"
                            onClick={addCategory}
                            disabled={!newCategory.trim()}
                        >
                            <PlusIcon className="cht-icon" />
                            {__('Add', 'analogwp-client-handoff')}
                        </button>
                    </div>

                    <div className="cht-categories-list">
                        {categories.map(category => (
                            <div key={category.id} className="cht-category-item">
                                <button 
                                    className="cht-delete-category"
                                    onClick={() => deleteCategory(category.id)}
                                    title={__('Delete category', 'analogwp-client-handoff')}
                                >
                                    <TrashIcon className="cht-icon" />
                                </button>
                                <button 
                                    className="cht-edit-category"
                                    title={__('Edit category', 'analogwp-client-handoff')}
                                >
                                    <PencilIcon className="cht-icon" />
                                </button>
                                <span className="cht-category-name">{category.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cht-categories-right">
                    <div className="cht-feedback-section">
                        <h3>{__('Feedback', 'analogwp-client-handoff')}</h3>
                        <input
                            type="email"
                            placeholder="myemail@site.com"
                            value={feedbackEmail}
                            onChange={(e) => setFeedbackEmail(e.target.value)}
                        />
                        <textarea
                            placeholder={__('Share your feedback', 'analogwp-client-handoff')}
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                        ></textarea>
                        <button 
                            className="button button-primary"
                            onClick={sendFeedback}
                            disabled={!feedbackEmail.trim() || !feedbackMessage.trim()}
                        >
                            {__('Send Message', 'analogwp-client-handoff')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="cht-settings-app">
            <div className="cht-settings-header">
                <div className="cht-settings-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`cht-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="cht-settings-actions">
                    <button 
                        className="button button-primary"
                        onClick={saveSettings}
                        disabled={saving}
                    >
                        <Cog6ToothIcon className="cht-icon" />
                        {saving ? __('Saving...', 'analogwp-client-handoff') : __('Save Settings', 'analogwp-client-handoff')}
                    </button>
                </div>
            </div>

            <div className="cht-settings-content">
                {activeTab === 'general' && renderGeneralTab()}
                {activeTab === 'users' && renderUsersTab()}
                {activeTab === 'categories' && renderCategoriesTab()}
            </div>
        </div>
    );
};

export default Settings;