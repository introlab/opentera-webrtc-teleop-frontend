// src/store/modules/router.ts

export interface RouteRawConfig {
  [index: string]: string | Function | { name: string } | RouteRawConfig | Record<string, RouteRawConfig> | undefined;
  path: string;
  name?: string;
  defaultPath?: string;
  childrens?: Record<string, RouteRawConfig>;
  meta?: { name: string };
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
      for (let i = 0; i < splitPath.length; i++) state = state[splitPath[i]] as Record<string, RouteRawConfig>;

      return state;
    },

    getSubRoutes: (state: RouterState, getters?: RouteRawConfig) => (
      route: string,
      recursive?: boolean
    ) => {
      const obj: RouterState = (getters?.getRoute as Function)(route); //a tres tester

      if (obj && obj.childrens) {
        return Object.keys(obj.childrens).map((key) => {
          return {
            path: obj.path + "/" + (obj.childrens[key] as RouteRawConfig).path,
            childrens: recursive
              ? (getters?.getSubRoutes as Function)(route + ".childrens." + key, true)
              : undefined,
            meta: (obj.childrens[key] as RouteRawConfig).meta,
            params: {},
          };
        });
      }

      return undefined;
    },
  },
};

export default Router;
