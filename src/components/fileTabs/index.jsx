import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Tab } from "./tabs"
import "./index.scss"

import { selectOpenFilesPath, closeFile, setworkFilePath, selectworkFilePath, selectOpenFiles } from "redux/reducer/sandbox"
import { useDispatch, useSelector } from 'react-redux';
import _ from "loadsh"

export default function ScrollableTabsButtonForce() {
    const [value, setValue] = useState(0);
    // const [tabs, setTabs] = useState(null);
    const openFilesPath = useSelector(selectOpenFilesPath);
    const workFilePath = useSelector(selectworkFilePath);
    const openFiles = useSelector(selectOpenFiles)
    const dispatch = useDispatch();

    const tabs = useMemo(() => {
        return openFiles.map((file) => {
            return { __path: file.__path, name: file.name };
        })
    }, [openFiles])


    useEffect(() => {
        let index = _.indexOf(openFilesPath, workFilePath)
        setValue(index === -1 ? 0 : index);
        console.log("===",index);

    }, [workFilePath, openFilesPath])

    const handleChange = (newValue) => {
        console.log(newValue);
        dispatch(setworkFilePath({ path: openFilesPath[newValue] }));
    }
    return (
        // <div className='c_fileTabs_wrapper'>
        //     {tabs?.length > 0 ? <Box sx={{ maxWidth: 480, bgcolor: 'background.paper' }}>
        //         <Tabs
        //             value={value}
        //             onChange={handleChange}
        //             variant="scrollable"
        //             scrollButtons="auto"
        //             allowScrollButtonsMobile
        //             aria-label="scrollable force tabs example"
        //         >
        //             {/* TODO 增加tab栈,删除一个就弹出上一个访问的tab，并且可以根据路径去搜索 */}
        //             {tabs?.map(tab => {
        //                 return <Tab key={tab.__path} icon={<DeleteIcon onDelete={
        //                     () => { dispatch(closeFile({ path: tab.__path })); setValue(0) }
        //                 } />} iconPosition="end" label={tab.name} />
        //             })}
        //         </Tabs>
        //     </Box> : ""}
        // </div>
        <>

            <div className='c_fileTabs_wrapper'>
                    <Tabs
                        index={value}
                        onChange={handleChange}
                    >
                        {tabs?.map((tab, index) => {
                            return <Tab key={tab.__path} name={tab.name} onClose={
                                () => {
                                    dispatch(closeFile({ path: tab.__path }));
                                }
                            } />
                        })}
                    </Tabs>
            </div>
        </>
    );
}
