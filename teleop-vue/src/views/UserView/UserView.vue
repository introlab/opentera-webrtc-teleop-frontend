<template>
  <default-template
    brand="Opentera User Interface"
    route="user"
    v-bind:client="{
      name: name,
      data: data,
      room: room,
      password: password,
      robot: robot,
    }"
  />
</template>

<script>
import { DefaultTemplate } from "@/components/DefaultTemplate";
import { robotCapabilities } from "../robotCapabilities";

export default {
  name: "user-view",
  components: {
    DefaultTemplate,
  },
  props: {
    name: String,
    data: Object,
    room: String,
    password: String,
    robot: String,
  },
  provide() {
    return robotCapabilities(this.robot);
  },
};
</script>

<style>
@import "./UserView.scss";
</style>
