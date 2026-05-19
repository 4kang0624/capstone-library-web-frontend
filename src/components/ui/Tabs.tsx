'use client';

import React from 'react';
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
        'flex gap-1 bg-[#F2F4F6] p-1 rounded-xl w-fit',
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
            value === tab.value
              ? 'bg-white text-[#191F28] shadow-sm'
              : 'text-[#6B7684] hover:text-[#191F28]',
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
                value === tab.value ? 'bg-[#3182F6] text-white' : 'bg-[#E5E8EB] text-[#6B7684]',
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
