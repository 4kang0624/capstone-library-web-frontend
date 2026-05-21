import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg-light-1">
      <h1 className="text-6xl font-bold text-primary-blue-3">404</h1>
      <p className="text-xl font-semibold text-text-dark">페이지를 찾을 수 없습니다</p>
      <p className="text-text-gray">요청하신 페이지가 존재하지 않습니다</p>
      <Link
        href="/"
        className="bg-primary-blue-3 text-white rounded-xl px-6 py-3 font-semibold hover:bg-primary-blue-4 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
