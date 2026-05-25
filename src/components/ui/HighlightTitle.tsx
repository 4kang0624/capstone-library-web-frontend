'use client';

import { motion } from 'framer-motion';

interface HighlightTitleProps {
  title: string;
  className?: string;
}

export function HighlightTitle({ title, className }: HighlightTitleProps) {
  return (
    <motion.span
      className={className}
      variants={{
        rest: { backgroundSize: '0% 85%' },
        hovered: { backgroundSize: '100% 85%' },
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        backgroundImage: 'linear-gradient(var(--color-accent-gold-2), var(--color-accent-gold-2))',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
      }}
    >
      {title}
    </motion.span>
  );
}
