// src/composables/ConferenceView/useButtons.js

import { onMounted } from "vue";

export default function(toolbarRef, overlayVideoRef) {
    let toolbar = null;
    let overlayVideo = null;
    let cursorIsMoving = null;
    let promise = null;
    const TIME_BUFF = 5000;

    const _initDOMRefs = () => {
        toolbar = toolbarRef.value;
        overlayVideo = overlayVideoRef.value;
    }

    const _getNewMovementPromise = () => {
        return new Promise(resolve => {
            cursorIsMoving = setTimeout(() => {
                cursorIsMoving = null;
                resolve();
            }, TIME_BUFF);
        });
    };

    const showButtons = () => {
        if (cursorIsMoving) {
            clearTimeout(cursorIsMoving);
        } else {
            toolbar.style.height = "var(--hovering-height)";
            overlayVideo.style.bottom = "var(--hovering-video-height)";
        }

        promise = _getNewMovementPromise();

        promise.then(() => {
            toolbar.style.height = "var(--default-height)";
            overlayVideo.style.bottom = "var(--default-video-height)";
        });
    }

    onMounted(_initDOMRefs);

    return {
        showButtons
    };
}