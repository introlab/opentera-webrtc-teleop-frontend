/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "opentera-webrtc-web-client" {
  import openteraWebrtcWebClient from "opentera-webrtc-web-client";
  export default openteraWebrtcWebClient;
}