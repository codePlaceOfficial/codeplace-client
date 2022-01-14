import React, { useState, useContext } from 'react'
import { MenuContext, ListFile } from "./index";
import { openFile } from "redux/reducer/virtualFile"
import { useDispatch } from 'react-redux';

export default function File(props) {
    const { file } = props
    const [open, setOpen] = useState(false);
    const { setMenu } = useContext(MenuContext);
    const isDir = file.type === "DIR" ? true : false;
    const dispatch = useDispatch();

    const click = (type, e) => {
        if (type === 0) {
            // 左键
            if (isDir) setOpen(!open);
            else {
                dispatch(openFile({path:file.__path, name:file.name}))
            }
        } else {
            // 右键
            setMenu({ position: { x: e.clientX, y: e.clientY }, serveFile: file })
        }
    }
    return <div className={isDir ? 'c_FileExplorer_dir' : "c_FileExplorer_file"}
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
        draggable="true"
        onDragOver={isDir ? (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (open || e.dataTransfer.getData("path") === file.__path) return;
            setOpen(true);
        } : null}
        onDragStart={e => {
            e.stopPropagation()
            e.dataTransfer.setData("path", file.__path)

        }}
        onDrop={isDir ? e => {
            e.preventDefault()
            e.stopPropagation()
            console.log(file.__path);
            console.log(e.dataTransfer.getData("path"))
        } : null}
    >
        {file.name}
        {(isDir && open === true) ? <ListFile fileList={file.children}></ListFile> : ""}
    </div>
}
