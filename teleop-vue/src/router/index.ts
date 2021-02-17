import { createRouter, createWebHistory } from "vue-router";

import store from "../store";

import Home from "../views/Home.vue";

const dev = store.state.router.dev;
const operator = store.state.router.operator;

const routes: Array<any> = [
  {
    // TODO Check for auth
    path: dev.path,
    name: dev.name,
    component: Home,
    children: [
      {
        name: dev.childrens.dashboard.name,
        path: dev.childrens.dashboard.path
      },
      {
        name: dev.childrens.conference.name,
        path: dev.childrens.conference.path,
        //component: ConferenceView,
        props: true
      },
      {
        name: dev.childrens.map.name,
        path: dev.childrens.map.path
      }
    ]
  },
  {
    path: operator.path,
    name: operator.name
    //component: OperatorView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
