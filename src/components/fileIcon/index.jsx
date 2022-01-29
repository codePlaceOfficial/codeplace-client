import React from 'react';

const icons = {};
const iconsContext = require.context("resource/icons/fileIcons", false, /\.svg$/)
iconsContext.keys().forEach(icon => {
  let index = [icon.indexOf("./"), icon.lastIndexOf(".svg")]
  let name = icon.substring(index[0] + 2, index[1]);
  icons[name] = iconsContext(icon)
});

const __icon = (src) => {
  return <img className="icon" src={src} alt="" />
}

export const FileIcon = (props) => {
  const { fileType } = props;
  return __icon(icons[fileType] || icons["default_file"]);
}

export const DirIcon = (props) => {
  const { dirName, isOpen } = props;
  const iconSrc = icons[`folder-${dirName}${isOpen ? "-open" : ""}`] || icons[`folder-default${isOpen ? "-open" : ""}`]
  return __icon(iconSrc);
}