import react, { useEffect, useState } from "react"
import DeleteIcon from './DeleteIcon';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import {FileIcon} from "../fileIcon"
const classNames = require('classnames');
export function Tabs(props) {
    const { children, index, onChange } = props;
    const [activeIndex, setActiveIndex] = useState(index);

    useEffect(() => {
        if (onChange)
            onChange(activeIndex)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex])

    useEffect(() => {
        setActiveIndex(index);
    }, [index])

    return (
        <OverlayScrollbarsComponent className="os-theme-light"
            options={{ scrollbars: { autoHide: "m" }, overflowBehavior: { y: "h" }, clipAlways: false }}
            style={{height:"100%"}} // fix ui
        >
            <div className="tabs">
                {children.map((child, index) => {
                    return react.cloneElement(child, { active: activeIndex === index, onClick: () => { setActiveIndex(index) } })
                })}
            </div>
        </OverlayScrollbarsComponent>
    )
}

export function Tab(props) {
    const { onClick, onClose, active, name,isChange,fileType } = props;
    

    return (
        <div className={classNames("tab", { "active": active, "change": isChange  })} onClick={onClick}>
            <div className="left">
                <FileIcon fileType={fileType} />
            </div>  
            <div className="label">{name}</div>
            <div className="right">
                {/* temp */}
                {isChange ? <div className="change" /> : <DeleteIcon onDelete={onClose} />}
            </div>
        </div>
    )

}