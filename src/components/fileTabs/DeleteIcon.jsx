import React from 'react'

export default function DeleteIcon(props) {
    const {onDelete} = props;

    return (
        <svg className="icon c_filetabs_deleteIcon" aria-hidden="true" onClick={(e) => {
            e.stopPropagation();
            e.preventDefault()
            onDelete()
        }}>
            <use xlinkHref="#icon-delete"></use>
        </svg>
    )
}
