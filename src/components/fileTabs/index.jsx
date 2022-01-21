import React, { useState, useEffect, useMemo } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DeleteIcon from './DeleteIcon';
import "./index.scss"

import { selectOpenFiles, closeFile, setWorkFile, selectWorkFile, selectFiles } from "redux/reducer/sandbox"
import { useDispatch, useSelector } from 'react-redux';
import _ from "loadsh"
import virtualFileClient from 'common/virtualFileClient';
export default function ScrollableTabsButtonForce() {
    const [value, setValue] = useState(0);
    // const [tabs, setTabs] = useState(null);
    const openFiles = useSelector(selectOpenFiles);
    const workFile = useSelector(selectWorkFile);
    const files = useSelector(selectFiles);
    const dispatch = useDispatch();

    const tabs = useMemo(() => {
        return openFiles.map(filePath => {
            let {targetObj} = virtualFileClient.__getFileObjByPath(filePath,files);
            return {__path:targetObj.__path,name:targetObj.name}
        });
    }, [files, openFiles])

    const handleChange = (event, newValue) => {
        dispatch(setWorkFile({ path: openFiles[newValue] }));
    };

    useEffect(() => {
        let index = _.indexOf(openFiles, workFile)
        setValue(index === -1 ? 0 : index);
    }, [workFile, openFiles])

    return (
        <div className='c_fileTabs_wrapper'>
            {tabs?.length > 0 ? <Box sx={{ maxWidth: 480, bgcolor: 'background.paper' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                >
                    {/* TODO 增加tab栈,删除一个就弹出上一个访问的tab，并且可以根据路径去搜索 */}
                    {tabs?.map(tab => {
                        return <Tab key={tab.__path} icon={<DeleteIcon onDelete={
                            () => { dispatch(closeFile({ path: tab.__path })); setValue(0) }
                        } />} iconPosition="end" label={tab.name} />
                    })}
                </Tabs>
            </Box> : ""}
        </div>


    );
}
