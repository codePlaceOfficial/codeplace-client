import React, { useEffect, useCallback } from 'react';
import FileExplorer from 'components/fileExplorer'
import FileTabs from "components/fileTabs"
import CodeEditor from "components/codeEditor"
import Terminal from "components/terminal"
import Layout from './Layout';
import { sandboxSocket } from "api/socket"
import { setSandboxState, setFiles, selectOpenFiles, selectSandboxState } from "redux/reducer/sandbox"
import { useDispatch, useSelector } from 'react-redux';
import virtualFileClient from 'common/virtualFileClient';
const virtualFileEvent = require("submodules/virtualFileEvent")
const _ = require("loadsh")
// 把tabs和Editor合起来
const EditorPanel = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <FileTabs></FileTabs>
      <CodeEditor></CodeEditor>
    </div>)
}
function Sandbox() {
  const dispatch = useDispatch();
  const openFiles = useSelector(selectOpenFiles);
  const sandboxState = useSelector(selectSandboxState);

  // 监听，只更改已打开文件的内容
  useEffect(
    () => {
      if (sandboxState === "ready") {
        virtualFileClient.subscribe(virtualFileEvent.EVENT_TYPE.fileChange, (data) => {
          if (_.indexOf(openFiles,data.virtualPath) !== -1) { // 如果改变的文件内容，在打开的文件之中，就更新
            virtualFileEvent.emitEvent(virtualFileEvent.generateEvent.getFileContentEvent(data.virtualPath), virtualFileClient);
          }
        })
      }
    }, [sandboxState, openFiles]
  )

  useEffect(() => {
    sandboxSocket.on("connect", () => {
      // todo 改变状态
      sandboxSocket.on("virtualFileServerReady", () => {
        sandboxSocket.on("disconnect", () => {
          // todo 断线重连
          dispatch(setSandboxState({ state: "disconnected" }));
        })

        virtualFileEvent.setEventEmiter((event) => {
          sandboxSocket.emit("clientFileEvent", event)
        }, virtualFileClient);

        sandboxSocket.on("serverFileEvent", (event) => {
          virtualFileEvent.clientDefaultExecEvent(event, virtualFileClient);
          dispatch(setFiles({ files: virtualFileClient.getVirtualFile() }));
        })
        // 初始化完毕
        dispatch(setSandboxState({ state: "ready" }));
        sandboxSocket.emit("virtualFileClientReady")
      })
    })

    return () => {
      dispatch(setFiles({ files: {} }));
      sandboxSocket.disconnect();
    }
  }, [dispatch])

  return <Layout Sider={<FileExplorer />} Editor={<EditorPanel />} Terminal={<Terminal />} />
}

export default Sandbox;



