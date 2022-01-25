import React, { createRef, useEffect, useMemo, useImperativeHandle, useCallback } from 'react'
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'
import { sandboxSocket } from "api/socket"
import { FitAddon } from 'xterm-addon-fit';
import "./index.scss"
import _ from "loadsh"

const elementResizeDetectorMaker = require("element-resize-detector");
function WebTerminal(props, parentRef) {
    const terminal = createRef();
    const { onData } = props;
    const xterm = useMemo(() => new Terminal(
    ), [])
    const fitAddon = useMemo(() => new FitAddon(), [])
    const erd = useMemo(() => {
        return elementResizeDetectorMaker();
    }, [])
    useEffect(() => {
        xterm.loadAddon(fitAddon);
        // 初始化xterm
        xterm.open(terminal.current);
        xterm.terminalOptions = {

        }
        xterm.onData((data) => {
            sandboxSocket.emit("write", data);
        })
        // temp
        sandboxSocket.on("data", (data) => {
            xterm.write(data);
        })
        erd.listenTo(terminal.current, _.debounce((a, b) => {
            fitAddon.fit();
        }, 300))
        document.querySelector(".xterm-viewport").style.overflow = "hidden";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useImperativeHandle(parentRef, () => {
        return {
            write: xterm.write.bind(xterm)
        }
    }, [xterm]);

    useEffect(() => {
        if (onData) xterm.onData(onData);
    }, [xterm, onData])


    return (
        <div ref={terminal} className='c_terminal_wrapper'>

        </div>
    )
}

export default React.forwardRef(WebTerminal);