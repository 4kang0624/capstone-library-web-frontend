'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface BookmarkRibbonButtonProps {
  onClick: () => void;
  title?: string;
  active?: boolean;
  children?: ReactNode;
  className?: string;
  foldHeight?: number;
  baseHeight?: number;
}

export function BookmarkRibbonButton({
  onClick,
  title,
  active = false,
  children,
  className,
  foldHeight = 14,
  baseHeight = 100,
}: BookmarkRibbonButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Dimensions
  const W = 50;
  const BASE_H = baseHeight;
  const EXTEND_H = 10;
  const EXTEND_H_CLICKED = 30;

  const FOLD_W = 7;
  const FOLD_H = foldHeight;

  const BODY_X = FOLD_W;
  const BODY_W = W - BODY_X;

  const TOP_H = 16;
  const TOP_RADIUS = 7;
  const TAIL_H = 30;

  const BASE_SHAFT_H = BASE_H - TOP_H - TAIL_H;
  const BASE_TAIL_Y = TOP_H + BASE_SHAFT_H;

  const CENTER_X = BODY_X + BODY_W / 2;
  const NOTCH_OFFSET = 12;

  const SEAM_OVERLAP = 0.75;

  const currentExtendH = clicked ? EXTEND_H_CLICKED : hovered ? EXTEND_H : 0;
  const visualHeight = BASE_H + currentExtendH;

  const CONTENT_TAIL_COMPENSATION = TAIL_H * 0.35;
  const contentBaseHeight = BASE_H - CONTENT_TAIL_COMPENSATION;

  const FILL_COLOR = active
    ? 'var(--color-burgundy-3)'
    : 'var(--color-burgundy-1)';

  const FOLD_COLOR = active
    ? 'var(--color-burgundy-4)'
    : 'var(--color-burgundy-2)';

  const REST_DROP_SHADOW = 'var(--drop-shadow-sm)';
  const HOVER_DROP_SHADOW = 'var(--drop-shadow-md)';

  const enterTransition = {
    type: 'tween',
    duration: 0.22,
    ease: 'easeOut',
  } as const;

  const clickTransition = {
    type: 'tween',
    duration: 0.15,
    ease: 'easeOut',
  } as const;

  const leaveTransition = {
    type: 'tween',
    duration: 0.22,
    ease: 'easeOut',
  } as const;

  const ribbonTransition = clicked
    ? clickTransition
    : hovered
      ? enterTransition
      : leaveTransition;

  const handleClick = () => {
    setClicked(true);
    onClick();

    window.setTimeout(() => {
      setClicked(false);
    }, 150);
  };

  return (
    <div
      className={cn('absolute z-10', className)}
      style={{ top: '-14px', right: '28px' }}
    >
      <motion.button
        onClick={handleClick}
        title={title}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative text-white"
        style={{
          width: W,
          overflow: 'visible',
        }}
        animate={{
          height: visualHeight,
        }}
        transition={ribbonTransition}
      >
        <svg
          width={W}
          height={BASE_H}
          viewBox={`0 0 ${W} ${BASE_H}`}
          className="absolute left-0 top-0"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          shapeRendering="geometricPrecision"
          style={{
            overflow: 'visible',
          }}
        >
          {/* Main ribbon: shadow applies only here, not to fold */}
          <motion.g
            style={{
              fill: FILL_COLOR,
              filter: `drop-shadow(${
                hovered || clicked ? HOVER_DROP_SHADOW : REST_DROP_SHADOW
              })`,
              transition: 'fill 0.2s ease, filter 0.2s ease',
            }}
          >
            {/* Top cap */}
            <path
              d={`
                M ${BODY_X} 0
                H ${W - TOP_RADIUS}
                Q ${W} 0, ${W} ${TOP_RADIUS}
                V ${TOP_H + SEAM_OVERLAP}
                H ${BODY_X}
                Z
              `}
            />

            {/* Stretchable shaft */}
            <motion.rect
              x={BODY_X}
              y={TOP_H - SEAM_OVERLAP}
              width={BODY_W}
              animate={{
                height:
                  BASE_SHAFT_H +
                  currentExtendH +
                  SEAM_OVERLAP * 2,
              }}
              transition={ribbonTransition}
            />

            {/* Tail */}
            <motion.g
              animate={{
                y: currentExtendH,
              }}
              transition={ribbonTransition}
            >
              <path
                d={`
                  M ${BODY_X} ${BASE_TAIL_Y - SEAM_OVERLAP}
                  H ${W}
                  V ${BASE_H}
                  L ${CENTER_X} ${BASE_TAIL_Y + NOTCH_OFFSET}
                  L ${BODY_X} ${BASE_H}
                  Z
                `}
              />
            </motion.g>
          </motion.g>

          {/* Fold: no shadow */}
          <path
            d={`
              M ${FOLD_W} 0
              V ${FOLD_H + SEAM_OVERLAP}
              H 0
              V ${FOLD_H * 0.5}
              C 0 ${FOLD_H * 0.22}, ${FOLD_W * 0.45} 0, ${FOLD_W} 0
              Z
            `}
            style={{
              fill: FOLD_COLOR,
              transition: 'fill 0.2s ease',
            }}
          />
        </svg>

        {/* Content follows the ribbon extension */}
        <motion.div
          className="absolute z-10 flex flex-col items-center justify-center"
          style={{
            left: BODY_X,
            top: 0,
            width: BODY_W,
            height: contentBaseHeight,
          }}
          animate={{
            y: currentExtendH,
          }}
          transition={ribbonTransition}
        >
          {children}
        </motion.div>
      </motion.button>
    </div>
  );
}