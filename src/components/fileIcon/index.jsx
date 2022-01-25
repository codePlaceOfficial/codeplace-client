import React from 'react';

const convertNameToIconLink = (name) => {
  return `#icon-default_${name}`
}

export default function index(props) {
  const { name } = props
  
// console.log(convertNameToIconLink(name));
  return <svg className="icon" aria-hidden="true">
    
    {/* <use xlinkHref="#icon-default_folder_opened"></use> */}

    <use xlinkHref={convertNameToIconLink(name)}></use>
  </svg>;
}
