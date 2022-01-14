import React,{useRef,useState} from 'react'
import Editor, {  loader } from "@monaco-editor/react";
loader.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.31.1/min/vs"
    }
  });
export default function CodeEditor(props) {
    const editorRef = useRef(null);
    const {defaultContent,defaultLanguageType} = props
    const [editorContent,setEditorContent] = useState(defaultContent || "");
    const [languageType,setLanguageType] = useState(defaultLanguageType || "javascript");

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    return (
        <div className='c_codeEditor_wrapper' style={{"width":"500px"}}>
            <Editor
                height="90vh"
                language={languageType}
                onMount={handleEditorDidMount}
                value={editorContent}
            />
        </div>
    );
}
