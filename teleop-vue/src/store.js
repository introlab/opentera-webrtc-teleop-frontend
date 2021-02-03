export default {
    links: {
        dev: {
            name: "Dev",
            path: "/dev",
            childrens: {
                dashboard: {
                    name: "Dashboard",
                    path: this.dev.path + "/dashboard"
                },
                conference: {
                    name: "Conference",
                    path: this.dev.path + "/conference"
                },
                map: {
                    name: "Map",
                    path: this.dev.path + "/map"
                }
            }
        }
    }
}