import type { SearchBookResult } from './types';

interface NaverBookApiResponse {
  title: string;
  link: string;
  image: string;
  author: string;
  discount: string;
  publisher: string;
  pubdate: string; // "20260306" 형식
  isbn: string; // "9791168333789" 형식
  description: string;
}

export const mapNaverBookToSearchResult = (item: NaverBookApiResponse): SearchBookResult => {
  // pubdate 포맷 변환: "20260306" → "2026-03-06"
  const pubdate = item.pubdate;
  const formattedDate =
    pubdate.length === 8 ? `${pubdate.substring(0, 4)}-${pubdate.substring(4, 6)}-${pubdate.substring(6, 8)}` : pubdate;

  return {
    isbn13: item.isbn,
    title: item.title,
    author: item.author,
    publisher: item.publisher,
    published_date: formattedDate,
    description: item.description,
    cover_image_url: item.image,
    source: 'naver',
    external_book_id: item.isbn,
    external_url: item.link,
  };
};

export const mapNaverSearchResponse = (
  response: { items: NaverBookApiResponse[] } & Record<string, any>,
): { items: SearchBookResult[]; total_count: number } => {
  return {
    items: response.items.map(mapNaverBookToSearchResult),
    total_count: response.total || 0,
  };
};
