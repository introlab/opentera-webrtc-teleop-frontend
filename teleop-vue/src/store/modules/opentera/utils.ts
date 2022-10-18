// src/store/modules/opentera/utils.ts

import { getBasePath, getOrigin } from "@/config/location";

export function fetchLocalStream(constraint?: MediaStreamConstraints) {
  return new Promise<MediaStream | undefined>((resolve) => {
    if (!constraint) constraint = { video: true, audio: true };

    navigator.mediaDevices
      .getUserMedia(constraint)
      .then((stream: MediaStream): void => resolve(stream))
      .catch((err: DOMException): void => {
        if(process.env.NODE_ENV != "production")
        {
          // eslint-disable-next-line no-console
          console.log(err);
        } 
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
    if (original[key as keyof T]) copyAttribute(copy, original, key as keyof T);
  }
}

export function getSignalingServerURL() {
  if (process.env.NODE_ENV !== "production")
    return getOrigin() + getBasePath() + "signaling";
  else return getOrigin() + getBasePath();
}

export interface PromiseState<T = undefined> extends Promise<T> {
  isPending?: Function;
}

export function makePromiseState<T>(
  promise: PromiseState<T>
): T | PromiseState<T> {
  if (promise.isPending) return promise;

  let isPending = true;

  const result: PromiseState<T> = promise.then(
    (value) => {
      isPending = false;
      return value;
    },
    (err) => {
      isPending = false;
      throw err;
    }
  );

  result.isPending = () => isPending;
  return result;
}
