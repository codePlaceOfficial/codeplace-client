import React, { createRef, useEffect, useMemo, useImperativeHandle } from 'react'
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'
import {sandboxSocket} from "api/socket"

function WebTerminal(props, parentRef) {
    const terminal = createRef();
    const { onData } = props;
    let xterm = useMemo(() => new Terminal(), [])

    useEffect(() => {
        // 初始化xterm
        xterm.open(terminal.current);
        xterm.onData((data) => {
            sandboxSocket.emit("write",data);
        })
        sandboxSocket.on("data",(data) => {
            xterm.write(data);
        })
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