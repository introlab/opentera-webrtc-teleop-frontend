// src/store/modules/router.ts

import router from "@/router";

export interface RouteRawConfig {
  [index: string]: any;
  path: string;
  name?: string;
  defaultPath?: string;
  childrens?: Record<string, RouteRawConfig>;
  meta?: any;
}

export type RouterState = Record<string, RouteRawConfig>;

const Router = {
  namespaced: true,
  state: (): RouterState => ({
    dev: {
      name: "Dev",
      path: "/dev",
      defaultPath: "/dev/dashboard",
      childrens: {
        dashboard: {
          path: "dashboard",
          meta: {
            name: "Dashboard",
          },
        },
        teleop: {
          path: "teleop",
          meta: {
            name: "Teleoperation",
          },
        },
      },
    },
    user: {
      name: "User",
      path: "/user",
      defaultPath: "/user/teleop",
      childrens: {
        teleop: {
          path: "teleop",
          meta: {
            name: "Teleoperation",
          },
        },
      },
    },
    participant: {
      name: "Participant",
      path: "/participant",
    },
    device: {
      name: "Device",
      path: "/device",
    },
    notFound: {
      name: "404",
      path: "/:catchAll(.*)",
    },
  }),

  getters: {
    getRoute: (state: RouterState) => (path: string) => {
      const splitPath = path.split(".");
      for (let i = 0; i < splitPath.length; i++) state = state[splitPath[i]];

      return state;
    },

    getSubRoutes: (state: RouterState, getters?: any) => (
      route: string,
      recursive?: boolean
    ) => {
      const obj: RouterState = getters.getRoute(route);

      if (obj && obj.childrens) {
        return Object.keys(obj.childrens).map((key) => {
          return {
            path: obj.path + "/" + obj.childrens[key].path,
            childrens: recursive
              ? getters.getSubRoutes(route + ".childrens." + key, true)
              : undefined,
            meta: obj.childrens[key].meta,
            params: {},
          };
        });
      }

      return undefined;
    },
  },
};

export default Router;
