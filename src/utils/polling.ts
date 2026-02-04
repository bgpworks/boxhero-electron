/**
 * 조건이 충족될 때까지 폴링하는 유틸리티
 *
 * @example
 * // 기본 사용
 * const webview = await pollUntil(() => window.webviewContents);
 *
 * // 옵션과 함께 사용
 * const result = await pollUntil(() => getData(), {
 *   interval: 200,
 *   timeout: 5000,
 * });
 *
 * // 타임아웃 처리
 * const result = await pollUntil(() => getData()).catch(() => null);
 */

export class PollingTimeoutError extends Error {
  constructor(message = "Polling timed out") {
    super(message);
    this.name = "PollingTimeoutError";
  }
}

export interface PollOptions {
  /**
   * 폴링 간격 (ms)
   * @default 100
   */
  interval?: number;

  /**
   * 전체 타임아웃 (ms). 이 시간이 지나면 PollingTimeoutError 발생
   * @default 3000
   */
  timeout?: number;

  /**
   * 취소 신호. AbortController와 함께 사용
   */
  signal?: AbortSignal;
}

const DEFAULT_INTERVAL = 100;
const DEFAULT_TIMEOUT = 3000;

/**
 * 조건 함수가 truthy 값을 반환할 때까지 폴링
 *
 * @param condition - truthy 값을 반환하면 폴링 종료
 * @param options - 폴링 옵션
 * @returns condition이 반환한 truthy 값
 * @throws {PollingTimeoutError} 타임아웃 시
 * @throws {Error} AbortSignal로 취소 시 "Polling aborted"
 */
export function pollUntil<T>(
  condition: () => T | null | undefined,
  options: PollOptions = {}
): Promise<NonNullable<T>> {
  const {
    interval = DEFAULT_INTERVAL,
    timeout = DEFAULT_TIMEOUT,
    signal,
  } = options;

  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // AbortSignal 처리
    const onAbort = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      reject(new Error("Polling aborted"));
    };

    if (signal?.aborted) {
      reject(new Error("Polling aborted"));
      return;
    }

    signal?.addEventListener("abort", onAbort, { once: true });

    const cleanup = () => {
      signal?.removeEventListener("abort", onAbort);
    };

    const check = () => {
      // 타임아웃 체크
      if (Date.now() - startTime >= timeout) {
        cleanup();
        reject(new PollingTimeoutError());
        return;
      }

      // 조건 체크
      try {
        const value = condition();
        if (value != null) {
          cleanup();
          resolve(value as NonNullable<T>);
          return;
        }
      } catch (error) {
        cleanup();
        reject(error);
        return;
      }

      // 다음 폴링 스케줄
      timeoutId = setTimeout(check, interval);
    };

    // 즉시 첫 번째 체크 실행
    check();
  });
}
