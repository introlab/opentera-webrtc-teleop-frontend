import { createRouter, createWebHistory } from "vue-router";

import DeveloperView from "../views/DeveloperView";
import VideoConference from "../components/VideoConference";

const routes = [
  {
    // TODO Check for auth
    path: "/dev",
    name: "dev",
    component: DeveloperView,
    children: [
      {
        name: "Dashboard",
        path: "dashboard"
      },
      {
        name: "Conference",
        path: "conference",
        component: VideoConference,
        props: true
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
