/**
 * @fileoverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

// const WebSocket = require("ws");
import { WebSocket } from "ws";
import ROSLIB from "roslib";
// const ROSLIB = require("roslib");
import { assign } from "object-assign";
// const assign = require("object-assign");
import { SocketAdapter } from "roslib/src/core/SocketAdapter";
const EventEmitter2 = require("eventemitter2").EventEmitter2;
const WorkerSocket = ROSLIB.WorkerSocket;
const socketAdapter = SocketAdapter;
const Service = ROSLIB.Service;
const ServiceRequest = ROSLIB.ServiceRequest;

const io = () => {
  alert("abort");
};

/**
 * Manages connection to the server and all interactions with ROS.
 *
 * Emits the following events:
 *  * 'error' - there was an error with ROS
 *  * 'connection' - connected to the WebSocket server
 *  * 'close' - disconnected to the WebSocket server
 *  * <topicName> - a message came from rosbridge with the given topic name
 *  * <serviceID> - a service response came from rosbridge with the given ID
 *
 * @constructor
 * @param options - possible keys include: <br>
 *   * url (optional) - (can be specified later with `connect`) the WebSocket URL for rosbridge or the node server url to connect using socket.io (if socket.io exists in the page) <br>
 *   * groovyCompatibility - don't use interfaces that changed after the last groovy release or rosbridge_suite and related tools (defaults to true)
 *   * transportLibrary (optional) - one of 'websocket', 'workersocket' (default), 'socket.io' or RTCPeerConnection instance controlling how the connection is created in `connect`.
 *   * transportOptions (optional) - the options to use use when creating a connection. Currently only used if `transportLibrary` is RTCPeerConnection.
 */
function Ros(options) {
  options = options || {};
  //   const that = this;
  this.socket = null;
  this.idCounter = 0;
  this.isConnected = false;
  this.transportLibrary = options.transportLibrary || "websocket";
  this.transportOptions = options.transportOptions || {};
  this._sendFunc = (msg) => {
    this.sendEncodedMessage(msg);
  };

  if (typeof options.groovyCompatibility === "undefined") {
    this.groovyCompatibility = true;
  } else {
    this.groovyCompatibility = options.groovyCompatibility;
  }

  // Sets unlimited event listeners.
  this.setMaxListeners(0);

  // begin by checking if a URL was given
  this.connect(options.url);
}

Ros.prototype.__proto__ = EventEmitter2.prototype;

/**
 * Connect to the specified WebSocket.
 *
 * @param url - WebSocket URL or RTCDataChannel label for Rosbridge
 */
Ros.prototype.connect = function(url) {
  if (this.transportLibrary === "socket.io") {
    this.socket = assign(
      io(url, { "force new connection": true }),
      socketAdapter(this)
    );
    this.socket.on("connect", this.socket.onopen);
    this.socket.on("data", this.socket.onmessage);
    this.socket.on("close", this.socket.onclose);
    this.socket.on("error", this.socket.onerror);
  } else if (this.transportLibrary.constructor.name === "RTCPeerConnection") {
    this.socket = assign(
      this.transportLibrary.createDataChannel(url, this.transportOptions),
      socketAdapter(this)
    );
  } else if (this.transportLibrary === "websocket") {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      const sock = new WebSocket(url);
      sock.binaryType = "arraybuffer";
      this.socket = assign(sock, socketAdapter(this));
    }
  } else if (this.transportLibrary === "workersocket") {
    this.socket = assign(new WorkerSocket(url), socketAdapter(this));
  } else if (this.transportLibrary.constructor.name === "DataChannelClient") {
    this.socket = assign(this.transportLibrary, socketAdapter(this));
    this.socket.onDataChannelOpen = () => {
      console.log("Machintruc");
      this.socket.onopen();
    };
    this.socket.onDataChannelClose = () => this.socket.onclose();
    this.socket.onDataChannelMessage = (id, name, data) => {
      this.socket.onmessage(data);
    };
    this.socket.onDataChannelError = () => this.socket.onerror();
    this.socket.send = this.socket.sendToAll;
  } else {
    throw "Unknown transportLibrary: " + this.transportLibrary.toString();
  }
};

/**
 * Disconnect from the WebSocket server.
 */
Ros.prototype.close = function() {
  if (this.socket) {
    this.socket.close();
  }
};

/**
 * Sends an authorization request to the server.
 *
 * @param mac - MAC (hash) string given by the trusted source.
 * @param client - IP of the client.
 * @param dest - IP of the destination.
 * @param rand - Random string given by the trusted source.
 * @param t - Time of the authorization request.
 * @param level - User level as a string given by the client.
 * @param end - End time of the client's session.
 */
Ros.prototype.authenticate = function(mac, client, dest, rand, t, level, end) {
  // create the request
  const auth = {
    op: "auth",
    mac: mac,
    client: client,
    dest: dest,
    rand: rand,
    t: t,
    level: level,
    end: end,
  };
  // send the request
  this.callOnConnection(auth);
};

Ros.prototype.sendEncodedMessage = function(messageEncoded) {
  let emitter = null;
  //   const that = this;
  if (this.transportLibrary === "socket.io") {
    emitter = (msg) => {
      this.socket.emit("operation", msg);
    };
  } else {
    emitter = (msg) => {
      this.socket.send(msg);
    };
  }

  if (!this.isConnected) {
    this.once("connection", () => {
      emitter(messageEncoded);
    });
  } else {
    emitter(messageEncoded);
  }
};

/**
 * Sends the message over the WebSocket, but queues the message up if not yet
 * connected.
 */
Ros.prototype.callOnConnection = function(message) {
  if (this.transportOptions.encoder) {
    this.transportOptions.encoder(message, this._sendFunc);
  } else {
    this._sendFunc(JSON.stringify(message));
  }
};

/**
 * Sends a set_level request to the server
 *
 * @param level - Status level (none, error, warning, info)
 * @param id - Optional: Operation ID to change status level on
 */
Ros.prototype.setStatusLevel = function(level, id) {
  const levelMsg = {
    op: "set_level",
    level: level,
    id: id,
  };

  this.callOnConnection(levelMsg);
};

/**
 * Retrieves Action Servers in ROS as an array of string
 *
 * @param callback function with params:
 *   * actionservers - Array of action server names
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getActionServers = function(callback, failedCallback) {
  const getActionServers = new Service({
    ros: this,
    name: "/rosapi/action_servers",
    serviceType: "rosapi/GetActionServers",
  });

  const request = new ServiceRequest({});
  if (typeof failedCallback === "function") {
    getActionServers.callService(
      request,
      function(result) {
        callback(result.action_servers);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    getActionServers.callService(request, function(result) {
      callback(result.action_servers);
    });
  }
};

/**
 * Retrieves list of topics in ROS as an array.
 *
 * @param callback function with params:
 *   * topics - Array of topic names
 *   * types - Array of message type names
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getTopics = function(callback, failedCallback) {
  const topicsClient = new Service({
    ros: this,
    name: "/rosapi/topics",
    serviceType: "rosapi/Topics",
  });

  const request = new ServiceRequest();
  if (typeof failedCallback === "function") {
    topicsClient.callService(
      request,
      function(result) {
        callback(result);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    topicsClient.callService(request, function(result) {
      callback(result);
    });
  }
};

/**
 * Retrieves Topics in ROS as an array as specific type
 *
 * @param topicType topic type to find
 * @param callback function with params:
 *   * topics - Array of topic names
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getTopicsForType = function(topicType, callback, failedCallback) {
  const topicsForTypeClient = new Service({
    ros: this,
    name: "/rosapi/topics_for_type",
    serviceType: "rosapi/TopicsForType",
  });

  const request = new ServiceRequest({
    type: topicType,
  });
  if (typeof failedCallback === "function") {
    topicsForTypeClient.callService(
      request,
      function(result) {
        callback(result.topics);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    topicsForTypeClient.callService(request, function(result) {
      callback(result.topics);
    });
  }
};

/**
 * Retrieves list of active service names in ROS.
 *
 * @param callback - function with the following params:
 *   * services - array of service names
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getServices = function(callback, failedCallback) {
  const servicesClient = new Service({
    ros: this,
    name: "/rosapi/services",
    serviceType: "rosapi/Services",
  });

  const request = new ServiceRequest();
  if (typeof failedCallback === "function") {
    servicesClient.callService(
      request,
      function(result) {
        callback(result.services);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    servicesClient.callService(request, function(result) {
      callback(result.services);
    });
  }
};

/**
 * Retrieves list of services in ROS as an array as specific type
 *
 * @param serviceType service type to find
 * @param callback function with params:
 *   * topics - Array of service names
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getServicesForType = function(
  serviceType,
  callback,
  failedCallback
) {
  const servicesForTypeClient = new Service({
    ros: this,
    name: "/rosapi/services_for_type",
    serviceType: "rosapi/ServicesForType",
  });

  const request = new ServiceRequest({
    type: serviceType,
  });
  if (typeof failedCallback === "function") {
    servicesForTypeClient.callService(
      request,
      function(result) {
        callback(result.services);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    servicesForTypeClient.callService(request, function(result) {
      callback(result.services);
    });
  }
};

/**
 * Retrieves a detail of ROS service request.
 *
 * @param service name of service:
 * @param callback - function with params:
 *   * type - String of the service type
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getServiceRequestDetails = function(
  type,
  callback,
  failedCallback
) {
  const serviceTypeClient = new Service({
    ros: this,
    name: "/rosapi/service_request_details",
    serviceType: "rosapi/ServiceRequestDetails",
  });
  const request = new ServiceRequest({
    type: type,
  });

  if (typeof failedCallback === "function") {
    serviceTypeClient.callService(
      request,
      function(result) {
        callback(result);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    serviceTypeClient.callService(request, function(result) {
      callback(result);
    });
  }
};

/**
 * Retrieves a detail of ROS service request.
 *
 * @param service name of service
 * @param callback - function with params:
 *   * type - String of the service type
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getServiceResponseDetails = function(
  type,
  callback,
  failedCallback
) {
  const serviceTypeClient = new Service({
    ros: this,
    name: "/rosapi/service_response_details",
    serviceType: "rosapi/ServiceResponseDetails",
  });
  const request = new ServiceRequest({
    type: type,
  });

  if (typeof failedCallback === "function") {
    serviceTypeClient.callService(
      request,
      function(result) {
        callback(result);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    serviceTypeClient.callService(request, function(result) {
      callback(result);
    });
  }
};

/**
 * Retrieves list of active node names in ROS.
 *
 * @param callback - function with the following params:
 *   * nodes - array of node names
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getNodes = function(callback, failedCallback) {
  const nodesClient = new Service({
    ros: this,
    name: "/rosapi/nodes",
    serviceType: "rosapi/Nodes",
  });

  const request = new ServiceRequest();
  if (typeof failedCallback === "function") {
    nodesClient.callService(
      request,
      function(result) {
        callback(result.nodes);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    nodesClient.callService(request, function(result) {
      callback(result.nodes);
    });
  }
};

/**
 * Retrieves list subscribed topics, publishing topics and services of a specific node
 *
 * @param node name of the node:
 * @param callback - function with params:
 *   * publications - array of published topic names
 *   * subscriptions - array of subscribed topic names
 *   * services - array of service names hosted
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getNodeDetails = function(node, callback, failedCallback) {
  const nodesClient = new Service({
    ros: this,
    name: "/rosapi/node_details",
    serviceType: "rosapi/NodeDetails",
  });

  const request = new ServiceRequest({
    node: node,
  });
  if (typeof failedCallback === "function") {
    nodesClient.callService(
      request,
      function(result) {
        callback(result.subscribing, result.publishing, result.services);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    nodesClient.callService(request, function(result) {
      callback(result);
    });
  }
};

/**
 * Retrieves list of param names from the ROS Parameter Server.
 *
 * @param callback function with params:
 *  * params - array of param names.
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getParams = function(callback, failedCallback) {
  const paramsClient = new Service({
    ros: this,
    name: "/rosapi/get_param_names",
    serviceType: "rosapi/GetParamNames",
  });
  const request = new ServiceRequest();
  if (typeof failedCallback === "function") {
    paramsClient.callService(
      request,
      function(result) {
        callback(result.names);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    paramsClient.callService(request, function(result) {
      callback(result.names);
    });
  }
};

/**
 * Retrieves a type of ROS topic.
 *
 * @param topic name of the topic:
 * @param callback - function with params:
 *   * type - String of the topic type
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getTopicType = function(topic, callback, failedCallback) {
  const topicTypeClient = new Service({
    ros: this,
    name: "/rosapi/topic_type",
    serviceType: "rosapi/TopicType",
  });
  const request = new ServiceRequest({
    topic: topic,
  });

  if (typeof failedCallback === "function") {
    topicTypeClient.callService(
      request,
      function(result) {
        callback(result.type);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    topicTypeClient.callService(request, function(result) {
      callback(result.type);
    });
  }
};

/**
 * Retrieves a type of ROS service.
 *
 * @param service name of service:
 * @param callback - function with params:
 *   * type - String of the service type
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getServiceType = function(service, callback, failedCallback) {
  const serviceTypeClient = new Service({
    ros: this,
    name: "/rosapi/service_type",
    serviceType: "rosapi/ServiceType",
  });
  const request = new ServiceRequest({
    service: service,
  });

  if (typeof failedCallback === "function") {
    serviceTypeClient.callService(
      request,
      function(result) {
        callback(result.type);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    serviceTypeClient.callService(request, function(result) {
      callback(result.type);
    });
  }
};

/**
 * Retrieves a detail of ROS message.
 *
 * @param message - String of a topic type
 * @param callback - function with params:
 *   * details - Array of the message detail
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Ros.prototype.getMessageDetails = function(message, callback, failedCallback) {
  const messageDetailClient = new Service({
    ros: this,
    name: "/rosapi/message_details",
    serviceType: "rosapi/MessageDetails",
  });
  const request = new ServiceRequest({
    type: message,
  });

  if (typeof failedCallback === "function") {
    messageDetailClient.callService(
      request,
      function(result) {
        callback(result.typedefs);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    messageDetailClient.callService(request, function(result) {
      callback(result.typedefs);
    });
  }
};

/**
 * Decode a typedefs into a dictionary like `rosmsg show foo/bar`
 *
 * @param defs - array of type_def dictionary
 */
Ros.prototype.decodeTypeDefs = function(defs) {
  //   const that = this;

  // calls itself recursively to resolve type definition using hints.
  const decodeTypeDefsRec = (theType, hints) => {
    const typeDefDict = {};
    for (let i = 0; i < theType.fieldnames.length; i++) {
      const arrayLen = theType.fieldarraylen[i];
      const fieldName = theType.fieldnames[i];
      const fieldType = theType.fieldtypes[i];
      if (fieldType.indexOf("/") === -1) {
        // check the fieldType includes '/' or not
        if (arrayLen === -1) {
          typeDefDict[fieldName] = fieldType;
        } else {
          typeDefDict[fieldName] = [fieldType];
        }
      } else {
        // lookup the name
        let sub = false;
        for (let j = 0; j < hints.length; j++) {
          if (hints[j].type.toString() === fieldType.toString()) {
            sub = hints[j];
            break;
          }
        }
        if (sub) {
          const subResult = decodeTypeDefsRec(sub, hints);
          if (arrayLen === -1) {
            // Nothing
          } else {
            typeDefDict[fieldName] = [subResult];
          }
        } else {
          this.emit("error", "Cannot find " + fieldType + " in decodeTypeDefs");
        }
      }
    }
    return typeDefDict;
  };

  return decodeTypeDefsRec(defs[0], defs);
};

/**
 * Retrieves list of topics and their associated type definitions.
 *
 * @param callback function with params:
 *   * topics - Array of topic names
 *   * types - Array of message type names
 *   * typedefs_full_text - Array of full definitions of message types, similar to `gendeps --cat`
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 *
 */
Ros.prototype.getTopicsAndRawTypes = function(callback, failedCallback) {
  const topicsAndRawTypesClient = new Service({
    ros: this,
    name: "/rosapi/topics_and_raw_types",
    serviceType: "rosapi/TopicsAndRawTypes",
  });

  const request = new ServiceRequest();
  if (typeof failedCallback === "function") {
    topicsAndRawTypesClient.callService(
      request,
      function(result) {
        callback(result);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    topicsAndRawTypesClient.callService(request, function(result) {
      callback(result);
    });
  }
};

// module.exports = Ros;
export default Ros;
