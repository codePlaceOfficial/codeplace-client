import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import React, { useState, useEffect } from 'react'

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
                label: "rename", handler: () => {
                    console.log("rename", serveFile);
                },
            }, {
                label: "delete", handler: () => {
                    console.log("delete");
                },
            }]

            if (serveFile.type === "DIR") {
                items = ([{
                    label: "新建文件", handler: () => {
                        console.log("create file");
                    },
                }, {
                    label: "新建文件夹", handler: () => {
                        console.log("create dir");
                    },
                }, {
                    label: "上传文件", handler: () => {
                        console.log("upload file");
                    },
                }, ...items])
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
