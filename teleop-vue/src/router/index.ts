import { createRouter, createWebHistory, Router } from "vue-router";

import store from "../store";

import { DevelopperView } from "@/views/DevelopperView";
import { ConferenceView } from "@/views/ConferenceView";

const dev = store.state.router.dev;
const operator = store.state.router.operator;

const routes: Array<any> = [
  {
    // TODO Check for auth
    path: dev.path,
    name: dev.name,
    component: DevelopperView,
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
  },
  {
    path: operator.path,
    name: operator.name
    //component: OperatorView
  }
];

export default function() : Router {

  const pathName: string = window.location.pathname;
  const basePath = pathName.substring(0,  pathName.lastIndexOf('/'));

  const router = store.state.router

  // Remove this application's routes from the base path used by vue-router 
  for (const key in router) {
    if (router[key]) {
      const regex = new RegExp(router[key].path + ".*");

      if (regex.test(basePath))
        return createRouter({
          history: createWebHistory(basePath.replace(regex, "/")),
          routes
        })
    }
  }

  return createRouter({
    history: createWebHistory(basePath ? basePath : process.env.BASE_URL),
    routes
  })
};
