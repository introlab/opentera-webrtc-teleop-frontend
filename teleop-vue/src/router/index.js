import { createRouter, createWebHistory } from "vue-router";

import store from "../store";

import DeveloperView from "../views/DeveloperView";
import ConferenceView from "../views/ConferenceView";

const dev = store.state.links.dev;

const routes = [
  {
    // TODO Check for auth
    path: dev.path,
    name: dev.name,
    component: DeveloperView,
    children: [
      {
        name: dev.childrens.dashboard.name,
        path: dev.childrens.dashboard.path
      },
      {
        name: dev.childrens.conference.name,
        path: dev.childrens.conference.path,
        component: ConferenceView,
        props: true
      },
      {
        name: dev.childrens.map.name,
        path: dev.childrens.map.path
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
