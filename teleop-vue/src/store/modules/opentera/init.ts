import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import {
  IceServer,
  RtcConfiguration,
  SignalingServerConfiguration,
  StreamConfiguration,
} from "./types";
import { getSignalingServerHttpURL, getSignalingServerWsURL } from "./utils";

export function initSignalingServerConfiguration(
  payload: SignalingServerConfiguration
): SignalingServerConfiguration {
  return {
    url: getSignalingServerWsURL(),
    name: payload.name,
    data: payload.data,
    room: payload.room,
    password: payload.password,
  };
}

export function initStreamConfiguration(
  localStream: MediaStream
): StreamConfiguration {
  return {
    localStream: localStream,
    isSendOnly: false,
  };
}

export function initDataChannelConfiguration() {
  return {};
}

export async function initRtcConfiguration(
  password?: string
): Promise<RtcConfiguration> {
  return new Promise<RtcConfiguration>((resolve, reject) => {
    const url = getSignalingServerHttpURL() + "/iceservers";
    openteraWebrtcWebClient.iceServers
      .fetchFromServer(url, password)
      .then((config: Array<IceServer>) =>
        resolve({
          iceServers: config,
        })
      )
      .catch((err: Error) => reject(err));
  });
}
