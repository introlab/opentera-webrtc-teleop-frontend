// src/components/NavigationBar/useMicrophones.ts

import { ref } from "@vue/reactivity";
import { onMounted, onUnmounted } from "@vue/runtime-core";

export function useMicrophones() {
  const microphone = ref("");
  const microphones = ref<MediaDeviceInfo[]>([]);

  async function handler() {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const value = devices.filter((device) => device.kind == "audioinput");
      microphones.value = value;

      if (microphones.value.length > 0)
        microphone.value = microphones.value[0].deviceId;
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
    microphone,
    microphones,
  };
}
