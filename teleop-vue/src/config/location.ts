// src/config/location.ts

import store from "@/store";

export function getBasePath(): string {
  const pathName: string = window.location.pathname;
  const basePath = pathName.substring(0, pathName.lastIndexOf("/"));

  const router = store.state.router;

  // Remove this application's routes from the base path used by vue-router
  for (const key in router) {
    if (router[key]) {
      const regex = new RegExp(router[key].path + ".*");

      if (regex.test(basePath)) {
        return basePath.replace(regex, "/");
      }
    }
  }

  return basePath ? basePath : process.env.BASE_URL;
}

export function getOrigin(): string {
  return new URL(window.location.toString()).origin;
}
