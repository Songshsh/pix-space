import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

nprogress.configure({ showSpinner: false });

let progressTimer: ReturnType<typeof setTimeout> | undefined;
let progressStarted = false;

export function useNprogress() {
  const cancelProgressStart = () => {
    if (progressTimer) clearTimeout(progressTimer);
    progressTimer = undefined;
  };

  const queueProgressStart = () => {
    progressTimer = setTimeout(() => {
      progressStarted = true;
      nprogress.start();
    }, 200);
  };

  const done = () => {
    cancelProgressStart();
    if (progressStarted) nprogress.done();
    progressStarted = false;
  };

  const reset = () => {
    cancelProgressStart();
    progressStarted = false;
  };

  return {
    cancelProgressStart,
    queueProgressStart,
    done,
    reset,
  };
}
