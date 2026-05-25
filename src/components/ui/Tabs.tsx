'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface Tab {
  label: string;
  value: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex gap-1 p-1 bg-bg-light-4 rounded-xl w-fit relative',
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors z-10',
            value === tab.value
              ? 'text-text-dark'
              : 'text-text-gray hover:text-text-dark',
          )}
        >
          {value === tab.value && (
            <motion.div
              layoutId="tab-highlight"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 bg-bg-light-1 rounded-lg shadow-sm -z-10"
            />
          )}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
                value === tab.value ? 'bg-bg-light-5 text-text-dark' : 'bg-bg-light-2 text-text-gray',
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
