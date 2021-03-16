# teleop-vue

## Installation
```
npm install
```

## Development (with hot-reloads)
**Important:** Close all Nginx process running in background.

### Start nginx-dev reverse proxy
```
cd nginx-dev && ./start_nginx.sh & cd ..
```

### Start the signaling server
In the [opentera-webrtc-teleop](https://github.com/introlab/opentera-webrtc) repository:
```
cd signaling-server && python3 signaling_server.py --port 4040
```
You can change the port as you want, be sure to adjust the proxy_pass of the file [opentera-webrtc-teleop-frontend.conf](nginx-dev/opentera-webrtc-teleop-frontend.conf) according to your changes.

### Compiles and hot-reloads for development
```
npm run serve -- --port <port>
```

## Production
### Compiles and minifies for production
```
npm run build
```
This will create a `dist` folder where your static application will stand.

## Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
