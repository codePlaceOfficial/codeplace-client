import React from 'react'
import Editor from "./MonacoEditor"

import "./index.scss"
export default function index() {
    return (
        <div className='c_codeEditor_wrapper'>
            <Editor />
        </div>
    )
}
