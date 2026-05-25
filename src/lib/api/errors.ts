import { ApiError } from '@/types/api-error';
import { AxiosError } from 'axios';

const FALLBACK_ERROR_MESSAGE = '알 수 없는 오류가 발생했습니다.';

function isMeaningfulMessage(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value !== '[object Object]';
}

function getNestedErrorMessage(error: unknown, depth = 0): string | undefined {
  if (depth > 3) return undefined;

  if (error instanceof Error && isMeaningfulMessage(error.message)) {
    return error.message;
  }

  if (isMeaningfulMessage(error)) return error;

  if (Array.isArray(error)) {
    const messages = error
      .map((item) => getNestedErrorMessage(item, depth + 1))
      .filter((message): message is string => !!message);
    return messages.length > 0 ? messages.join(', ') : undefined;
  }

  if (typeof error !== 'object' || error === null) return undefined;

  const record = error as Record<string, unknown>;
  return (
    getNestedErrorMessage(record.message, depth + 1) ??
    getNestedErrorMessage(record.reason, depth + 1) ??
    getNestedErrorMessage(record.detail, depth + 1) ??
    getNestedErrorMessage(record.data, depth + 1) ??
    getNestedErrorMessage(record.error, depth + 1) ??
    getNestedErrorMessage(record.cause, depth + 1)
  );
}

function getErrorMessage(error: unknown): string {
  const nestedMessage = getNestedErrorMessage(error);
  if (nestedMessage) return nestedMessage;

  if (typeof error === 'object' && error !== null) {
    try {
      return JSON.stringify(error);
    } catch {
      return FALLBACK_ERROR_MESSAGE;
    }
  }

  return isMeaningfulMessage(error) ? error : FALLBACK_ERROR_MESSAGE;
}

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
    } else if (detail) {
      message = getErrorMessage(detail);
    } else if (body?.message) {
      message = getErrorMessage(body.message);
    } else if (error.message) {
      message = getErrorMessage(error);
    }

    return new ApiError(status, message, body);
  }

  if (error instanceof ApiError) return error;

  return new ApiError(0, getErrorMessage(error));
}
