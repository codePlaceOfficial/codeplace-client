import React, { useEffect } from 'react';
import FileExplorer from 'components/fileExplorer'
import FileTabs from "components/fileTabs"
import CodeEditor from "components/codeEditor"
import Terminal from "components/terminal"
import Layout from './Layout';
import { sandboxSocket } from "api/socket"
import  { setConnectState, setFiles } from "redux/reducer/sandbox"
import { useDispatch } from 'react-redux';
import virtualFileClient from 'common/virtualFileClient';
const virtualFileEvent = require("submodules/virtualFileEvent")

// 把tabs和Editor合起来
const EditorPanel = () => {
  return (<div>
    <FileTabs></FileTabs>
    <CodeEditor></CodeEditor>
  </div>)
}
function Sandbox() {
  const dispatch = useDispatch();

  useEffect(() => {
    sandboxSocket.on("connect", () => {
      dispatch(setConnectState({ connected: true }));
      // todo 改变状态
      sandboxSocket.on("virtualFileServerReady", () => {
        sandboxSocket.on("disconnect", () => {
          // todo 断线重连
          dispatch(setConnectState({ connected: false }));
        })

        virtualFileEvent.setEventEmiter((event) => {
          sandboxSocket.emit("clientFileEvent", event)
        }, virtualFileClient);

        sandboxSocket.on("serverFileEvent", (event) => {
          virtualFileEvent.clientDefaultExecEvent(event, virtualFileClient);
          // console.log(virtualFileClient.getVirtualFile())
          dispatch(setFiles({ files: virtualFileClient.getVirtualFile() }));
        })

        sandboxSocket.emit("virtualFileClientReady")
      })
    })

    return () => {
      dispatch(setFiles({ files: {} }));
    }
  }, [dispatch])

  return <Layout Sider={<FileExplorer />} Editor={<EditorPanel />} Terminal={<Terminal />} />
}

export default Sandbox;



