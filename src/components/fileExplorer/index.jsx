import React, { useState } from 'react'
import "./index.scss"
import File from "./file"
import FileMenu from "./fileMenu"
import { useSelector } from 'react-redux';
import { selectFiles } from "redux/reducer/sandbox"

// todo 在最外层增加事件
const ListFile = (props) => {
    const { fileList } = props
    if (!fileList || fileList.length === 0) return null;
    return (
        fileList?.map(
            file => {
                return <File key={file.__path} file={file}></File>
            }
        )
    )
}
const MenuContext = React.createContext();
export default function Wrapper() {
    const files = useSelector(selectFiles);
    const [menuConfig, setMenu] = useState(null)
    return (
        <MenuContext.Provider value={{ setMenu }}>
            <div
                className='c_fileExplorer_wrapper'
                onContextMenu={(e) => {
                    e.preventDefault();
                    setMenu({ position: { x: e.clientX, y: e.clientY }, serveFile: {
                        type:"root",
                        __path:"/"
                    } })
                }}
            >
                <FileMenu menuConfig={menuConfig}></FileMenu>
                <ListFile fileList={files?.children}></ListFile>
            </div>
        </MenuContext.Provider>
    )
}

export { MenuContext, ListFile }