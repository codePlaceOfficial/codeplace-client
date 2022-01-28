import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState, useEffect } from 'react'
import { eventEmitter } from "common/virtualFileClient"

const virtualFileEvent = require("submodules/virtualFileEvent")
export default function FileMenu(props) {
    const { menuConfig } = props
    const [contextMenu, setContextMenu] = useState(null);
    const [menuItems, setmenuItems] = useState(null);

    useEffect(() => {
        if (!menuConfig) return;
        const { position, serveFile } = menuConfig
        if (position) {
            setContextMenu({
                mouseX: position?.x - 2,
                mouseY: position?.y - 4,
            });
        }
        if (serveFile) {
            let items = [{
                label: "重命名", handler: () => {
                    let newName = prompt("请输入名称");
                    eventEmitter.emitEvent(virtualFileEvent.generateEvent.renameFileEvent(serveFile.__path, newName))
                },
            }, {
                label: "删除", handler: () => {
                    eventEmitter.emitEvent(virtualFileEvent.generateEvent.deleteFileEvent(serveFile.__path))
                },
            }]

            if (serveFile.type === "DIR" || serveFile.type === "root") {
                let newItems = [{
                    label: "新建文件", handler: () => {
                        let name = prompt("请输入名称");
                        eventEmitter.emitEvent(virtualFileEvent.generateEvent.createFileEvent(serveFile.__path, name))
                    },
                }, {
                    label: "新建文件夹", handler: () => {
                        let name = prompt("请输入名称");
                        eventEmitter.emitEvent(virtualFileEvent.generateEvent.createDirEvent(serveFile.__path, name))
                    },
                }]
                if (serveFile.type === "DIR")
                    items = [...newItems, ...items]
                else items = newItems;
            }

            setmenuItems(items);
        }
    }, [menuConfig])

    const closeMenu = () => {
        setContextMenu(null);
    }

    const handleClose = () => {
        setContextMenu(null);
    };

    return (
        <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
            }
        >
            {menuItems?.map(item => {
                return <MenuItem key={item.label} onClick={() => { item.handler(); closeMenu() }}>{item.label}</MenuItem>
            })}
        </Menu>
    );
}
