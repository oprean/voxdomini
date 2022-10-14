import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import {API_ROOT_URL} from '../../utils/constants';
import axios from 'axios';
const FileUploader = props => {  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleChange = event => {
    //const fileUploaded = event.target.files[0];
    //props.handleFile(fileUploaded);
    setSelectedImage(event.target.files[0]);
  };  

  async function UploadSelectedImage(e) {
    console.log(e);
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();

      if (window.confirm('Are you sure you want to use this image as resource header?')) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("id", props.data.id);
        
        await axios.post(API_ROOT_URL + 'upload', 
        formData, {
          headers: {
          "Content-Type": "multipart/form-data",
          }}
        ).then(function (response) {
          setSelectedImage(null);
      }).catch((reason) => {
        console.log(reason)
      }).finally((info) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      });
    }
  }
  
  return (
    <div style={{marginTop: 10, marginBottom: 10}}>
      <Button variant="contained" type="button" size="small" onClick={handleClick}>
        Select image
      </Button> New resource header
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display: 'none'}}
      />
      {selectedImage && (
            <div>
              <img style={{marginTop: 10, marginBottom: 10}} width={"500px"} src={URL.createObjectURL(selectedImage)} />
              <div>
                <Button color="secondary" type="button" variant="contained" style={{marginRight: 10}} size="small" onClick={(e) => UploadSelectedImage(e)}>Upload</Button>
                <Button type="button" variant="contained" size="small" style={{float: 'right'}} onClick={()=>setSelectedImage(null)}>Remove</Button>
              </div>
            </div>            
        )}
    
    </div>
  );
}
export default FileUploader;