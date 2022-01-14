import React from 'react'
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';



export default function Layout(props) {
    const { Sider, Editor, Terminal } = props;

    return (
        <SplitterLayout percentage primaryIndex={1} secondaryInitialSize={15}>
            {Sider}
            <SplitterLayout vertical percentage secondaryInitialSize={30}>
                {Editor}
                {Terminal}
            </SplitterLayout>
        </SplitterLayout>
    )
}
