// src/components/NavigationBar/useCameras.ts

import { ref } from "@vue/reactivity";
import { onMounted, onUnmounted } from "@vue/runtime-core";

export function useCameras() {
  const camera = ref("");
  const cameras = ref<MediaDeviceInfo[]>([]);

  async function handler() {
    //await navigator.mediaDevices.getUserMedia({ video: true });
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const value = devices.filter(device => device.kind == "videoinput");
      cameras.value = value;

      if (cameras.value.length > 0) camera.value = cameras.value[0].deviceId;
    });
  }

  onMounted(() => {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener("devicechange", handler);
      handler();
    }
  });

  onUnmounted(() => {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.removeEventListener("devicechange", handler);
    }
  });

  return {
    camera,
    cameras
  };
}
