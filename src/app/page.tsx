'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Book, TrendingUp, Shield, Zap } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg hover:-translate-y-1 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold text-lg text-text-dark mb-2">{title}</h3>
      <p className="text-text-gray text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="text-center p-6">
      <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-primary/30">
        {step}
      </div>
      <h3 className="font-bold text-xl text-text-dark mb-3">{title}</h3>
      <p className="text-text-gray leading-relaxed">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.LIBRARY);
    }
  }, [isAuthenticated, router]);

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-8rem)]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-blue-3 via-primary-blue-2 to-primary-blue-1 text-white py-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Web3로 연결되는
                <br />
                새로운 독서 경험
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 font-medium">
                블록체인 기술로 안전하게 보호되는
                <br className="sm:hidden" /> P2P 도서 대여 플랫폼
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={ROUTES.SIGNUP}
                  className="px-10 py-4 bg-white text-primary rounded-2xl text-lg font-bold hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  시작하기
                </Link>
                <Link
                  href={ROUTES.SEARCH}
                  className="px-10 py-4 border-2 border-white text-white rounded-2xl text-lg font-bold hover:bg-white/15 hover:-translate-y-0.5 transition-all"
                >
                  도서 검색
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 text-text-dark">왜 BookChain인가요?</h2>
            <p className="text-center text-text-medium text-lg mb-16">안전하고 편리한 도서 대여의 모든 것</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<Book className="w-12 h-12 text-primary" />}
                title="디지털 서재 관리"
                description="소장 도서를 디지털로 관리하고 다른 사용자와 공유하세요"
              />
              <FeatureCard
                icon={<TrendingUp className="w-12 h-12 text-success" />}
                title="P2P 대여 시스템"
                description="중개자 없이 직접 도서를 대여하고 수익을 창출하세요"
              />
              <FeatureCard
                icon={<Shield className="w-12 h-12 text-purple" />}
                title="스마트 컨트랙트 에스크로"
                description="블록체인 기술로 보증금과 거래를 안전하게 보호합니다"
              />
              <FeatureCard
                icon={<Zap className="w-12 h-12 text-orange" />}
                title="빠른 거래"
                description="이더리움 테스트넷으로 빠르고 저렴한 거래를 경험하세요"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-bg-light-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 text-text-dark">이용 방법</h2>
            <p className="text-center text-text-medium text-lg mb-16">3단계로 시작하는 간편한 도서 대여</p>
            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                step="1"
                title="서재 등록"
                description="소장하고 있는 도서를 등록하고 대여 가능 상태로 설정하세요"
              />
              <StepCard
                step="2"
                title="도서 검색 & 대여"
                description="원하는 도서를 검색하고 대여 신청을 보내세요. 스마트 컨트랙트가 보증금을 관리합니다"
              />
              <StepCard
                step="3"
                title="안전한 거래"
                description="도서를 받고 반납하면 보증금이 자동으로 정산됩니다"
              />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}


