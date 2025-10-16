import React from 'react';
import { Check } from 'lucide-react';

interface AvatarProps {
  email: string;
  size?: 'sm' | 'md';
  verified?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ email, size = 'sm', verified = true }) => {
  const getInitials = (email: string) => {
    const parts = email.split('@')[0];
    if (parts.length >= 2) {
      return parts.slice(0, 2).toUpperCase();
    }
    return parts.charAt(0).toUpperCase();
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
  };

  const badgeSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
  };

  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizeClasses[size]} bg-blue-500 rounded-full flex items-center justify-center text-white font-medium`}>
        {getInitials(email)}
      </div>
      {verified && (
        <div className={`absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full ${badgeSize[size]} flex items-center justify-center`}>
          <Check className={`${size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'} text-white stroke-2`} />
        </div>
      )}
    </div>
  );
};

export default Avatar;