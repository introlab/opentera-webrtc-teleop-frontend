import { createRouter, createWebHistory, Router } from "vue-router";

import store from "../store";
import { getBasePath } from "@/config/location";

import { DevelopperView } from "@/views/DevelopperView";
import { ConferenceView } from "@/views/ConferenceView";
import { NotFoundView } from "@/views/NotFoundView";

const dev = store.state.router.dev;
const operator = store.state.router.operator;
const client = store.state.router.client;
const notFound = store.state.router.notFound;

const routes: Array<any> = [
  {
    // TODO Check for auth
    path: dev.path,
    name: dev.name,
    component: DevelopperView,
    props: (route: any) => ({
      name: route.query.name,
      password: route.query.pwd
    }),
    children: [
      {
        name: dev.childrens?.dashboard.name,
        path: dev.childrens?.dashboard.path
      },
      {
        name: dev.childrens?.conference.name,
        path: dev.childrens?.conference.path,
        component: ConferenceView,
        props: true
      },
      {
        name: dev.childrens?.map.name,
        path: dev.childrens?.map.path
      }
    ]
  },
  {
    path: operator.path,
    name: operator.name
    //component: OperatorView
  },
  {
    path: client.path,
    name: client.name
    //component: TODO
  },
  {
    path: notFound.path,
    name: notFound.name,
    component: NotFoundView
  }
];

export default function() : Router {
  return createRouter({
    history: createWebHistory(getBasePath()),
    routes
  })
};
