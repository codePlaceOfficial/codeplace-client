import React from 'react';
import FileExplorer from 'components/fileExplorer'
import FileTabs from "components/fileTabs"
import CodeEditor from "components/codeEditor"
import Terminal from "../../components/terminal"
import Layout from './Layout';

// 把tabs和Editor合起来
const EditorPanel = () => {
  return (<div>
    <FileTabs></FileTabs>
    <CodeEditor></CodeEditor>
  </div>)
}

function Sandbox() {
  return <Layout Sider={<FileExplorer />} Editor={<EditorPanel />} Terminal={<Terminal />} />
}

export default Sandbox;




// // let terminal = React.createRef()
//   // React.useEffect(() => {
//   //   terminal.current.write("123312")
//   // },[])
//   // let onData = console.log
//   return (
//     <div className="App">
//       {/* <FileExplorer></FileExplorer> */}
//       {/* <FileTabs></FileTabs> */}
//       {/* <CodeEditor></CodeEditor> */}
//       {/* <Terminal ref={terminal} onData={onData}></Terminal> */}
//     </div>
//   );

