import { createSlice } from '@reduxjs/toolkit';
import virtualFileClient from 'common/virtualFileClient';
import _ from "loadsh"
export const slice = createSlice({
    name: 'sandbox',
    initialState: {
        sandboxState: "disconnect", // connected,disconnect
        files: {},
        // 打开的文件
        openFiles: [
            // path
        ],
        workFile: null, // 当前正在浏览的文件
        editorContents: {} // 编辑器中的值
    },
    reducers: {
        openFile: (state, actions) => {
            // temp
            state.workFile = actions.payload.path;
            if (_.indexOf(state.openFiles, actions.payload.path) === -1) {
                state.openFiles.push(actions.payload.path)
            }
        },
        closeFile: (state, actions) => {
            state.openFiles = state.openFiles.filter((path, index) => {
                return path !== actions.payload.path
            })
        },
        setSandboxState: (state, actions) => {
            state.sandboxState = actions.payload.state;
        },
        setFiles: (state, actions) => {
            state.files = _.clone(actions.payload.files)
        },
        setWorkFile: (state, actions) => {
            state.workFile = actions.payload.path
        },
        setEditorContent: (state, actions) => {
            // selector是根据===比较对象是否相同的,已有对象的话就不创建了,防止进入死循环
            if (!state.editorContents[actions.payload.path]) {
                state.editorContents[actions.payload.path] = { content: actions.payload.content };
            }else {
                if (state.editorContents[actions.payload.path].content !== actions.payload.content)
                    state.editorContents[actions.payload.path].content = actions.payload.content;
            }
            console.log(actions.payload);
            let { targetObj } = virtualFileClient.__getFileObjByPath(actions.payload.path);
            // 判断内容是否被修改过
            state.editorContents[actions.payload.path].isChange = actions.payload.content !== targetObj.content;
        }
    },
});

export const { openFile, closeFile, setSandboxState, setFiles, setWorkFile, setEditorContent } = slice.actions;

export const selectFiles = state => state.sandbox.files
export const selectOpenFiles = state => state.sandbox.openFiles
export const selectSandboxState = state => state.sandbox.sandboxState
export const selectWorkFile = state => state.sandbox.workFile
export const selectEditorContents = state => state.sandbox.editorContents

export default slice.reducer;
