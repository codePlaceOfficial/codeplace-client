import React from 'react'
import deleteIcon from "resource/icons/delete.svg"
export default function DeleteIcon(props) {
    const { onDelete } = props;

    return (
        <img className='icon c_filetabs_deleteIcon' src={deleteIcon} onClick={(e) => {
            e.stopPropagation();
            e.preventDefault()
            onDelete()
        }} alt="" />
    )
}
