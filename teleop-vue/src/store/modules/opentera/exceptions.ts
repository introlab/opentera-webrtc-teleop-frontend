// src/store/module/opentera/exceptions.ts

export class BusyException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BusyException.prototype);
  }
}
