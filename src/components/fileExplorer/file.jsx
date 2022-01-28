import React, { useState, useContext } from 'react'
import { MenuContext, ListFile } from "./index";
import { openFile } from "redux/reducer/sandbox"
import { useDispatch } from 'react-redux';
import { eventEmitter } from "common/virtualFileClient"
import {FileIcon,DirIcon} from "components/fileIcon"

const virtualFileEvent = require("submodules/virtualFileEvent")

export default function File(props) {
    const { file } = props
    const [isOpen, setOpen] = useState(true);
    // const [isDragHover, setDragHover] = useState(false);
    const { setMenu } = useContext(MenuContext);
    const isDir = file.type === "DIR" ? true : false;
    const dispatch = useDispatch();
    // const dragOver = _.throttle((e) => {
    //     e.preventDefault()
    //     e.stopPropagation()
    //     console.log(e);
    //     setDragHover(true);
    //     if (e.dataTransfer.getData("path") === file.__path) return;
    //     setOpen(true);
    // },1000,{ 'trailing': false })

    const click = (type, e) => {
        if (type === 0) {
            // 左键
            if (isDir) setOpen(!isOpen);
            else {
                eventEmitter.emitEvent(virtualFileEvent.generateEvent.getFileContentEvent(file.__path))
                dispatch(openFile({ path: file.__path }))
            }
        } else {
            // 右键
            setMenu({ position: { x: e.clientX, y: e.clientY }, serveFile: file })
        }
    }
    return <div className={`${isDir ? "dir" : "file"}`}
        onClick={
            (e) => {
                e.stopPropagation();
                click(0, e)
            }
        }
        onContextMenu={e => {
            e.stopPropagation();
            e.preventDefault();
            click(1, e);
        }}

    // style={{
    //     marginLeft:isDir ? "50px" : "0px"
    // }}

    // draggable="true"
    // onDragOver={isDir ? dragOver : null}
    // onDragLeave={
    //     () => {
    //         setDragHover(false);
    //     }
    // }
    // onDragStart={e => {
    //     e.stopPropagation()
    //     e.dataTransfer.setData("path", file.__path)
    // }}
    // onDrop={isDir ? e => {
    //     e.preventDefault()
    //     e.stopPropagation()
    //     dragOver.cancel();
    //     setDragHover(false);
    // } : null}
    >
        <div className="item">
            {isDir ? <svg className="icon" style={{
                transform: isOpen ? `rotate(90deg)` : ""
            }} aria-hidden="true">
                <use xlinkHref="#icon-arror_r"></use>
            </svg> : ""}
            {/* <FileIcon name={isDir ? (isOpen ? "folder_opened" : "folder") : "file"} /> */}
            {isDir ? <DirIcon dirName={file.name} isOpen={isOpen}/> :<FileIcon fileType={file.fileType}  />}
            
            {file.name}
        </div>

        {(isDir && isOpen === true) ? <ListFile fileList={file?.children}></ListFile> : ""}
    </div>
}
