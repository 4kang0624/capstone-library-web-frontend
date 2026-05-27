'use client';

import Link from 'next/link';
import { useCallback, useRef, type WheelEvent } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Handshake,
  LibraryBig,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { ShelfieLogoColor } from '@/assets';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';
import { AppFooter } from '@/components/layout/AppFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { HighlightTitle } from '@/components/ui/HighlightTitle';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const noMotion: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};

const noStagger: Variants = {
  hidden: {},
  visible: {},
};

const viewport = { once: true, margin: '-80px' };
const snapSectionClasses = 'snap-start min-h-[calc(100vh-73px)] flex items-center';
const panelClasses = 'rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-light-1)] shadow-sm';
const paperPanelClasses = 'rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-light-2)] shadow-sm';
const panelHoverClasses = 'transition-all hover:-translate-y-1 hover:shadow-lg';
const primaryButtonClasses =
  'inline-flex items-center justify-center rounded-xl border border-[var(--color-primary-blue-4)] bg-[var(--color-primary-blue-3)] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--color-primary-blue-4)] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary-blue-6)]';
const secondaryButtonClasses =
  'inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-light-1)] font-bold text-[var(--color-primary-blue-6)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--color-bg-light-3)] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary-blue-3)]';

const features: {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    number: '01',
    title: '책 등록',
    description: '내가 가진 책을 간단히 등록하고 대여 가능 상태로 설정합니다.',
    icon: BookMarked,
  },
  {
    number: '02',
    title: 'Peer-to-Peer 대여',
    description: '필요한 책을 다른 사용자에게 직접 요청하고 대여할 수 있습니다.',
    icon: Handshake,
  },
  {
    number: '03',
    title: '안전한 기록',
    description: '대여 요청, 진행, 반납 상태를 투명하게 관리합니다.',
    icon: ClipboardCheck,
  },
];

const featuredBooks: {
  title: string;
  author: string;
  status: '대여 가능' | '요청 중' | '대여 중' | '대여 불가';
  condition: string;
  bookmark: string;
  coverStyle: string;
}[] = [
  {
    title: '데미안',
    author: '헤르만 헤세',
    status: '대여 가능',
    condition: '좋음',
    bookmark: '341 Page',
    coverStyle: 'bg-[linear-gradient(135deg,var(--color-accent-gold-1),var(--color-accent-gold-3))]',
  },
  {
    title: '노르웨이의 숲',
    author: '무라카미 하루키',
    status: '요청 중',
    condition: '양호',
    bookmark: '62 Page',
    coverStyle: 'bg-[linear-gradient(135deg,var(--color-bg-light-4),var(--color-primary-blue-1))]',
  },
  {
    title: '이방인',
    author: '알베르 카뮈',
    status: '대여 중',
    condition: '좋음',
    bookmark: '24 Page',
    coverStyle: 'bg-[linear-gradient(135deg,var(--color-info-light),var(--color-primary-blue-3))]',
  },
  {
    title: '코스모스',
    author: '칼 세이건',
    status: '대여 가능',
    condition: '좋음',
    bookmark: '123 Page',
    coverStyle: 'bg-[linear-gradient(135deg,var(--color-primary-blue-6),var(--color-accent-gold-2))]',
  },
];

const steps = [
  {
    number: '01',
    title: '책 등록',
    description: '보유한 책의 정보를 입력하고 대여 가능 상태로 설정합니다.',
  },
  {
    number: '02',
    title: '대여 요청',
    description: '다른 사용자가 책을 보고 대여를 요청합니다.',
  },
  {
    number: '03',
    title: '대여 상태 기록',

    description: '요청, 승인, 대여 중, 반납 완료 상태를 관리합니다.',
  },
  {
    number: '04',
    title: '책 반납',
    description: '반납 후 대여 기록이 완료 상태로 저장됩니다.',
  },
];

const trustItems: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: '대여 상태 추적',
    description: '요청부터 반납까지 진행 상태를 명확하게 확인합니다.',
    icon: CheckCircle2,
  },
  {
    title: '거래 기록 관리',
    description: '대여 과정의 주요 기록을 투명하게 남깁니다.',
    icon: FileCheck2,
  },
  {
    title: '신뢰 기반 대여',
    description: '사용자 간 책 공유가 더 안전하게 이루어지도록 돕습니다.',
    icon: ShieldCheck,
  },
];

const statusBadgeClasses: Record<(typeof featuredBooks)[number]['status'], string> = {
  '대여 가능': 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  '요청 중': 'bg-[var(--color-warning-light)] text-[var(--color-warning-dark)]',
  '대여 중': 'bg-[var(--color-info-light)] text-[var(--color-info)]',
  '대여 불가': 'bg-[var(--color-error-light)] text-[var(--color-error)]',
};

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn('mx-auto max-w-3xl', align === 'center' ? 'text-center' : 'text-left')}>
      {eyebrow && (
        <p className="mb-3 text-sm font-bold uppercase text-[var(--color-accent-gold-5)]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-4xl font-bold leading-tight text-[var(--color-text-dark)] md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-[var(--color-text-medium)] md:text-lg">{description}</p>
    </div>
  );
}

function HeroVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={reduceMotion ? noMotion : fadeUp}
      className="relative grid w-full gap-4 sm:min-h-[560px] lg:min-h-[610px]"
      aria-label="Shelfie 대여 상태 미리보기"
    >
      <div className={cn(panelClasses, 'relative w-full bg-[var(--color-bg-light-3)] p-5 sm:absolute sm:left-10 sm:top-8 sm:w-[78%] sm:max-w-[380px] lg:left-2')}>
        <div className="mb-5 flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <p className="font-serif text-2xl font-bold text-[var(--color-primary-blue-6)]">My Shelf</p>
          <span className="border border-[var(--color-border)] bg-[var(--color-accent-gold-1)] px-2 py-1 text-xs font-bold text-[var(--color-accent-gold-5)]">
            24 books
          </span>
        </div>
        <div className="flex h-56 items-end gap-3 border-b-4 border-[var(--color-border)] px-3">
          {['h-44 bg-[var(--color-primary-blue-6)]', 'h-52 bg-[var(--color-accent-gold-3)]', 'h-36 bg-[var(--color-success)]', 'h-48 bg-[var(--color-primary-blue-3)]', 'h-40 bg-[var(--color-error)]'].map(
            (bookClass) => (
              <div
                key={bookClass}
                className={cn('w-12 rounded-t-lg border border-[var(--color-border)] shadow-sm', bookClass)}
              />
            ),
          )}
        </div>
      </div>

      <motion.div
        whileHover={reduceMotion ? {} : { y: -6, rotate: -1 }}
        className={cn(panelClasses, 'relative w-full max-w-[220px] justify-self-end p-3 sm:absolute sm:right-12 sm:top-0 sm:w-48 lg:right-4')}
      >
        <div className="flex aspect-[3/4] flex-col justify-between rounded-xl border border-[var(--color-border-light)] bg-[linear-gradient(135deg,var(--color-accent-gold-2),var(--color-bg-light-1))] p-4">
          <span className="text-xs font-bold uppercase text-[var(--color-primary-blue-6)]">
            Featured Book
          </span>
          <div>
            <p className="font-serif text-3xl font-bold leading-none text-[var(--color-text-dark)]">Demian</p>
            <p className="mt-2 text-xs font-semibold text-[var(--color-text-medium)]">H. Hesse</p>
          </div>
        </div>
      </motion.div>

      <div className={cn(panelClasses, 'relative w-full p-4 sm:absolute sm:bottom-20 sm:right-8 sm:w-64')}>
        <div className="mb-3 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[var(--color-success)]" />
          <p className="text-sm font-bold text-[var(--color-text-dark)]">대여 상태</p>
        </div>
        <div className="space-y-2">
          {['대여 가능', '요청 중', '대여 중'].map((status) => (
            <div
              key={status}
              className="flex items-center justify-between rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-light-2)] px-3 py-2"
            >
              <span className="text-xs font-semibold text-[var(--color-text-medium)]">{status}</span>
              <span className="h-2 w-12 bg-[var(--color-accent-gold-2)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full rounded-2xl border border-[var(--color-primary-blue-5)] bg-[var(--color-primary-blue-6)] p-5 text-[var(--color-bg-light-1)] shadow-sm sm:absolute sm:bottom-0 sm:left-20 sm:w-60 lg:left-6">
        <p className="text-xs font-bold uppercase text-[var(--color-accent-gold-2)]">
          Active Lending
        </p>
        <div className="mt-4 flex items-end justify-between">
          <p className="font-serif text-6xl font-bold leading-none">18</p>
          <p className="max-w-20 text-right text-xs leading-5 text-[var(--color-bg-light-5)]">이번 주 진행 중인 대여</p>
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection({
  itemVariant,
  containerVariant,
  reduceMotion,
}: {
  itemVariant: Variants;
  containerVariant: Variants;
  reduceMotion: boolean;
}) {
  return (
    <section id="main" className={cn(snapSectionClasses, 'overflow-hidden bg-[var(--color-bg-light-1)]')}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={containerVariant}>
          <motion.p
            variants={itemVariant}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-accent-gold-1)] px-3 py-2 text-xs font-bold uppercase text-[var(--color-accent-gold-5)] shadow-sm"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Shared library for everyone
          </motion.p>
          <motion.h1
            variants={itemVariant}
            className="max-w-4xl font-serif text-5xl font-bold leading-[1.08] text-[var(--color-primary-blue-6)] sm:text-6xl lg:text-7xl"
          >
            내 책장이<br/>{' '}
            <HighlightTitle
              title="작은 도서관"
              color="var(--color-accent-gold-1)"
              height="50%"
              autoHighlight
              delay={reduceMotion ? 0 : 0.4}
              duration={reduceMotion ? 0 : 0.4}
              className="px-1"
            />
            이 되는 곳
          </motion.h1>
          <motion.p
            variants={itemVariant}
            className="mt-6 font-serif text-2xl italic text-[var(--color-accent-gold-5)] md:text-3xl"
          >
            Your Bookshelf,<br/>Shared with Trust.
          </motion.p>
          <motion.p
            variants={itemVariant}
            className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-text-medium)]"
          >
            Shelfie에서 책을 등록하고, 읽고싶은 책은 이웃에게 빌려보세요.
          </motion.p>

          <motion.div variants={itemVariant} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ROUTES.SEARCH}
              className={cn(primaryButtonClasses, 'gap-2 px-6 py-4 text-base')}
            >
              책 둘러보기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className={cn(secondaryButtonClasses, 'px-6 py-4 text-base')}
            >
              시작하기
            </Link>
          </motion.div>
        </motion.div>

        <HeroVisual reduceMotion={reduceMotion} />
      </div>
    </section>
  );
}

function CoreFeaturesSection({
  itemVariant,
  containerVariant,
  reduceMotion,
}: {
  itemVariant: Variants;
  containerVariant: Variants;
  reduceMotion: boolean;
}) {
  return (
    <section id="features" className={cn(snapSectionClasses, 'border-y border-[var(--color-border-light)] bg-[var(--color-bg-light-3)] py-14 md:py-16')}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={itemVariant}>
          <SectionHeading
            title="책을 공유하는 가장 간단한 방법."
            description="등록부터 대여, 기록 관리까지 Shelfie 안에서 자연스럽게 이어집니다."
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={containerVariant}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.number}
              variants={itemVariant}
              whileHover={reduceMotion ? {} : { y: -4 }}
              className={cn(panelClasses, panelHoverClasses, 'group p-6')}
            >
              <div className="mb-10 flex items-start justify-between">
                <span className="font-serif text-6xl font-bold leading-none text-[var(--color-accent-gold-3)]">
                  {feature.number}
                </span>
                <feature.icon
                  className="h-8 w-8 text-[var(--color-primary-blue-6)] transition-transform group-hover:-rotate-3"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[var(--color-text-dark)]">{feature.title}</h3>
              <p className="mt-4 leading-7 text-[var(--color-text-medium)]">{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedBooksSection({
  itemVariant,
  containerVariant,
  reduceMotion,
}: {
  itemVariant: Variants;
  containerVariant: Variants;
  reduceMotion: boolean;
}) {
  return (
    <section id="featured-books" className={cn(snapSectionClasses, 'bg-[var(--color-bg-light-1)] py-14 md:py-16')}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={itemVariant}>
          <SectionHeading title="한눈에 볼 수 있는 디지털 서재." description="책을 등록해 소장한 책을 간편하게 관리해보세요." />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={containerVariant}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {featuredBooks.map((book) => (
            <motion.article
              key={book.title}
              variants={itemVariant}
              whileHover={reduceMotion ? undefined : 'hovered'}
              className={cn(paperPanelClasses, panelHoverClasses, 'p-4')}
            >
              <motion.div
                whileHover={reduceMotion ? {} : { y: -6, rotate: -1 }}
                className={cn(
                  'flex aspect-[4/5] flex-col justify-between rounded-xl border border-[var(--color-border-light)] p-5 shadow-sm',
                  book.coverStyle,
                )}
              >
                <span className="w-fit rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-light-1)] px-2 py-1 text-[10px] font-bold uppercase text-[var(--color-primary-blue-6)]">
                  소장중인 책
                </span>
                <div>
                  <p className="font-serif text-3xl font-bold leading-none text-[var(--color-text-dark)]">{book.title}</p>
                  <p className="mt-2 text-sm font-bold text-[var(--color-text-medium)]">{book.author}</p>
                </div>
              </motion.div>

              <div className="mt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--color-text-dark)]">
                      <HighlightTitle title={book.title} color="var(--color-accent-gold-1)" height="50%" />
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-gray)]">{book.author}</p>
                  </div>
                  <span className={cn('shrink-0 px-2 py-1 text-xs font-bold', statusBadgeClasses[book.status])}>
                    {book.status}
                  </span>
                </div>

                <dl className="mt-5 space-y-3 border-t border-[var(--color-border-light)] pt-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2 text-[var(--color-text-light)]">
                      <BookOpen className="h-4 w-4" aria-hidden="true" />
                      컨디션
                    </dt>
                    <dd className="font-bold text-[var(--color-text-dark)]">{book.condition}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2 text-[var(--color-text-light)]">
                      <BookMarked className="h-4 w-4" aria-hidden="true" />
                      페이지
                    </dt>
                    <dd className="font-bold text-[var(--color-text-dark)]">{book.bookmark}</dd>
                  </div>
                </dl>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection({
  itemVariant,
  containerVariant,
}: {
  itemVariant: Variants;
  containerVariant: Variants;
}) {
  return (
    <section id="how-it-works" className={cn(snapSectionClasses, 'border-y border-[var(--color-border-light)] bg-[var(--color-bg-light-4)] py-14 md:py-16')}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={itemVariant}>
          <SectionHeading title="이웃에게 책을 빌려주세요." description="책장에서 잠자던 책이 다음 독자에게 닿는 과정입니다." />
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={containerVariant}
          className="relative mt-14 grid gap-5 md:grid-cols-4 md:gap-0"
        >
          <div className="absolute left-0 right-0 top-12 hidden border-t border-[var(--color-border)] md:block" />
          {steps.map((step) => (
            <motion.li key={step.number} variants={itemVariant} className="relative md:px-3">
              <article className={cn(panelClasses, panelHoverClasses, 'h-full p-5')}>
                <div className="mb-8 flex items-center justify-between">
                  <span className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-accent-gold-1)] px-3 py-2 font-serif text-3xl font-bold leading-none text-[var(--color-primary-blue-6)]">
                    {step.number}
                  </span>
                  <span className="h-4 w-4 rounded-full border border-[var(--color-border-light)] bg-[var(--color-primary-blue-3)]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--color-text-dark)]">{step.title}</h3>
                <p className="mt-4 leading-7 text-[var(--color-text-medium)]">{step.description}</p>
              </article>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

function TrustSection({
  itemVariant,
  containerVariant,
  reduceMotion,
}: {
  itemVariant: Variants;
  containerVariant: Variants;
  reduceMotion: boolean;
}) {
  return (
    <section id="trust" className={cn(snapSectionClasses, 'bg-[var(--color-primary-blue-6)] py-14 text-[var(--color-bg-light-1)] md:py-16')}>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={containerVariant}>
          <motion.p
            variants={itemVariant}
            className="mb-4 text-sm font-bold uppercase text-[var(--color-accent-gold-2)]"
          >
            Trustworthy Sharing
          </motion.p>
          <motion.h2 variants={itemVariant} className="font-serif text-4xl font-bold leading-tight md:text-5xl">
            대여는 더 투명하게.
          </motion.h2>
          <motion.p variants={itemVariant} className="mt-6 text-lg leading-8 text-[var(--color-bg-light-5)]">
            Shelfie는 이더리움 네트워크에서 작동하는 스마트 컨트랙트를 활용해 대여 요청, 진행, 반납 상태를 신뢰할 수 있게 관리합니다.<br/>
            복잡한 기술은 우리가 할게요. 간편하고 안전한 책 공유만 경험하세요.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={containerVariant}
          className="grid gap-4"
        >
          {trustItems.map((item) => (
            <motion.article
              key={item.title}
              variants={itemVariant}
              whileHover={reduceMotion ? {} : { y: -4 }}
              className="rounded-2xl border border-[rgba(252,250,246,0.24)] bg-[rgba(252,250,246,0.07)] p-6 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[rgba(252,250,246,0.24)] bg-[rgba(239,209,135,0.16)] text-[var(--color-accent-gold-2)]">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[var(--color-accent-gold-2)]">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[var(--color-bg-light-5)]">{item.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function BottomCtaSection({
  itemVariant,
  reduceMotion,
}: {
  itemVariant: Variants;
  reduceMotion: boolean;
}) {
  return (
    <section
      id="start"
      className={cn(
        snapSectionClasses,
        'bg-[var(--color-bg-light-1)] px-4 py-16 sm:px-6 md:py-24 lg:px-8'
      )}
    >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={itemVariant}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-bg-light-3)] px-6 py-14 text-center md:px-12 md:py-16"
        >
          {/* inner editorial frame */}
          <div
            className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-[rgba(39,39,40,0.18)]"
            aria-hidden="true"
          />

          {/* subtle editorial background shapes */}
          <div
            className="pointer-events-none absolute -left-16 top-10 h-36 w-36 rounded-full border border-[rgba(39,39,40,0.18)] bg-[var(--color-accent-gold-1)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-16 bottom-8 h-44 w-44 rounded-full border border-[rgba(39,39,40,0.18)] bg-[var(--color-primary-blue-1)]/60"
            aria-hidden="true"
          />

          {/* small book-spine decoration */}
          <div
            className="pointer-events-none absolute left-8 bottom-8 hidden rotate-[-5deg] items-end gap-1 lg:flex"
            aria-hidden="true"
          >
            <div className="h-16 w-4 rounded-t-sm border border-[var(--color-border)] bg-[var(--color-primary-blue-6)]" />
            <div className="h-20 w-4 rounded-t-sm border border-[var(--color-border)] bg-[var(--color-accent-gold-3)]" />
            <div className="h-12 w-4 rounded-t-sm border border-[var(--color-border)] bg-[var(--color-bg-light-1)]" />
          </div>

          <div
            className="pointer-events-none absolute right-10 top-10 hidden h-20 w-14 rotate-[7deg] rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-light-1)] lg:block"
            aria-hidden="true"
          >
            <div className="mx-auto mt-3 h-1 w-7 bg-[var(--color-primary-blue-3)]" />
            <div className="mx-auto mt-2 h-1 w-5 bg-[var(--color-accent-gold-3)]" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-left">
          <div className="mb-7 flex w-fit items-center gap-2 border border-[var(--color-border)] bg-[var(--color-bg-light-1)] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-primary-blue-6)]">
            <LibraryBig className="h-4 w-4 text-[var(--color-accent-gold-4)]" aria-hidden="true" />
            Take Your Shelfie
          </div>

          <h2 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-[var(--color-primary-blue-6)] md:text-5xl lg:text-6xl">
            지금, 당신의 서재에서
            <br />{' '}
            <HighlightTitle
              title="잠자고 있는 책"
              color="var(--color-accent-gold-1)"
              height="50%"
              className="px-1"
              autoHighlight
              delay={reduceMotion ? 0 : 0.3}
              duration={reduceMotion ? 0 : 0.4}
            />
            을 깨워보세요.
          </h2>

          <p className="mt-6 md:ml-2 max-w-2xl text-lg leading-8 text-[var(--color-text-medium)]">
            Shelfie에서 깨어난 책은, 누군가의 다음 독서로 이어집니다.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row justify-end">
            <Link
              href={ROUTES.SIGNUP}
              className={cn(primaryButtonClasses, 'gap-2 px-6 py-4')}
            >
              Shelfie 시작하기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              href={ROUTES.SEARCH}
              className={cn(secondaryButtonClasses, 'px-6 py-4')}
            >
              대여 가능한 책 보기
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const wheelLockRef = useRef(false);
  const itemVariant = shouldReduceMotion ? noMotion : fadeUp;
  const containerVariant = shouldReduceMotion ? noStagger : staggerContainer;
  const reduceMotion = Boolean(shouldReduceMotion);
  const handlePresentationWheel = useCallback(
    (event: WheelEvent<HTMLElement>) => {
      const container = scrollContainerRef.current;

      if (!container || wheelLockRef.current || Math.abs(event.deltaY) < 18) {
        return;
      }

      const slides = Array.from(container.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement,
      );

      if (slides.length === 0) {
        return;
      }

      event.preventDefault();

      const currentTop = container.scrollTop;
      const currentIndex = slides.reduce((closestIndex, slide, index) => {
        const closestDistance = Math.abs(slides[closestIndex].offsetTop - currentTop);
        const slideDistance = Math.abs(slide.offsetTop - currentTop);
        return slideDistance < closestDistance ? index : closestIndex;
      }, 0);
      const nextIndex = Math.min(
        slides.length - 1,
        Math.max(0, currentIndex + (event.deltaY > 0 ? 1 : -1)),
      );

      if (nextIndex === currentIndex) {
        return;
      }

      wheelLockRef.current = true;
      container.scrollTo({
        top: slides[nextIndex].offsetTop,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, shouldReduceMotion ? 120 : 720);
    },
    [shouldReduceMotion],
  );

  return (
    <div className="h-screen overflow-hidden bg-[var(--color-bg-light-1)] text-[var(--color-text-dark)]">
      <PublicHeader />
      <main
        ref={scrollContainerRef}
        onWheel={handlePresentationWheel}
        className="h-[calc(100vh-73px)] overflow-y-auto overscroll-contain scroll-smooth snap-y snap-mandatory"
      >
        <HeroSection itemVariant={itemVariant} containerVariant={containerVariant} reduceMotion={reduceMotion} />
        <CoreFeaturesSection
          itemVariant={itemVariant}
          containerVariant={containerVariant}
          reduceMotion={reduceMotion}
        />
        <FeaturedBooksSection
          itemVariant={itemVariant}
          containerVariant={containerVariant}
          reduceMotion={reduceMotion}
        />
        <HowItWorksSection itemVariant={itemVariant} containerVariant={containerVariant} />
        <TrustSection itemVariant={itemVariant} containerVariant={containerVariant} reduceMotion={reduceMotion} />
        <BottomCtaSection itemVariant={itemVariant} reduceMotion={reduceMotion} />
        <section className="snap-start bg-[var(--color-bg-light-1)]">
          <AppFooter />
        </section>
      </main>
    </div>
  );
}
