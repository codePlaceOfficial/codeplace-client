import { createSlice } from '@reduxjs/toolkit';
import _ from "loadsh"
export const slice = createSlice({
    name: 'sandbox',
    initialState: {
        state: "disconnect", // connected,disconnect
        files:{},
        // 打开的文件
        openFiles: [
            // {path:,name:}
        ],
    },
    reducers: {
        openFile: (state, actions) => {
            state.openFiles = _.unionWith(state.openFiles,[actions.payload],(file1,file2) => file1.path === file2.path)
        },
        closeFile: (state, actions) => {
            state.openFiles = state.openFiles.filter((item, index) => {
                if (item.path !== actions.payload.path) return true;
                return false;
            })
        },
        setConnectState: (state, actions) => {
            if (actions.payload.connected) state.connect = "connection";
            else state.connect = "disconnect"
        },
        setFiles:(state,actions) => {
            // console.log(actions.payload.files)
            // console.log(_.clone(actions.payload.files))
            state.files = _.clone(actions.payload.files)
        },  
    },
});

export const { openFile, closeFile, setConnectState,setFiles } = slice.actions;

export const selectFiles = state => state.sandbox.files
export const selectOpenFiles = state => state.sandbox.openFiles
export const selectSandboxState = state => state.sandbox.state

// export const selectVirtualFileClient = state => state.sandbox.virtualFileClient
export default slice.reducer;
