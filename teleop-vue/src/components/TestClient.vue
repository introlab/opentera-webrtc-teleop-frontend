<template>
  <div class="TestClient">
      <h1>{{ msg }}</h1>
      <p>
          Testing...
      </p>
  </div>
</template>

<script>

import openteraWebrtcWebClient from "opentera-webrtc-web-client"

console.log(openteraWebrtcWebClient);

const SignalingServerConfiguration = {
    url: 'http://localhost:8080',
    name: 'TestClient.vue',
    data: {}, // Client custom data
    room: 'chat'
};

const DataChannelConfiguration = {};
const RtcConfiguration = { // See: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary
    iceServers: [
        {
          "urls": "stun:stun.l.google.com:19302"
        }
      ]
  };

console.log(DataChannelConfiguration)
console.log(RtcConfiguration)

export default {
  name: "TestClient",
  props: {
    msg: String
  }, 
  created: async function()  {
      console.log("Created");
      let logger = (...args) => console.log(...args);
      
      this.client = new openteraWebrtcWebClient.DataChannelClient(SignalingServerConfiguration, DataChannelConfiguration, RtcConfiguration, logger);
  
        await this.client.connect();
       
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>