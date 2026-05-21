import React from 'react';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 gap-4 text-center', className)}>
      {icon && <div className="text-text-light mb-2">{icon}</div>}
      <h3 className="text-xl font-bold text-text-medium">{title}</h3>
      {description && <p className="text-text-gray text-sm max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
