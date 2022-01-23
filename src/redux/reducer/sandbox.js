import { createSlice, createSelector } from '@reduxjs/toolkit';
import _ from "loadsh"
import {
    setFileContent,
    createDir,
    createFile,
    changeFileContent,
    renameFile,
    moveFile,
    deleteFile,
    getVirtualFileByPath
} from "submodules/virtualFileClient"

const virtualFileEvent = require("submodules/virtualFileEvent")
const {EVENT_TYPE} = virtualFileEvent;

const _closeFile = (state, actions) => {
    state.openFilesPath = state.openFilesPath.filter((path, index) => {
        return path !== actions.payload.path
    })
    if (state.workFilePath === actions.payload.path) {
        state.workFilePath = null;
    }
}
const _deleteEditorContent = (state, actions) => {
    let virtualPath = actions.payload.virtualPath;
    if (!!state.editorContents[virtualPath]) {
        delete state.editorContents[virtualPath]
    }
}

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
        closeFile:_closeFile,
        setSandboxState: (state, actions) => {
            state.sandboxState = actions.payload.state;
        },
        setFiles: (state, actions) => {
            state.files = _.clone(actions.payload.files)
        },
        setworkFilePath: (state, actions) => {
            state.workFilePath = actions.payload.path
        },
        deleteEditorContent:_deleteEditorContent,
        setEditorContent: (state, actions) => {
            // selector是根据===比较对象是否相同的,已有对象的话就不创建了,防止进入死循环
            if (!state.editorContents[actions.payload.path]) {
                state.editorContents[actions.payload.path] = { content: actions.payload.content };
            } else {
                if (state.editorContents[actions.payload.path].content !== actions.payload.content)
                    state.editorContents[actions.payload.path].content = actions.payload.content;
            }
            let { targetObj } = getVirtualFileByPath(actions.payload.path, state.files);
            // 判断内容是否被修改过
            state.editorContents[actions.payload.path].isChange = actions.payload.content !== targetObj.content;
        },
        execFileEvent: (state, actions) => {
            const { event } = actions.payload;
            switch (event.eventType) {
                case EVENT_TYPE.createDir:
                    createDir(event.data.virtualPath, event.data.dirName, state.files)
                    break;
                case EVENT_TYPE.createFile:
                    createFile(event.data.virtualPath, event.data.fileName, state.files)
                    break;
                case EVENT_TYPE.renameFile:
                    renameFile(event.data.virtualPath, event.data.newName, state.files)
                    break;
                case EVENT_TYPE.deleteFile:
                    _closeFile(state,actions);
                    _deleteEditorContent(state,actions)
                    deleteFile(event.data.virtualPath, state.files)
                    break;
                case EVENT_TYPE.moveFile:
                    moveFile(event.data.virtualPath, event.data.newPath, state.files)
                    break;
                case EVENT_TYPE.setFileContent:
                    changeFileContent(event.data.virtualPath, event.data.content, state.files)
                    break;
                case EVENT_TYPE.getFileContent:
                    setFileContent(event.data.virtualPath, event.data.data, state.files)
                    return;
                default:
                    break;
            }
        },
    }
});

export const { openFile, closeFile, setSandboxState, setFiles, setworkFilePath, setEditorContent, deleteEditorContent,execFileEvent } = slice.actions;
export const selectFiles = state => state.sandbox.files
export const selectOpenFilesPath = state => state.sandbox.openFilesPath
export const selectSandboxState = state => state.sandbox.sandboxState
export const selectworkFilePath = state => state.sandbox.workFilePath
export const selectEditorContents = state => state.sandbox.editorContents

export const selectOpenFiles = createSelector([selectFiles, selectOpenFilesPath], (files, openFilesPath) => {
    let openFiles = [];
    for (let filePath of openFilesPath) {
        let { targetObj } = getVirtualFileByPath(filePath, files);
        if (targetObj) {
            openFiles.push({ __path: targetObj.__path, name: targetObj.name, content: targetObj.content });
        }
    }

    return openFiles;
})

export default slice.reducer;
