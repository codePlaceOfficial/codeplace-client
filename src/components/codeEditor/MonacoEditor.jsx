import React, { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'

import { selectOpenFiles, selectWorkFile } from "redux/reducer/sandbox"
import { useSelector } from 'react-redux';
export default function CodeEditor(props) {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const models = useRef({});
    const openFiles = useSelector(selectOpenFiles);
    const workFile = useSelector(selectWorkFile);

    useEffect(() => {
        editorRef.current = monaco.editor.create(editorContainerRef.current)
        editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function () {
            console.log('SAVE pressed!')
        })
    }, [])


    // 创建model
    useEffect(() => {
        if(openFiles.length === 0){
            editorRef.current.setModel(null);
        }
        openFiles.forEach(file => {
            if (!models[file.__path]) {
                // 新打开了文件
                models.current[file.__path] = monaco.editor.createModel(file.content);
                editorRef.current.setModel(models.current[file.__path]);
            } else {
                if (models[file.__path].content !== file.content) {
                    // 更新内容
                    models[file.__path].content = file.content
                }
            }
        });
    }, [openFiles])

    // 更换model
    useEffect(() => {
        editorRef.current.setModel(models.current[workFile])
    }, [workFile])
    return (
        <div ref={editorContainerRef} className="editor" style={{ height: "100%" }}>

        </div>
    );
}
