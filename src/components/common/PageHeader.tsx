import React from 'react';
import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-6', className)}>
      <div>
        <h1 className="font-serif text-3xl font-bold text-text-dark">{title}</h1>
        {description && <p className="font-serif mt-1 text-text-gray">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
