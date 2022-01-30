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
import { eventEmitter } from "common/virtualFileClient"

const virtualFileEvent = require("submodules/virtualFileEvent")
const { EVENT_TYPE } = virtualFileEvent;

const _closeFile = (state, {path}) => {
    state.openFilesPath = state.openFilesPath.filter((openPath, index) => {
        return openPath !== path
    })
    if (state.workFilePath === path) {
        state.workFilePath = state.openFilesPath[0];
    }
}
const _deleteEditorContent = (state, {virtualPath}) => {
    if (!!state.editorContents[virtualPath]) {
        delete state.editorContents[virtualPath]
    }
}

export const slice = createSlice({
    name: 'sandbox',
    initialState: {
        sandboxState: "disconnect", // connected,disconnect
        files: {
            name:"",
            path:"/",
            children:[
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
                {name:Math.random() * 1000000, path:Math.random() * 1000000},
            ]
        },
        openFilesPath: [
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
        closeFile: (state,actions) => _closeFile(state,actions.payload),
        setSandboxState: (state, actions) => {
            state.sandboxState = actions.payload.state;
        },
        setFiles: (state, actions) => {
            state.files = _.clone(actions.payload.files)
        },
        setworkFilePath: (state, actions) => {
            state.workFilePath = actions.payload.path
        },
        deleteEditorContent: (state,actions) => _deleteEditorContent(state,actions.payload),
        setEditorContent: (state, actions) => {
            // selector是根据===比较对象是否相同的,已有对象的话就不创建了,防止进入死循环
            if (!state.editorContents[actions.payload.path]) {
                state.editorContents[actions.payload.path] = { content: actions.payload.content };
            } else {
                if (state.editorContents[actions.payload.path].content !== actions.payload.content)
                    state.editorContents[actions.payload.path].content = actions.payload.content;
            }
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
                    const oldPath = event.data.virtualPath;
                    const {newPath} = renameFile(event.data.virtualPath, event.data.newName, state.files)
                    state.openFilesPath.filter((path) => path !== oldPath);
                    state.openFilesPath = state.openFilesPath.map((path) => {
                        if(oldPath === path) return newPath;
                        return path;
                    })
                    if(state.editorContents[oldPath]){
                        state.editorContents[newPath].content = state.editorContents[oldPath].content;
                        delete state.editorContents[oldPath];
                    }
                    break;
                case EVENT_TYPE.deleteFile:
                    _closeFile(state, {path:event.data.virtualPath});
                    _deleteEditorContent(state, {virtualPath:event.data.virtualPath})
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
                    break;
                case EVENT_TYPE.fileChange:
                    if (_.indexOf(state.openFilesPath, event.data.virtualPath) !== -1) { // 如果改变的文件内容，在打开的文件之中，就更新
                        eventEmitter.emitEvent(virtualFileEvent.generateEvent.getFileContentEvent(event.data.virtualPath));
                    }
                    break;
                default:
                    break;
            }
        },
    }
});

export const { openFile, closeFile, setSandboxState, setFiles, setworkFilePath, setEditorContent, deleteEditorContent, execFileEvent } = slice.actions;
export const selectFiles = state => state.sandbox.files
export const selectOpenFilesPath = state => state.sandbox.openFilesPath
export const selectSandboxState = state => state.sandbox.sandboxState
export const selectWorkFilePath = state => state.sandbox.workFilePath
export const selectEditorContents = state => state.sandbox.editorContents

export const selectOpenFiles = createSelector([selectFiles, selectOpenFilesPath], (files, openFilesPath) => {
    let openFiles = [];
    for (let filePath of openFilesPath) {
        let { targetObj } = getVirtualFileByPath(filePath, files);
        if (targetObj) {
            openFiles.push({ ...targetObj});
        }
    }

    return openFiles;
})

export default slice.reducer;
