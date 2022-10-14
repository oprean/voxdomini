import React, { Fragment, useState, useEffect } from "react";
import {QRCodeSVG, QRCodeCanvas} from 'qrcode.react';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import {PERMLINK_ROOT_URL} from '../utils/constants';

export default function QRCard(props) {
    const [size, setSize] = React.useState(500);
    const [selectedImage, setSelectedImage] = useState(null);
    let { content } = props;
    const permlink = PERMLINK_ROOT_URL + 'resource/' + content.permlink
    function handleSize(e) {
        setSize(e.target.value);
    }

    return (
    <>
        <TextField fullWidth id="standard-basic" onChange={handleSize} label="QR Size (px)" value={size} variant="standard" />
        <br/><br/>
        <QRCodeCanvas value={permlink}
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
        <div>QR Permlink: &nbsp;
            <Link href={permlink}>{permlink}</Link>
        </div>
        <br/>
      </>
)

}