import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DeleteIcon from './DeleteIcon';
import "./index.scss"

import { useSelector } from 'react-redux';
import { selectOpenFiles,closeFile } from "redux/reducer/virtualFile"
import { useDispatch } from 'react-redux';

export default function ScrollableTabsButtonForce() {
    const [value, setValue] = useState(0);
    // const [tabs, setTabs] = useState(null);
    const openFiles = useSelector(selectOpenFiles);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     setTabs(openFiles);
    // }, [openFiles])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className='c_fileTabs_wrapper'>
            {openFiles?.length > 0 ?  <Box sx={{ maxWidth: 480, bgcolor: 'background.paper' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                >
                    {/* TODO 增加tab栈,删除一个就弹出上一个访问的tab，并且可以根据路径去搜索 */}
                    {openFiles?.map(tab => {
                        return <Tab key={tab.path} icon={<DeleteIcon onDelete={
                            () => dispatch(closeFile({path:tab.path}))
                        } />} iconPosition="end" label={tab.name} />
                    })}
                </Tabs>
            </Box> : ""}    
        </div>


    );
}
