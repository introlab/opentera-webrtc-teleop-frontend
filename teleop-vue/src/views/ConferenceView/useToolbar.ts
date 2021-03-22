// src/views/ConferenceView/useToolbar.ts

import { onMounted, Ref } from "vue";

export default function(toolbarRef: Ref<HTMLDivElement>, overlayVideoRef: Ref<HTMLVideoElement>) {
    let toolbar : any = null;
    let overlay : any = null;
    let timeout : any = null;
    let promise : any = null;
    const TIME_BUFF = 5000;

    const _initDOMRefs = () : void => {
        toolbar = toolbarRef.value;
        overlay = overlayVideoRef.value;
    };

    const _getNewPromise = () : Promise<void> => {
        return new Promise<void>(resolve => {
            timeout = setTimeout(() : void => {
                timeout = null;
                resolve();
            }, TIME_BUFF);
        });
    };

    const showToolbar = () : void => {
        if (timeout) {
            clearTimeout(timeout);
        } else {
            toolbar.style.height = "var(--hovering-height)";
            overlay.style.bottom = "var(--hovering-video-height)"
        }

        promise = _getNewPromise();
        promise.then(() : void => {
            toolbar.style.height = "var(--default-height)";
            overlay.style.bottom = "var(--default-height)";
        });
    };

    onMounted(_initDOMRefs);

    return {
        showToolbar
    }
}