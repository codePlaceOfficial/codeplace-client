import { sandboxSocket } from "api/socket"

const { VirtualFileClient } = require("submodules/virtualFileClient")
const virtualFileClient = new VirtualFileClient()
const virtualFileEvent = require("submodules/virtualFileEvent")
const { EventEmitter } = virtualFileEvent;

const eventEmitter = new EventEmitter((event) => {
    sandboxSocket.emit("clientFileEvent", event)
})
export default virtualFileClient

export { eventEmitter }