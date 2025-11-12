/**
 * WordPress dependencies
 */
import { 
    SelectControl as WPSelectControl,
    TextControl as WPTextControl,
    TextareaControl as WPTextareaControl,
    ToggleControl as WPToggleControl,
    RangeControl as WPRangeControl,
    ColorPicker as WPColorPicker
} from '@wordpress/components';
import classnames from 'classnames';

/**
 * Select wrapper component
 */
export const Select = ({ 
    className = '',
    size = 'default',
    variant = 'default',
    ...props 
}) => {
    const selectClasses = classnames(
        'sn-select',
        {
            [`sn-select--${size}`]: size !== 'default',
            [`sn-select--${variant}`]: variant !== 'default',
        },
        className
    );

    return (
        <WPSelectControl
            className={selectClasses}
            {...props}
        />
    );
};

/**
 * TextInput wrapper component
 */
export const TextInput = ({ 
    className = '',
    size = 'default',
    variant = 'default',
    ...props 
}) => {
    const inputClasses = classnames(
        'sn-text-input',
        {
            [`sn-text-input--${size}`]: size !== 'default',
            [`sn-text-input--${variant}`]: variant !== 'default',
        },
        className
    );

    return (
        <WPTextControl
            className={inputClasses}
            {...props}
        />
    );
};

/**
 * Textarea wrapper component
 */
export const Textarea = ({ 
    className = '',
    size = 'default',
    variant = 'default',
    ...props 
}) => {
    const textareaClasses = classnames(
        'sn-textarea',
        {
            [`sn-textarea--${size}`]: size !== 'default',
            [`sn-textarea--${variant}`]: variant !== 'default',
        },
        className
    );

    return (
        <WPTextareaControl
            className={textareaClasses}
            {...props}
        />
    );
};

/**
 * Toggle wrapper component
 */
export const Toggle = ({ 
    className = '',
    size = 'default',
    variant = 'default',
    ...props 
}) => {
    const toggleClasses = classnames(
        'sn-toggle',
        {
            [`sn-toggle--${size}`]: size !== 'default',
            [`sn-toggle--${variant}`]: variant !== 'default',
        },
        className
    );

    return (
        <WPToggleControl
            className={toggleClasses}
            {...props}
        />
    );
};

/**
 * Range/Slider wrapper component
 */
export const Range = ({ 
    className = '',
    size = 'default',
    variant = 'default',
    ...props 
}) => {
    const rangeClasses = classnames(
        'sn-range',
        {
            [`sn-range--${size}`]: size !== 'default',
            [`sn-range--${variant}`]: variant !== 'default',
        },
        className
    );

    return (
        <WPRangeControl
            className={rangeClasses}
            {...props}
        />
    );
};

/**
 * ColorPicker wrapper component
 */
export const ColorPicker = ({ 
    className = '',
    size = 'default',
    variant = 'default',
    ...props 
}) => {
    const colorPickerClasses = classnames(
        'sn-color-picker',
        {
            [`sn-color-picker--${size}`]: size !== 'default',
            [`sn-color-picker--${variant}`]: variant !== 'default',
        },
        className
    );

    return (
        <WPColorPicker
            className={colorPickerClasses}
            {...props}
        />
    );
};