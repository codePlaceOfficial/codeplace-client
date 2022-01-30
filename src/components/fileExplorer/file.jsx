import React, { useState, useContext, useEffect } from 'react'
import { MenuContext, ListFile } from "./index";
import { openFile, selectWorkFilePath } from "redux/reducer/sandbox"
import { useDispatch, useSelector } from 'react-redux';
import { eventEmitter } from "common/virtualFileClient"
import { FileIcon, DirIcon } from "components/fileIcon"
import arror from "resource/icons/arror.svg";
import classNames from 'classnames';


const virtualFileEvent = require("submodules/virtualFileEvent")

export default function File(props) {
    const { file, deep } = props
    const [isOpen, setOpen] = useState(false);
    const { setMenu } = useContext(MenuContext);
    const isDir = file.type === "DIR" ? true : false;
    const dispatch = useDispatch();
    const workFilePath = useSelector(selectWorkFilePath);

    useEffect(() => {
        // 自动打开文件夹
        if(workFilePath?.startsWith(file.__path)){
            setOpen(true);
        }
    },[workFilePath,file])

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
        <div
            style={{ paddingLeft: `${deep * 15}px` }}
            className={classNames("item", { "active": file.__path === workFilePath })}
        >

            {isDir ?
                <img className='icon' style={{
                    width: "12px",
                    marginRight: "2px",
                    transform: isOpen ? `rotate(90deg)` : ""
                }} src={arror} alt="" />
                : ""}
            {isDir ? <DirIcon dirName={file.name} isOpen={isOpen} /> : <FileIcon fileType={file.fileType} />}
            <p>{file.name}</p>
        </div>

        {(isDir && isOpen === true) ? <ListFile fileList={file?.children} deep={deep + 1}></ListFile> : ""}
    </div>
}
