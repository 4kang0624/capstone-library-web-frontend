import type { UserStatus } from '@/types/enums';

export interface ChangeUserStatusRequest {
  status: UserStatus;
}
