import React, { Fragment, useState, useEffect } from "react";
import {QRCodeSVG, QRCodeCanvas} from 'qrcode.react';
import TextField from '@mui/material/TextField';

export default function QRCard(props) {
    const [size, setSize] = React.useState(256);
    let { content } = props;

    function handleSize(e) {
        setSize(e.target.value);
    }

    return (
    <>
        <TextField fullWidth id="standard-basic" onChange={handleSize} label="QR Size (px)" value={size} variant="standard" />
        <br/><br/>
        <QRCodeCanvas value={content.url}
        size={size}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        includeMargin={false}
        imageSettings={{
            src: "https://voxdomini.bitalb.ro/vox3.png",
            x: undefined,
            y: undefined,
            height: 60,
            width: 60,
            excavate: true,
        }}/>
        <div>{content.url}</div>
        <br/>
      </>
)

}