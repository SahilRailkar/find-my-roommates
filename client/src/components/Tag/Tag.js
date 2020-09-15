import React from 'react';
import './Tag.css'

const Tag = (props) => {
    return (<span class="tag">
        {props.text}
    </span>)
}

export default Tag;