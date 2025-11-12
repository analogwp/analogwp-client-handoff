/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { 
    PlusIcon, 
    TrashIcon, 
    PencilIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

/**
 * Internal dependencies
 */
import { Button } from '../ui';
import { useSettings } from './SettingsProvider';
import { 
    SettingsSection, 
    SettingsCard, 
    TextInputField, 
    ColorInput,
    FieldDescription 
} from './FieldComponents';
import { showToast } from '../ToastProvider';
import logger from '../../../shared/utils/logger';

const LabelsAndFiltersSettings = () => {
    const { categories, setCategories, priorities, setPriorities, saveSettings } = useSettings();
    
    // Categories state
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editCategoryForm, setEditCategoryForm] = useState({ name: '' });

    // Priorities state
    const [newPriority, setNewPriority] = useState({ name: '', color: '#3858e9' });
    const [editingPriorityId, setEditingPriorityId] = useState(null);
    const [editPriorityForm, setEditPriorityForm] = useState({ name: '', color: '' });

    // Helper function to update categories and auto-save
    const updateCategories = async (newCategories) => {
        setCategories(newCategories);
        try {
            await saveSettings(true, newCategories, null);
        } catch (error) {
            logger.error('Error saving categories:', error);
            showToast.error(__('Failed to save categories', 'analogwp-site-notes'));
        }
    };

    // Helper function to update priorities and auto-save
    const updatePriorities = async (newPriorities) => {
        setPriorities(newPriorities);
        try {
            await saveSettings(true, null, newPriorities);
        } catch (error) {
            logger.error('Error saving priorities:', error);
            showToast.error(__('Failed to save priorities', 'analogwp-site-notes'));
        }
    };

    // Category functions
    const addCategory = async () => {
        if (!newCategory.name.trim()) {
            showToast.error(__('Category name is required', 'analogwp-site-notes'));
            return;
        }

        if (categories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
            showToast.error(__('Category name already exists', 'analogwp-site-notes'));
            return;
        }

        const category = {
            id: Date.now(),
            name: newCategory.name.trim()
        };

        await updateCategories([...categories, category]);
        setNewCategory({ name: '' });
        showToast.success(__('Category added successfully', 'analogwp-site-notes'));
    };

    const startEditCategory = (category) => {
        setEditingCategoryId(category.id);
        setEditCategoryForm({ name: category.name });
    };

    const cancelEditCategory = () => {
        setEditingCategoryId(null);
        setEditCategoryForm({ name: '' });
    };

    const saveEditCategory = async () => {
        if (!editCategoryForm.name.trim()) {
            showToast.error(__('Category name is required', 'analogwp-site-notes'));
            return;
        }

        if (categories.some(cat => cat.id !== editingCategoryId && cat.name.toLowerCase() === editCategoryForm.name.toLowerCase())) {
            showToast.error(__('Category name already exists', 'analogwp-site-notes'));
            return;
        }

        await updateCategories(categories.map(cat => 
            cat.id === editingCategoryId 
                ? { ...cat, name: editCategoryForm.name.trim() }
                : cat
        ));
        
        setEditingCategoryId(null);
        setEditCategoryForm({ name: '' });
        showToast.success(__('Category updated successfully', 'analogwp-site-notes'));
    };

    const deleteCategory = async (id) => {
        await updateCategories(categories.filter(cat => cat.id !== id));
        showToast.success(__('Category deleted successfully', 'analogwp-site-notes'));
    };

    // Priority functions
    const addPriority = async () => {
        if (!newPriority.name.trim()) {
            showToast.error(__('Priority name is required', 'analogwp-site-notes'));
            return;
        }

        if (priorities.some(pri => pri.name.toLowerCase() === newPriority.name.toLowerCase())) {
            showToast.error(__('Priority name already exists', 'analogwp-site-notes'));
            return;
        }

        const priority = {
            id: Date.now(),
            key: newPriority.name.toLowerCase().replace(/\s+/g, '_'),
            name: newPriority.name.trim(),
            color: newPriority.color
        };

        await updatePriorities([...priorities, priority]);
        setNewPriority({ name: '', color: '#f59e0b' });
        showToast.success(__('Priority added successfully', 'analogwp-site-notes'));
    };

    const startEditPriority = (priority) => {
        setEditingPriorityId(priority.id);
        setEditPriorityForm({ name: priority.name, color: priority.color });
    };

    const cancelEditPriority = () => {
        setEditingPriorityId(null);
        setEditPriorityForm({ name: '', color: '' });
    };

    const saveEditPriority = async () => {
        if (!editPriorityForm.name.trim()) {
            showToast.error(__('Priority name is required', 'analogwp-site-notes'));
            return;
        }

        if (priorities.some(pri => pri.id !== editingPriorityId && pri.name.toLowerCase() === editPriorityForm.name.toLowerCase())) {
            showToast.error(__('Priority name already exists', 'analogwp-site-notes'));
            return;
        }

        await updatePriorities(priorities.map(pri => 
            pri.id === editingPriorityId 
                ? { ...pri, name: editPriorityForm.name.trim(), color: editPriorityForm.color, key: editPriorityForm.name.toLowerCase().replace(/\s+/g, '_') }
                : pri
        ));
        
        setEditingPriorityId(null);
        setEditPriorityForm({ name: '', color: '' });
        showToast.success(__('Priority updated successfully', 'analogwp-site-notes'));
    };

    const deletePriority = async (id) => {
        await updatePriorities(priorities.filter(pri => pri.id !== id));
        showToast.success(__('Priority deleted successfully', 'analogwp-site-notes'));
    };

    const predefinedColors = [
        '#3858e9', '#e74c3c', '#2ecc71', '#f39c12', 
        '#9b59b6', '#1abc9c', '#34495e', '#9fa1a3'
    ];

    return (
        <div className="p-6 max-w-4xl">
            {/* Priorities Section */}
            <SettingsSection
                title={__('Priorities', 'analogwp-site-notes')}
                description={__('Define priority levels for tasks with customizable colors.', 'analogwp-site-notes')}
            >
                <SettingsCard title={__('Add New Priority', 'analogwp-site-notes')}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInputField
                                id="new_priority_name"
                                label={__('Priority Name', 'analogwp-site-notes')}
                                value={newPriority.name}
                                onChange={(value) => setNewPriority({ ...newPriority, name: value })}
                                placeholder={__('Enter priority name...', 'analogwp-site-notes')}
                            />
                            
                            <ColorInput
                                id="new_priority_color"
                                label={__('Priority Color', 'analogwp-site-notes')}
                                value={newPriority.color}
                                onChange={(value) => setNewPriority({ ...newPriority, color: value })}
                            />
                        </div>
                        
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">{__('Quick Colors:', 'analogwp-site-notes')}</label>
                            <div className="flex flex-wrap gap-2">
                                {predefinedColors.map(color => (
                                    <button
                                        key={color}
                                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                                            newPriority.color === color 
                                                ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setNewPriority({ ...newPriority, color })}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={addPriority}
                            disabled={!newPriority.name.trim()}
                            variant="primary"
                            size="default"
                            icon={<PlusIcon className="w-4 h-4" />}
                        >
                            {__('Add Priority', 'analogwp-site-notes')}
                        </Button>
                    </div>
                </SettingsCard>

                <SettingsCard title={__('Existing Priorities', 'analogwp-site-notes')}>
                    {priorities.length === 0 ? (
                        <FieldDescription>
                            {__('No priorities created yet. Add your first priority above.', 'analogwp-site-notes')}
                        </FieldDescription>
                    ) : (
                        <div className="space-y-3">
                            {priorities.map(priority => (
                                <div key={priority.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    {editingPriorityId === priority.id ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <TextInputField
                                                    value={editPriorityForm.name}
                                                    onChange={(value) => setEditPriorityForm({ ...editPriorityForm, name: value })}
                                                    placeholder={__('Priority name...', 'analogwp-site-notes')}
                                                />
                                                <ColorInput
                                                    value={editPriorityForm.color}
                                                    onChange={(value) => setEditPriorityForm({ ...editPriorityForm, color: value })}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={saveEditPriority}
                                                    variant="primary"
                                                    size="small"
                                                    icon={<CheckIcon className="w-4 h-4" />}
                                                    title={__('Save changes', 'analogwp-site-notes')}
                                                >
                                                    {__('Save', 'analogwp-site-notes')}
                                                </Button>
                                                <Button
                                                    onClick={cancelEditPriority}
                                                    variant="secondary"
                                                    size="small"
                                                    icon={<XMarkIcon className="w-4 h-4" />}
                                                    title={__('Cancel editing', 'analogwp-site-notes')}
                                                >
                                                    {__('Cancel', 'analogwp-site-notes')}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span 
                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: priority.color }}
                                                />
                                                <span className="font-medium text-gray-900">{priority.name}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => startEditPriority(priority)}
                                                    variant="tertiary"
                                                    size="small"
                                                    title={__('Edit priority', 'analogwp-site-notes')}
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        if (confirm(__('Are you sure you want to delete this priority?', 'analogwp-site-notes'))) {
                                                            deletePriority(priority.id);
                                                        }
                                                    }}
                                                    variant="destructive"
                                                    size="small"
                                                    title={__('Delete priority', 'analogwp-site-notes')}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </SettingsCard>
            </SettingsSection>

						{/* Categories Section */}
            <SettingsSection
                title={__('Categories', 'analogwp-site-notes')}
                description={__('Organize comments and tasks into categories for better project management.', 'analogwp-site-notes')}
            >
                <SettingsCard title={__('Add New Category', 'analogwp-site-notes')}>
                    <div className="space-y-6">
                        <TextInputField
                            id="new_category_name"
                            label={__('Category Name', 'analogwp-site-notes')}
                            value={newCategory.name}
                            onChange={(value) => setNewCategory({ ...newCategory, name: value })}
                            placeholder={__('Enter category name...', 'analogwp-site-notes')}
                        />

                        <Button
                            onClick={addCategory}
                            disabled={!newCategory.name.trim()}
                            variant="primary"
                            size="default"
                            icon={<PlusIcon className="w-4 h-4" />}
                        >
                            {__('Add Category', 'analogwp-site-notes')}
                        </Button>
                    </div>
                </SettingsCard>

                <SettingsCard title={__('Existing Categories', 'analogwp-site-notes')}>
                    {categories.length === 0 ? (
                        <FieldDescription>
                            {__('No categories created yet. Add your first category above.', 'analogwp-site-notes')}
                        </FieldDescription>
                    ) : (
                        <div className="space-y-3">
                            {categories.map(category => (
                                <div key={category.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    {editingCategoryId === category.id ? (
                                        <div className="space-y-4">
                                            <TextInputField
                                                value={editCategoryForm.name}
                                                onChange={(value) => setEditCategoryForm({ ...editCategoryForm, name: value })}
                                                placeholder={__('Category name...', 'analogwp-site-notes')}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={saveEditCategory}
                                                    variant="primary"
                                                    size="small"
                                                    icon={<CheckIcon className="w-4 h-4" />}
                                                    title={__('Save changes', 'analogwp-site-notes')}
                                                >
                                                    {__('Save', 'analogwp-site-notes')}
                                                </Button>
                                                <Button
                                                    onClick={cancelEditCategory}
                                                    variant="secondary"
                                                    size="small"
                                                    icon={<XMarkIcon className="w-4 h-4" />}
                                                    title={__('Cancel editing', 'analogwp-site-notes')}
                                                >
                                                    {__('Cancel', 'analogwp-site-notes')}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-gray-900">{category.name}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => startEditCategory(category)}
                                                    variant="tertiary"
                                                    size="small"
                                                    title={__('Edit category', 'analogwp-site-notes')}
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        if (confirm(__('Are you sure you want to delete this category?', 'analogwp-site-notes'))) {
                                                            deleteCategory(category.id);
                                                        }
                                                    }}
                                                    variant="destructive"
                                                    size="small"
                                                    title={__('Delete category', 'analogwp-site-notes')}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </SettingsCard>
            </SettingsSection>
        </div>
    );
};

export default LabelsAndFiltersSettings;
