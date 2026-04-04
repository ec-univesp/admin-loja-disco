import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  status?: 'online' | 'offline' | 'busy' | 'none';
}

const sizeClasses = {
  xsmall: 'h-6 w-6 max-w-6',
  small: 'h-8 w-8 max-w-8',
  medium: 'h-10 w-10 max-w-10',
  large: 'h-12 w-12 max-w-12',
  xlarge: 'h-14 w-14 max-w-14',
  xxlarge: 'h-16 w-16 max-w-16',
};

const iconSizeClasses = {
  xsmall: 'h-3 w-3',
  small: 'h-4 w-4',
  medium: 'h-5 w-5',
  large: 'h-6 w-6',
  xlarge: 'h-7 w-7',
  xxlarge: 'h-8 w-8',
};

const statusSizeClasses = {
  xsmall: 'h-1.5 w-1.5 max-w-1.5',
  small: 'h-2 w-2 max-w-2',
  medium: 'h-2.5 w-2.5 max-w-2.5',
  large: 'h-3 w-3 max-w-3',
  xlarge: 'h-3.5 w-3.5 max-w-3.5',
  xxlarge: 'h-4 w-4 max-w-4',
};

const statusColorClasses = {
  online: 'bg-success-500',
  offline: 'bg-error-400',
  busy: 'bg-warning-500',
};

const Avatar: React.FC<AvatarProps> = ({
  alt = 'User Avatar',
  size = 'medium',
  status = 'none',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 ${sizeClasses[size]}`}>
      <svg
        className={`${iconSizeClasses[size]} text-white`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>

      {status !== 'none' && (
        <span
          className={`absolute right-0 bottom-0 rounded-full border-[1.5px] border-white dark:border-gray-900 ${
            statusSizeClasses[size]
          } ${statusColorClasses[status] || ''}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
