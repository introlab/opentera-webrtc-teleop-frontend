// src/store/modules/router.ts

const Router = {
  namespaced: true,
  state: () => ({
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
      path: "*"
    }
  })
};

export default Router;
