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
            // {path:,name:}
        ],
        workFile:null // 当前正在浏览的文件
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
            state.openFiles = state.openFiles.filter((item, index) => {
                return item !== actions.payload.path
            })
        },
        setSandboxState: (state, actions) => {
            state.sandboxState = actions.payload.state;
        },
        setFiles: (state, actions) => {
            state.files = _.clone(actions.payload.files)
        },
        setWorkFile:(state,actions) => {
            state.workFile = actions.payload.path
        }
    },
});

export const { openFile, closeFile, setSandboxState, setFiles,setWorkFile } = slice.actions;

export const selectFiles = state => state.sandbox.files
export const selectOpenFiles = state => {
    return (state.sandbox.openFiles.map(item => {
        let {targetObj} = virtualFileClient.__getFileObjByPath(item,state.files);
        return targetObj;
    }))
}
export const selectSandboxState = state => state.sandbox.sandboxState
export const selectWorkFile = state => state.sandbox.workFile

// export const selectVirtualFileClient = state => state.sandbox.virtualFileClient
export default slice.reducer;
