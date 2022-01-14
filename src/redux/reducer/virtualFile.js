import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'virtualFile',
  initialState: {
    files:{
        type: "DIR",
        name: "",
        __path: "/",
        children: [
            { type: "FILE", name: "file1.txt", __path: "/file1.txt" },
            { type: "FILE", name: "file2.txt", __path: "/file2.txt" },
            { type: "DIR", name: "dir1", __path: "/dir1", children: [] },
            {
                type: "DIR",
                name: "dir2",
                __path: "/dir2",
                children: [
                    {
                        type: "FILE",
                        name: "file3.txt",
                        __path: "/dir2/file3.txt",
                    },
    
                    {
                        type: "DIR",
                        name: "dir2",
                        __path: "/dir2/dir2",
                        children: [
                            {
                                type: "FILE",
                                name: "file3.txt",
                                __path: "/dir2/dir2/file3.txt",
                            },
                        ],
                    },
                ],
            },
            {
                type: "DIR",
                name: "dir3",
                __path: "/dir3",
                children: [
                    {
                        type: "FILE",
                        name: "file4.txt",
                        __path: "/dir3/file4.txt",
                    },
                ],
            },
        ],
    },
    // 打开的文件
    openFiles:[
        // {path:,name:}
    ]
  },
  reducers: {
    openFile:(state,actions) => {
        state.openFiles.push(actions.payload);
    },
    closeFile:(state,actions) => {
        state.openFiles = state.openFiles.filter((item, index) => {
            if (item.path !== actions.payload.path) return true;
            return false;
        })
    }
  },
});

export const { openFile,closeFile } = slice.actions;

export const selectFiles = state => state.virtualFile.files
export const selectOpenFiles = state => state.virtualFile.openFiles

export default slice.reducer;
