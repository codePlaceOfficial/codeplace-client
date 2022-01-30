import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Tab } from "./tabs"
import "./index.scss"

import { selectOpenFilesPath, closeFile, setworkFilePath, selectWorkFilePath, selectOpenFiles, selectEditorContents } from "redux/reducer/sandbox"
import { useDispatch, useSelector } from 'react-redux';
import _ from "loadsh"

export default function ScrollableTabsButtonForce() {
    const [value, setValue] = useState(0);
    // const [tabs, setTabs] = useState(null);
    const openFilesPath = useSelector(selectOpenFilesPath);
    const workFilePath = useSelector(selectWorkFilePath);
    const openFiles = useSelector(selectOpenFiles);
    const editorContents = useSelector(selectEditorContents)
    const dispatch = useDispatch();

    const tabs = useMemo(() => {
        return openFiles.map((file) => {
            return { __path: file.__path, fileType: file.fileType, name: file.name, isChange: editorContents[file.__path]?.content !== file.content};
        })
    }, [openFiles,editorContents])


    useEffect(() => {
        let index = _.indexOf(openFilesPath, workFilePath)
        setValue(index === -1 ? 0 : index);
    }, [workFilePath, openFilesPath])

    const handleChange = (newValue) => {
        dispatch(setworkFilePath({ path: openFilesPath[newValue] }));
    }
    return (
        <>

            <div className='c_fileTabs_wrapper'>
                <Tabs
                    index={value}
                    onChange={handleChange}
                >
                    {tabs?.map((tab, index) => {
                        return <Tab key={tab.__path} fileType={tab.fileType} name={tab.name} isChange={tab.isChange} onClose={
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
