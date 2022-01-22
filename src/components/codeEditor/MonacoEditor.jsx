import React, { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'

import { selectworkFilePath, setEditorContent, selectEditorContents, selectOpenFiles } from "redux/reducer/sandbox"
import { useSelector, useDispatch } from 'react-redux';
import virtualFileClient from 'common/virtualFileClient';
import _ from "loadsh"

const virtualFileEvent = require("submodules/virtualFileEvent")
export default function CodeEditor(props) {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const models = useRef({});
    const workFilePath = useSelector(selectworkFilePath);
    const dispatch = useDispatch();
    const editorContents = useSelector(selectEditorContents)

    useEffect(() => {
        editorRef.current = monaco.editor.create(editorContainerRef.current)
    }, [])

    useEffect(() => {
        editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
            virtualFileEvent.emitEvent(virtualFileEvent.generateEvent.setFileContentEvent(workFilePath, models.current[workFilePath].getValue()), virtualFileClient)
        })
    }, [workFilePath])

    const openFiles = useSelector(selectOpenFiles)

    useEffect(() => {
        _.forIn(editorContents, (data, path) => {
            if (models.current[path].getValue() !== data.content)
                data.content && models.current[path].setValue(data.content);
        })
    }, [editorContents])

    // 创建和修改model
    useEffect(() => {
        if (openFiles.length === 0) {
            editorRef.current.setModel(null);
        }
        openFiles.forEach(file => {
            if (!models.current[file.__path]) {
                // 新打开了文件
                let newModel = monaco.editor.createModel(file.content);
                models.current[file.__path] = newModel;
                // 监听model内容变化,将变化写入model中
                newModel.onDidChangeContent((event) => {
                    dispatch(setEditorContent({ path: file.__path, content: newModel.getValue() }))
                })
                editorRef.current.setModel(newModel);
            } else {
                if (file.content !== models.current[file.__path].getValue()){
                    dispatch(setEditorContent({ path: file.__path, content: file.content }))
                }
            }
        });
    }, [openFiles, dispatch])

    // 更换model
    useEffect(() => {
        editorRef.current.setModel(models.current[workFilePath])
    }, [workFilePath])

    return (
        <div ref={editorContainerRef} className="editor" style={{ height: "100%" }}>

        </div>
    );
}
