import { computed, onMounted, Ref, watch } from "vue";
import { useStore } from "vuex";

export default function(overlayVideoRef: Ref<HTMLVideoElement>) {
  const store = useStore();

  // Setup local video
  const _initLocalVideo = () => {
    const overlayVideo = overlayVideoRef.value;
    overlayVideo.muted = true;
    overlayVideo.srcObject =
      store.state.localClient.openteraVideoConf.localStream;
    overlayVideo.autoplay = true;
    overlayVideo.style.display = "inline";
  };

  const stream = computed(() => {
    return store.state.localClient.openteraVideoConf.localStream;
  });
  watch(stream, _initLocalVideo);

  onMounted(_initLocalVideo);

  return {};
}
