import { Badge } from '@/components/ui/Badge';
import { RentalStatus, BookCopyCurrentStatus, ReadingStatus, RentalStatusLabel, ReadingStatusLabel, BookCopyCurrentStatusLabel } from '@/types/enums';

const rentalStatusVariant: Record<RentalStatus, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  [RentalStatus.REQUESTED]: 'info',
  [RentalStatus.APPROVED]: 'primary',
  [RentalStatus.REJECTED]: 'error',
  [RentalStatus.BORROWING]: 'warning',
  [RentalStatus.RETURNED]: 'success',
  [RentalStatus.COMPLETED]: 'success',
  [RentalStatus.CANCELLED]: 'default',
  [RentalStatus.DISPUTED]: 'error',
};

const copyStatusVariant: Record<BookCopyCurrentStatus, 'default' | 'success' | 'warning' | 'error'> = {
  [BookCopyCurrentStatus.AVAILABLE]: 'success',
  [BookCopyCurrentStatus.REQUESTED]: 'default',
  [BookCopyCurrentStatus.RENTED]: 'warning',
  [BookCopyCurrentStatus.UNAVAILABLE]: 'error',
};

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return <Badge variant={rentalStatusVariant[status] ?? 'default'}>{RentalStatusLabel[status] ?? status}</Badge>;
}

export function CopyStatusBadge({ status }: { status: BookCopyCurrentStatus }) {
  return <Badge variant={copyStatusVariant[status] ?? 'default'}>{BookCopyCurrentStatusLabel[status] ?? status}</Badge>;
}

export function ReadingStatusBadge({ status }: { status: ReadingStatus }) {
  const variantMap: Record<ReadingStatus, 'default' | 'primary' | 'success'> = {
    [ReadingStatus.READING]: 'primary',
    [ReadingStatus.COMPLETED]: 'success',
    [ReadingStatus.PAUSED]: 'default',
  };
  return <Badge variant={variantMap[status] ?? 'default'}>{ReadingStatusLabel[status] ?? status}</Badge>;
}
