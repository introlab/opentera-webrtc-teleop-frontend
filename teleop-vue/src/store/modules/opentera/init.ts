import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import {
  IceServer,
  RtcConfiguration,
  SignalingServerConfiguration,
  StreamConfiguration,
} from "./types";
import { getBasePath, getOrigin } from "@/config/location";
import { getSignalingServerURL } from "./utils";

export function initSignalingServerConfiguration(
  payload: SignalingServerConfiguration
): SignalingServerConfiguration {
  return {
    url: getSignalingServerURL() + "/socket.io",
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

export function initDataChannelConfiguration(): any {
  return {};
}

export async function initRtcConfiguration(
  password?: string
): Promise<RtcConfiguration> {
  return new Promise<RtcConfiguration>((resolve, reject) => {
    const url =
      process.env.NODE_ENV !== "production"
        ? getOrigin() + getBasePath() + "/iceservers.json"
        : getSignalingServerURL() + "/iceservers";
    console.log("Fetch ice servers from: ", url);
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
