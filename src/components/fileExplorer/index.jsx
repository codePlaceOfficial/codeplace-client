import React, { useState } from 'react'
import "./index.scss"
import File from "./file"
import FileMenu from "./fileMenu"


const mockFiles = {
    type: "DIR",
    name: "",
    __path: "/",
    children: [
        { type: "FILE", name: "file1.txt", __path: "/file1.txt" },
        { type: "FILE", name: "file2.txt", __path: "/file2.txt" },
        { type: "DIR", name: "dir1", __path: "/dir1", children: [] },
        {
            type: "DIR",
            name: "dir2",
            __path: "/dir2",
            children: [
                {
                    type: "FILE",
                    name: "file3.txt",
                    __path: "/dir2/file3.txt",
                },

                {
                    type: "DIR",
                    name: "dir2",
                    __path: "/dir2/dir2",
                    children: [
                        {
                            type: "FILE",
                            name: "file3.txt",
                            __path: "/dir2/dir2/file3.txt",
                        },
                    ],
                },
            ],
        },
        {
            type: "DIR",
            name: "dir3",
            __path: "/dir3",
            children: [
                {
                    type: "FILE",
                    name: "file4.txt",
                    __path: "/dir3/file4.txt",
                },
            ],
        },
    ],
}
/** 
* TODO
* 最外层增加drag事件
*/
const ListFile = (props) => {
    const { fileList } = props
    if (!fileList) return;
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
    const [files, setFiles] = useState(mockFiles)
    const [menuConfig, setMenu] = useState(null)
    return (
        <MenuContext.Provider value={{ setMenu }}>
            <div
                className='c_FileExplorer_wrapper'>
                <FileMenu menuConfig={menuConfig}></FileMenu>
                <ListFile fileList={files.children}></ListFile>
            </div>
        </MenuContext.Provider>
    )
}

export { MenuContext, ListFile }