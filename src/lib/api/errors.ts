import { ApiError } from '@/types/api-error';
import { AxiosError } from 'axios';

export function parseAxiosError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0;
    const body = error.response?.data;
    const detail = body?.detail;
    let message = 'An error occurred';

    if (typeof detail === 'string') {
      message = detail;
    } else if (Array.isArray(detail) && detail.length > 0) {
      message = detail.map((d: { msg: string }) => d.msg).join(', ');
    } else if (body?.message) {
      message = body.message;
    } else if (error.message) {
      message = error.message;
    }

    return new ApiError(status, message, body);
  }

  if (error instanceof ApiError) return error;

  return new ApiError(0, String(error));
}
