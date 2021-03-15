// src/store/modules/opentera/utils.ts

import openteraWebrtcWebClient from "opentera-webrtc-web-client";
import { getBasePath, getOrigin } from "@/config/location";

export function fetchLocalStream() {
    return new Promise<MediaStream | undefined>((resolve, reject) => {
      openteraWebrtcWebClient.devices.getDefaultStream()
        .then((stream : MediaStream): void => resolve(stream))
        .catch((err: DOMException): void => {
            alert("Can't access default media (Camera nor mic)");
            resolve(undefined);
        });
    });
}

export function copyAttribute<T, K extends keyof T>(obj1: T, obj2: T, key: K) {
    obj1[key] = obj2[key];
}
  
export function copyAttributes<T>(copy: T, original: T) {
    for (const key in original) {
        if(original[key as keyof T])
            copyAttribute(copy, original, key as keyof T);
    }
}

export function getSignalingServerURL() {
    if (process.env.NODE_ENV !== "production")
        return process.env.VUE_APP_SIGNALING_SERVER_URL
    else
        return getOrigin() + getBasePath();
}