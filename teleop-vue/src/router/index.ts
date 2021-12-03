import { createRouter, createWebHistory, createWebHashHistory, Router } from "vue-router";

import store from "../store";
import { getBasePath } from "@/config/location";

import { DevelopperView } from "@/views/DevelopperView";
import { UserView } from "@/views/UserView";
import { TeleopView } from "@/views/TeleopView";
import { NotFoundView } from "@/views/NotFoundView";

const dev = store.state.router.dev;
const user = store.state.router.user;
const participant = store.state.router.participant;
const device = store.state.router.device;
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
        path: "",
        component: TeleopView
      }
    ]
  },
  {
    path: user.path,
    name: user.name,
    component: UserView,
    props: (route: any) => ({
      name: route.query.name,
      password: route.query.pwd
    }),
    children: [
      {
        path: "",
        component: TeleopView
      }
    ]
  },
  {
    path: participant.path,
    name: participant.name,
    component: TeleopView,
    props: (route: any) => ({
      name: route.query.name,
      password: route.query.pwd
    })
  },
  {
    path: device.path,
    name: device.name,
    component: TeleopView,
    props: (route: any) => ({
      name: route.query.name,
      password: route.query.pwd
    })
  },
  {
    path: notFound.path,
    name: notFound.name,
    component: NotFoundView
  }
];

export default function() : Router {
  return createRouter({
    //history: createWebHistory(getBasePath()),
    //history: createWebHistory(),
    history: createWebHashHistory(),
    routes
  })
};
