import React, { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-brand-700 text-brand-50 
    hover:bg-brand-800 
    active:bg-brand-900
    focus:ring-brand-500/20
    dark:bg-brand-600 dark:hover:bg-brand-700 dark:active:bg-brand-800
    shadow-md hover:shadow-lg transition-all duration-200
  `,
  secondary: `
    bg-brand-100 text-brand-700 border border-brand-300
    hover:bg-brand-200 
    active:bg-brand-300
    focus:ring-brand-500/20
    dark:bg-brand-900/40 dark:text-brand-100 dark:border-brand-700 
    dark:hover:bg-brand-800/60
    transition-all duration-200
  `,
  ghost: `
    bg-transparent text-brand-700 
    hover:bg-brand-50 
    active:bg-brand-100
    dark:text-brand-200 dark:hover:bg-white/5 dark:active:bg-white/10
    transition-all duration-200
  `,
  danger: `
    bg-error-600 text-white
    hover:bg-error-700
    active:bg-error-800
    focus:ring-error-500/20
    dark:hover:bg-error-700
    shadow-md hover:shadow-lg transition-all duration-200
  `,
  success: `
    bg-success-600 text-white
    hover:bg-success-700
    active:bg-success-800
    focus:ring-success-500/20
    shadow-md hover:shadow-lg transition-all duration-200
  `,
  outline: `
    bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/3 dark:hover:text-gray-300
    transition-all duration-200
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm font-medium rounded-md',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-lg',
  lg: 'px-6 py-3 text-base font-semibold rounded-lg',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      startIcon,
      endIcon,
      iconPosition = 'left',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      onClick,
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium transition-all duration-200
      focus:outline-hidden focus:ring-4
      disabled:opacity-60 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    const finalClassName = `
      ${baseStyles}
      ${sizeStyles[size]}
      ${variantStyles[variant]}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // Handle backward compatibility with startIcon/endIcon
    const displayIcon = icon || startIcon;
    const displayEndIcon = endIcon;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={finalClassName}
        onClick={onClick}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && displayIcon && iconPosition === 'left' && <span className="flex items-center">{displayIcon}</span>}
        {children}
        {!isLoading && displayEndIcon && <span className="flex items-center">{displayEndIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
