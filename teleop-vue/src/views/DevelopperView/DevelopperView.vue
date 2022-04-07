<template>
  <default-template
    brand="Opentera User Interface"
    route="dev"
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
  name: "developper-view",
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
@import "./DevelopperView.scss";
</style>
