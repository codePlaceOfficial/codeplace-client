import { createSlice,createSelector } from '@reduxjs/toolkit';
import virtualFileClient from 'common/virtualFileClient';
import _ from "loadsh"
export const slice = createSlice({
    name: 'sandbox',
    initialState: {
        sandboxState: "disconnect", // connected,disconnect
        files: {},
        // 打开的文件
        openFilesPath: [
            // path
        ],
        workFilePath: null, // 当前正在浏览的文件
        editorContents: {} // 编辑器中的值
    },
    reducers: {
        openFile: (state, actions) => {
            // temp
            state.workFilePath = actions.payload.path;
            if (_.indexOf(state.openFilesPath, actions.payload.path) === -1) {
                state.openFilesPath.push(actions.payload.path)
            }
        },
        closeFile: (state, actions) => {
            state.openFilesPath = state.openFilesPath.filter((path, index) => {
                return path !== actions.payload.path
            })
        },
        setSandboxState: (state, actions) => {
            state.sandboxState = actions.payload.state;
        },
        setFiles: (state, actions) => {
            state.files = _.clone(actions.payload.files)
        },
        setworkFilePath: (state, actions) => {
            state.workFilePath = actions.payload.path
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

export const { openFile, closeFile, setSandboxState, setFiles, setworkFilePath, setEditorContent } = slice.actions;

export const selectFiles = state => state.sandbox.files
export const selectOpenFilesPath = state => state.sandbox.openFilesPath
export const selectSandboxState = state => state.sandbox.sandboxState
export const selectworkFilePath = state => state.sandbox.workFilePath
export const selectEditorContents = state => state.sandbox.editorContents

export const selectOpenFiles = createSelector([selectFiles,selectOpenFilesPath],(files,openFilesPath) => {
    return openFilesPath.map(filePath => {
        let { targetObj } = virtualFileClient.__getFileObjByPath(filePath, files);
        return { __path: targetObj.__path,name:targetObj.name,content: targetObj.content }
    });
})

export default slice.reducer;
