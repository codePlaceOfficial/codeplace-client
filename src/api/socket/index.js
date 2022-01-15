import {io} from 'socket.io-client';
import config from "config/index";
let sandboxSocket = io(config.url, {path:"/sandbox"});

export {sandboxSocket}