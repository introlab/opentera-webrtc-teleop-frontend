import { createRouter, createWebHistory, Router } from "vue-router";

import store from "../store";
import { getBasePath } from "@/config/location";

import { DevelopperView } from "@/views/DevelopperView";
import { ConferenceView } from "@/views/ConferenceView";
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
        component: ConferenceView
      },
      {
        path: dev.childrens?.teleop.path,
        component: TeleopView
      },
      {
        path: dev.childrens?.dashboard.path,
        component: NotFoundView // TODO
      },
      {
        path: dev.childrens?.conference.path,
        component: ConferenceView,
        props: true
      },
      {
        path: dev.childrens?.map.path,
        component: NotFoundView // TODO
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
        component: ConferenceView
      },
      {
        path: user.childrens?.teleop.path,
        component: TeleopView
      },
      {
        path: user.childrens?.conference.path,
        component: ConferenceView,
        props: true
      },
      {
        path: user.childrens?.map.path,
        component: NotFoundView // TODO
      }
    ]
  },
  {
    path: participant.path,
    name: participant.name,
    component: ConferenceView, // TODO
    props: (route: any) => ({
      name: route.query.name,
      password: route.query.pwd
    })
  },
  {
    path: device.path,
    name: device.name,
    component: ConferenceView, // TODO
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
    history: createWebHistory(getBasePath()),
    routes
  })
};
