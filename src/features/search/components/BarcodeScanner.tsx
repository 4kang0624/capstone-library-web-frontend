'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Type definitions for Quagga
interface QuaggaConfig {
  inputStream: {
    type: string;
    constraints: {
      width: number;
      height: number;
      facingMode: string;
    };
    target: HTMLElement;
  };
  locator?: {
    patchSize: string;
    halfSample: boolean;
  };
  numOfWorkers?: number;
  decoder: {
    readers: string[];
    debug: {
      showPattern: boolean;
      showCanvas: boolean;
      showLog: boolean;
    };
  };
}

interface CodeResult {
  codeResult?: {
    code: string;
  };
}

// ISBN 검증 함수
function isValidIsbn(code: string): boolean {
  // ISBN-13 (13자리, 978 또는 979로 시작)
  if (code.length === 13 && (code.startsWith('978') || code.startsWith('979'))) {
    return /^\d+$/.test(code);
  }
  // ISBN-10 (10자리, 보통 10자리 숫자)
  if (code.length === 10 && /^\d+$/.test(code)) {
    return true;
  }
  return false;
}

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (isbn: string) => void;
}

// Dynamic import to avoid SSR issues
let Quagga: any = null;

async function loadQuagga() {
  if (Quagga) return Quagga;
  Quagga = (await import('@ericblade/quagga2')).default;
  return Quagga;
}

export function BarcodeScanner({ open, onClose, onScan }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);
  const detectedCodesRef = useRef<Map<string, number>>(new Map());
  const detectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open || !videoRef.current) return;

    const startScanning = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setScanned(false);
        detectedCodesRef.current.clear();

        const QuaggaLib = await loadQuagga();

        await QuaggaLib.init(
          {
            inputStream: {
              type: 'LiveStream',
              constraints: {
                width: 1280,
                height: 960,
                facingMode: 'environment',
              },
              target: videoRef.current,
            },
            locator: {
              patchSize: 'medium',
              halfSample: true,
            },
            numOfWorkers: 2,
            decoder: {
              readers: [
                'ean_reader',
                'ean_8_reader',
              ],
              debug: {
                showPattern: false,
                showCanvas: false,
                showLog: false,
              },
            },
          } as QuaggaConfig,
          (err: Error | null) => {
            if (err) {
              setError('카메라에 접근할 수 없습니다. 권한을 확인해주세요.');
              console.error('Quagga initialization error:', err);
              setIsLoading(false);
              return;
            }
            QuaggaLib.start();
            setIsLoading(false);
          }
        );

        QuaggaLib.onDetected((result: CodeResult) => {
          if (result.codeResult?.code && !scanned) {
            const code = result.codeResult.code;
            
            // ISBN 형식 검증
            if (!isValidIsbn(code)) {
              console.log(`Invalid ISBN format: ${code}`);
              return;
            }

            const count = (detectedCodesRef.current.get(code) || 0) + 1;
            detectedCodesRef.current.set(code, count);

            console.log(`Detected ISBN: ${code} (count: ${count})`);

            // 같은 코드가 2번 이상 감지되거나 5개의 다른 코드가 감지되면 가장 많이 감지된 코드 사용
            if (count >= 2 || detectedCodesRef.current.size >= 5) {
              const bestCode = Array.from(detectedCodesRef.current.entries()).reduce((a, b) =>
                a[1] > b[1] ? a : b
              )[0];

              setScanned(true);
              onScan(bestCode);
              QuaggaLib.stop();
              onClose();
            }

            // 첫 감지 후 1.5초 내에 확인된 코드가 없으면 첫 감지 코드 사용
            if (detectionTimeoutRef.current) {
              clearTimeout(detectionTimeoutRef.current);
            }
            detectionTimeoutRef.current = setTimeout(() => {
              if (!scanned) {
                const bestCode = Array.from(detectedCodesRef.current.entries()).reduce((a, b) =>
                  a[1] > b[1] ? a : b
                )[0];
                setScanned(true);
                onScan(bestCode);
                QuaggaLib.stop();
                onClose();
              }
            }, 1500);
          }
        });
      } catch (err) {
        setError('바코드 스캐너 시작에 실패했습니다.');
        console.error('Barcode scanner error:', err);
        setIsLoading(false);
      }
    };

    startScanning();

    return () => {
      try {
        if (detectionTimeoutRef.current) {
          clearTimeout(detectionTimeoutRef.current);
        }
        if (Quagga) {
          Quagga.stop();
        }
      } catch (err) {
        console.error('Error stopping Quagga:', err);
      }
    };
  }, [open, onClose, onScan, scanned]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-bg-light-1 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="font-bold text-lg text-text-dark">바코드 스캔</h2>
          <button
            onClick={onClose}
            className="text-text-gray hover:text-text-dark transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative bg-black aspect-square overflow-hidden">
          <div
            ref={videoRef}
            className="w-full h-full"
            style={{ position: 'relative' }}
          />

          {/* Scanning Frame Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-80 h-48">
              <div className="absolute inset-0 border-2 border-primary-blue-3 rounded-lg"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-12 h-1 bg-primary-blue-3"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-12 h-1 bg-primary-blue-3"></div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-primary-blue-3" />
                <p className="text-white text-sm">초기화 중...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-900 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <p className="text-sm text-text-gray text-center mb-4">
            도서의 바코드를 카메라에 비춰주세요
          </p>
          <Button
            variant="outlined"
            onClick={onClose}
            fullWidth
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
