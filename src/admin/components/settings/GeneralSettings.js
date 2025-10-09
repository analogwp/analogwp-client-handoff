/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useSettings } from './SettingsProvider';
import { 
    SettingsSection, 
    SettingsCard, 
    ToggleField, 
    SelectField, 
    NumberInput, 
    MultiSelect,
    FieldDescription 
} from './FieldComponents';

const GeneralSettings = () => {
    const { settings, updateSetting } = useSettings();

    return (
        <div className="p-6 max-w-4xl">
            <SettingsSection
                title={__('General Configuration', 'analogwp-client-handoff')}
                description={__('Basic settings for the Client Handoff plugin functionality.', 'analogwp-client-handoff')}
            >
                <SettingsCard title={__('Screenshot Settings', 'analogwp-client-handoff')}>
                    <ToggleField
                        id="auto_screenshot"
                        label={__('Enable Automatic Screenshots', 'analogwp-client-handoff')}
                        description={__('Automatically capture screenshots when comments are created to provide visual context.', 'analogwp-client-handoff')}
                        checked={settings.general?.auto_screenshot ?? true}
                        onChange={(value) => updateSetting('general.auto_screenshot', value)}
                    />

                    <NumberInput
                        id="screenshot_quality"
                        label={__('Screenshot Quality', 'analogwp-client-handoff')}
                        description={__('Higher quality results in larger file sizes. Range: 0.1 (lowest) to 1.0 (highest).', 'analogwp-client-handoff')}
                        value={settings.general?.screenshot_quality ?? 0.8}
                        onChange={(value) => updateSetting('general.screenshot_quality', value)}
                        min={0.1}
                        max={1.0}
                        step={0.1}
                        unit="%"
                    />
                </SettingsCard>

                <SettingsCard title={__('Display Settings', 'analogwp-client-handoff')}>
                    <NumberInput
                        id="comments_per_page"
                        label={__('Comments Per Page', 'analogwp-client-handoff')}
                        description={__('Number of comments to display per page in the admin dashboard.', 'analogwp-client-handoff')}
                        value={settings.general?.comments_per_page ?? 20}
                        onChange={(value) => updateSetting('general.comments_per_page', value)}
                        min={5}
                        max={100}
                        step={5}
                    />

                    <SelectField
                        id="theme_mode"
                        label={__('Theme Mode', 'analogwp-client-handoff')}
                        description={__('Choose the color scheme for the admin interface.', 'analogwp-client-handoff')}
                        value={settings.general?.theme_mode ?? 'auto'}
                        onChange={(value) => updateSetting('general.theme_mode', value)}
                        options={themeModeOptions}
                    />
                </SettingsCard>

                <SettingsCard title={__('Auto-save Settings', 'analogwp-client-handoff')}>
                    <ToggleField
                        id="auto_save_drafts"
                        label={__('Enable Auto-save', 'analogwp-client-handoff')}
                        description={__('Automatically save settings changes every 5 seconds to prevent data loss.', 'analogwp-client-handoff')}
                        checked={settings.general?.auto_save_drafts ?? true}
                        onChange={(value) => updateSetting('general.auto_save_drafts', value)}
                    />
                </SettingsCard>
            </SettingsSection>
        </div>
    );
};

export default GeneralSettings;