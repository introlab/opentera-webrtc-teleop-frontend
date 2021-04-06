# teleop-vue

**Note:** The following instructions were performed on Ubuntu 20.04. The project will work regardless of your OS, you may want to ignore some instructions or adapt to suit your OS.

## Prerequisite 
* NodeJs (v10.19.0) and NPM (6.14.4)
```bash
sudo apt install nodejs
```
* NGinx (nginx version: nginx/1.18.0 (Ubuntu))
```bash
sudo apt install nginx
```
* Python 3.8 or higher
---
## Installation
```bash
git clone https://github.com/introlab/opentera-webrtc-teleop-frontend.git
```
```bash
cd opentera-webrtc-teleop-frontend && git submodule upgrade --init --recursive
```
```bash
cd teleop-vue && npm install
```

## Development (with hot-reloads)
**Important:** Close all Nginx process running in background.
You can visualize wich nginx process his currently running with the following:
```bash
sudo ps aux | grep nginx
```

### Start nginx-dev reverse proxy
Got to:
```bash
cd opentera-webrtc-teleop-frontend/teleop-vue/nginx-dev
```

The first time you are using the project make sure to give the permission to execute the script:
```bash
chmod +x start_nginx.sh
```
Start the script to lauch nginx in background:
```
./start_nginx.sh 
```

### Start the signaling server
For the following step it is recommand to use a Python virtual environement in order to not have complication with other global Python projects;

Create the environement:
```bash
python3 -m venv .venv
```
Activate the environnement:
```bash
source .venv/bin/activate
```

Deactivate the environement:
```bash
deactivate
```

You can clone the repository [opentera-webrtc](https://github.com/introlab/opentera-webrtc) or use the same repository in our submodule in order to avoid multiple instance of the same repository.

In a new terminal in the [opentera-webrtc](https://github.com/introlab/opentera-webrtc) repository (in submodule located as `opentera-webrtc-teleop-frontend/teleop-vue/submodules/opentera-webrtc`):
```bash
cd signaling-server && python3 -m pip install -r requirements.txt
```
```bash
python3 signaling_server.py --port 4040
```
You can change the port as you want, be sure to adjust the proxy_pass of the file [opentera-webrtc-teleop-frontend.conf](nginx-dev/opentera-webrtc-teleop-frontend.conf) according to your changes.

### Compiles and hot-reloads for development
```
npm run serve -- --port <port>
```
See the [Url Endpoints](#url-endpoint) section bellow for more informations on which Url you want to use in your browser.

## Production
### Compiles and minifies for production

** repertoire
```
npm run build
```
This will create a `dist` folder where your static application will stand.

## Docker
Recommand in order to easily test your application with the [opentera](https://github.com/introlab/opentera) and [opentera-teleop-service](https://github.com/introlab/opentera-teleop-service) environment.
### Mount your application as a volume
See this [Docker example](https://github.com/introlab/opentera-teleop-service/tree/main/docker/examples)

## Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Usage
### Url Endpoint
Several Url can be use in order to reach different interface here's a list with a short description:

| Path         | Description                                                    |
|--------------|----------------------------------------------------------------|
| /dev         | Present all widgets in order to easily visualize each of them. |
| /user        | Widgets: Video conference, teleoperation, map                  |
| /participant | Widgets: Video conference                                      |
| /device      | Widgets: Video conference                                      |

You can also add the following queries to your request:

| Query | Description                 |
|-------|-----------------------------|
| pwd   | Signaling server's password |
| name  | Name of the client          |

**Example:** `localhost:25000/dev?pwd=password123&name=Introlab`