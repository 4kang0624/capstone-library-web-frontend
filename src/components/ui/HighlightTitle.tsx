'use client';

import { motion } from 'framer-motion';

interface HighlightTitleProps {
  title: string;
  className?: string;
  color?: string;
  height?: string;
  autoHighlight?: boolean;
  delay?: number;
  duration?: number;
}

export function HighlightTitle({
  title,
  className,
  color = 'var(--color-accent-gold-2)',
  height = '0%',
  autoHighlight = false,
  delay = 0,
  duration = 0.2,
}: HighlightTitleProps) {
  return (
    <motion.span
      className={className}
      initial={autoHighlight ? { backgroundSize: '0% 85%' } : undefined}
      whileInView={autoHighlight ? { backgroundSize: '100% 85%' } : undefined}
      viewport={autoHighlight ? { once: true, amount: 0.8 } : undefined}
      variants={
        autoHighlight
          ? undefined
          : {
              hidden: { backgroundSize: '0% 85%' },
              visible: { backgroundSize: '0% 85%' },
              rest: { backgroundSize: '0% 85%' },
              hovered: { backgroundSize: '100% 85%' },
            }
      }
      transition={{ duration, delay, ease: 'easeOut' }}
      style={{
        backgroundImage: `linear-gradient(transparent ${height}, ${color} ${height})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        backgroundSize: '0% 85%',
      }}
    >
      {title}
    </motion.span>
  );
}
