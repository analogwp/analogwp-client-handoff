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
        'cht-select',
        {
            [`cht-select--${size}`]: size !== 'default',
            [`cht-select--${variant}`]: variant !== 'default',
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
        'cht-text-input',
        {
            [`cht-text-input--${size}`]: size !== 'default',
            [`cht-text-input--${variant}`]: variant !== 'default',
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
        'cht-textarea',
        {
            [`cht-textarea--${size}`]: size !== 'default',
            [`cht-textarea--${variant}`]: variant !== 'default',
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
        'cht-toggle',
        {
            [`cht-toggle--${size}`]: size !== 'default',
            [`cht-toggle--${variant}`]: variant !== 'default',
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
        'cht-range',
        {
            [`cht-range--${size}`]: size !== 'default',
            [`cht-range--${variant}`]: variant !== 'default',
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
        'cht-color-picker',
        {
            [`cht-color-picker--${size}`]: size !== 'default',
            [`cht-color-picker--${variant}`]: variant !== 'default',
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