import React, { useRef, useEffect, useMemo } from 'react'
import * as monaco from 'monaco-editor'

import { selectOpenFiles, selectWorkFile, setEditorContent, selectEditorContents, selectFiles } from "redux/reducer/sandbox"
import { useSelector, useDispatch } from 'react-redux';
import virtualFileClient from 'common/virtualFileClient';
import _ from "loadsh"

const virtualFileEvent = require("submodules/virtualFileEvent")
export default function CodeEditor(props) {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const models = useRef({});
    const openFiles = useSelector(selectOpenFiles);
    const workFile = useSelector(selectWorkFile);
    const dispatch = useDispatch();
    const editorContents = useSelector(selectEditorContents)
    const files = useSelector(selectFiles);

    useEffect(() => {
        editorRef.current = monaco.editor.create(editorContainerRef.current)
    }, [])

    useEffect(() => {
        editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
            console.log("======",workFile);
            virtualFileEvent.emitEvent(virtualFileEvent.generateEvent.setFileContentEvent(workFile,models.current[workFile].getValue()),virtualFileClient)
        })
    },[workFile])

    const openFilesRaw = useMemo(() => {
        return openFiles.map(filePath => {
            let { targetObj } = virtualFileClient.__getFileObjByPath(filePath, files);
            return { __path: targetObj.__path, content: targetObj.content }
        });
    }, [files, openFiles])

    useEffect(() => {
        _.forIn(editorContents, (data, path) => {
            if (models.current[path].getValue() !== data.content)
                data.content && models.current[path].setValue(data.content);
        })
    }, [editorContents])

    // 创建model
    useEffect(() => {
        if (openFilesRaw.length === 0) {
            editorRef.current.setModel(null);
        }
        // console.log(openFilesRaw);

        openFilesRaw.forEach(file => {
            if (!models.current[file.__path]) {
                // 新打开了文件
                let newModel = monaco.editor.createModel(file.content);
                models.current[file.__path] = newModel;
                dispatch(setEditorContent({ path: file.__path, content: file.content }))
                // 监听model内容变化,将变化写入model中
                newModel.onDidChangeContent((event) => {
                    dispatch(setEditorContent({ path: file.__path, content: newModel.getValue() }))
                })
                editorRef.current.setModel(newModel);
            }else{  
                dispatch(setEditorContent({ path: file.__path, content: file.content }))
            }
        });
    }, [openFilesRaw, dispatch])

    // 更换model
    useEffect(() => {
        editorRef.current.setModel(models.current[workFile])
    }, [workFile])

    return (
        <div ref={editorContainerRef} className="editor" style={{ height: "100%" }}>

        </div>
    );
}
