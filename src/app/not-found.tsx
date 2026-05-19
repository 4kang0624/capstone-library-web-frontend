import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F9FAFB]">
      <h1 className="text-6xl font-bold text-[#3182F6]">404</h1>
      <p className="text-xl font-semibold text-[#191F28]">페이지를 찾을 수 없습니다</p>
      <p className="text-[#6B7684]">요청하신 페이지가 존재하지 않습니다</p>
      <Link
        href="/"
        className="bg-[#3182F6] text-white rounded-xl px-6 py-3 font-semibold hover:bg-[#2272E3] transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
