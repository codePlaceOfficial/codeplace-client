import React, { useState,useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DeleteIcon from './DeleteIcon';
import "./index.scss"

import { selectOpenFiles,closeFile,setWorkFile,selectWorkFile } from "redux/reducer/sandbox"
import { useDispatch,useSelector } from 'react-redux';
import _ from "loadsh"
export default function ScrollableTabsButtonForce() {
    const [value, setValue] = useState(0);
    // const [tabs, setTabs] = useState(null);
    const openFiles = useSelector(selectOpenFiles);
    const workFile = useSelector(selectWorkFile)
    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        console.log(newValue)
        console.log(openFiles[newValue].__path)
        dispatch(setWorkFile({path:openFiles[newValue].__path}));
    };

    useEffect(() => {
        let index = _.findIndex(openFiles,(file) => file.__path === workFile)
        setValue(index === -1 ? 0 : index);
    },[workFile,openFiles])

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
                        return <Tab key={tab.__path} icon={<DeleteIcon onDelete={
                            () => {dispatch(closeFile({path:tab.__path}));setValue(0)}
                        } />} iconPosition="end" label={tab.name} />
                    })}
                </Tabs>
            </Box> : ""}    
        </div>


    );
}
