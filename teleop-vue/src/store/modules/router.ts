// src/store/modules/router.ts

export interface RouteRawConfig {
  path: string;
  name?: string;
  defaultPath?: string;
  childrens?: Record<string, RouteRawConfig>;
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
          name: "Dashboard",
          path: "dashboard"
        },
        conference: {
          name: "Conference",
          path: "conference"
        },
        map: {
          name: "Map",
          path: "map"
        }
      }
    },
    operator: {
      name: "Operator",
      path: "/operator"
    },
    client: {
      name: "Client",
      path: "/client"
    },
    notFound: {
      name: "404",
      path: "/:catchAll(.*)"
    }
  })
};

export default Router;
