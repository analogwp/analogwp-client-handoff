/**
 * WordPress dependencies
 */
import { Button as WPButton } from '@wordpress/components';
import classnames from 'classnames';

/**
 * Custom Button wrapper component over WordPress Button
 * Provides centralized styling and consistent behavior
 */
const Button = ({ 
    children,
    variant = 'default',
    size = 'default',
    className = '',
    icon,
    disabled = false,
    loading = false,
    ...props
}) => {
    // Convert variant to WordPress Button props
    const getWPButtonProps = () => {
        const wpProps = { ...props };
        
        switch (variant) {
            case 'primary':
                wpProps.isPrimary = true;
                break;
            case 'secondary':
                wpProps.isSecondary = true;
                break;
            case 'tertiary':
                wpProps.variant = 'tertiary';
                break;
            case 'danger':
            case 'destructive':
                wpProps.isDestructive = true;
                break;
            case 'link':
                wpProps.variant = 'link';
                break;
            default:
                // default styling
                break;
        }

        // Handle size
        if (size === 'small') {
            wpProps.isSmall = true;
        } else if (size === 'large') {
            wpProps.isLarge = true;
        }

        // Handle loading state
        if (loading) {
            wpProps.isBusy = true;
            wpProps.disabled = true;
        }

        return wpProps;
    };

    // Additional custom classes for our styling
    const buttonClasses = classnames(
        'cht-button rounded-full!', // Base class for our custom styling
        {		
						'px-4! py-3!': variant !== 'link',
						'border-none! outline-none! shadow-sm! bg-white! text-gray-700!': variant === 'secondary',
						'text-gray-700! ': variant === 'tertiary',
						'text-red-800! border! border-red-800! hover:text-red-600! hover:border-red-600!': variant === 'danger',
            [`cht-button--${variant}`]: variant !== 'default',
            [`cht-button--${size}`]: size !== 'default',
            'cht-button--loading': loading,
            'cht-button--with-icon': !!icon,
        },
        className
    );

    return (
        <WPButton
            {...getWPButtonProps()}
            className={buttonClasses}
            disabled={disabled || loading}
            icon={icon}
        >
            {children}
        </WPButton>
    );
};

/**
 * IconButton component - Button with only an icon, no text
 */
export const IconButton = ({ 
    children,
    variant = 'tertiary',
    size = 'default',
    className = '',
    title,
    ...props
}) => {
    const iconButtonClasses = classnames(
        'cht-icon-button',
        {
            [`cht-icon-button--${variant}`]: variant !== 'tertiary',
            [`cht-icon-button--${size}`]: size !== 'default',
        },
        className
    );

    return (
        <Button
            variant={variant}
            size={size}
            className={iconButtonClasses}
            title={title}
            {...props}
        >
            {children}
        </Button>
    );
};

export default Button;