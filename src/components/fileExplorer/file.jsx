import React, { useState, useContext } from 'react'
import { MenuContext, ListFile } from "./index";
import { openFile } from "redux/reducer/sandbox"
import { useDispatch } from 'react-redux';
import { eventEmitter } from "common/virtualFileClient"
import { FileIcon, DirIcon } from "components/fileIcon"

import arror from "resource/icons/arror.svg";

const virtualFileEvent = require("submodules/virtualFileEvent")

export default function File(props) {
    const { file } = props
    const [isOpen, setOpen] = useState(true);
    const { setMenu } = useContext(MenuContext);
    const isDir = file.type === "DIR" ? true : false;
    const dispatch = useDispatch();
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
    >
        <div className="item">
            {isDir ?
                <img className='icon' style={{
                    width:"12px",
                    marginRight:"2px",
                    transform: isOpen ? `rotate(90deg)` : ""
                }} src={arror} alt="" />
                : ""}
            {isDir ? <DirIcon dirName={file.name} isOpen={isOpen} /> : <FileIcon fileType={file.fileType} />}

            {file.name}
        </div>

        {(isDir && isOpen === true) ? <ListFile fileList={file?.children}></ListFile> : ""}
    </div>
}
