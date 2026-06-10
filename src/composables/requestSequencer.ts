/**
 * 请求竞态控制器。
 * 防止快速连续发起的异步请求中，旧请求晚于新请求返回导致的状态错乱。
 *
 * 使用方式：
 * ```ts
 * const sequencer = useRequestSequencer();
 *
 * async function loadData() {
 *   const seq = sequencer.next();
 *   const result = await fetchData();
 *   if (seq !== sequencer.currentSeq) return; // 已被后续请求取代，丢弃结果
 *   // ... 使用 result
 * }
 * ```
 */
export function useRequestSequencer() {
  let seq = 0;

  return {
    /** 递增并返回当前请求序号 */
    next: () => ++seq,

    /** 当前最新的序号（供外部比较） */
    get currentSeq() {
      return seq;
    },

    /** 重置序号，通常在 logout 等全局清理场景调用 */
    reset: () => {
      seq = 0;
    },
  };
}
