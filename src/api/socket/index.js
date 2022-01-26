import {io} from 'socket.io-client';
import config from "config/index";
const sandboxSocket = io(config.url, {path:"/sandbox"});
// temp
sandboxSocket.disconnect()
export {sandboxSocket}