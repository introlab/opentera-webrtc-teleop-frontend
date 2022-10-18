// src/views/ConferenceView/useToolbar.ts

import { onMounted, Ref } from "vue";

export default function(toolbarRef: Ref<HTMLDivElement>) {
  let toolbar: HTMLElement;
  let timeout: number | null = null;
  let promise;
  const TIME_BUFF = 5000;

  const _initDOMRefs = (): void => {
    toolbar = toolbarRef.value;
  };

  const _getNewPromise = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      timeout = setTimeout((): void => {
        timeout = null;
        resolve();
      }, TIME_BUFF);
    });
  };

  const showToolbar = (): void => {
    if (timeout) {
      clearTimeout(timeout);
    } else {
      toolbar.style.height = "var(--hovering-height)";
    }

    promise = _getNewPromise();
    promise.then((): void => {
      toolbar.style.height = "var(--default-height)";
    });
  };

  onMounted(_initDOMRefs);

  return {
    showToolbar,
  };
}
