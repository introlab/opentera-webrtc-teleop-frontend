
const Links = {
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
        }
    })
}

export default Links;