import React, { useEffect, useMemo } from 'react';
import FileExplorer from 'components/fileExplorer'
import FileTabs from "components/fileTabs"
import Terminal from "components/terminal"
import Layout from './Layout';
import { sandboxSocket } from "api/socket"
import { setSandboxState, setFiles, selectOpenFilesPath, selectSandboxState, execFileEvent } from "redux/reducer/sandbox"
import { useDispatch, useSelector } from 'react-redux';
import CodeEditor from 'components/codeEditor';
import "./index.scss"
import logo from "resource/icons/logo.svg"


// 把tabs和Editor合起来
const EditorPanel = () => {
  const openFilesPath = useSelector(selectOpenFilesPath);
  const hasFilesOpened = useMemo(() => {
    return openFilesPath.length > 0;
  }, [openFilesPath])
  return (
    <div className='editorPanel'>
      {hasFilesOpened ?
        (
          <>
            <div className="editorPanel_tabs_wrapper">
              <FileTabs />
            </div>
            <div className="editorPanel_editor_wrapper">
              <CodeEditor></CodeEditor>
            </div>
          </>) :
        <div className="editorBackground">
          <img className='logo' src={logo} alt="" />
        </div>}
    </div>)
}
function Sandbox() {
  const dispatch = useDispatch();
  useEffect(() => {
    sandboxSocket.on("connect", () => {
      // todo 改变状态
      sandboxSocket.on("virtualFileServerReady", () => {
        sandboxSocket.on("disconnect", () => {
          // todo 断线重连
          dispatch(setSandboxState({ state: "disconnected" }));
        })

        // virtualFileEvent.setEventEmiter((event) => {
        //   sandboxSocket.emit("clientFileEvent", event)
        // }, virtualFileClient);

        // note 需要修改
        sandboxSocket.on("serverFileEvent", (event) => {
          dispatch(execFileEvent({ event }));
          // virtualFileEvent.clientDefaultExecEvent(event, virtualFileClient);
          // if(event.eventType !== virtualFileEvent.EVENT_TYPE.fileChange)
          //   dispatch(setFiles({ files: virtualFileClient.getVirtualFile() }));
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



