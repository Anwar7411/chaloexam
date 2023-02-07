import { Button, Input } from '@mui/material';
import axios from 'axios'
import { useState } from 'react';
import './App.css';

function App() {
  const[filename, setFileName] = useState()
 
 const handleChange=(e)=>{
  setFileName(e.target.files[0])
}

const handlesubmit=(event)=>{
  event.preventDefault();
  const formData=new FormData()
  formData.append('files',filename)
  axios.post("http://localhost:8080/upload",formData)
  .then((res)=>{
    if(res.data=="File upload successfully"){
      alert(res.data)
    }
  })
  .catch((err)=>{
    console.log("error",err)
    alert("Error in Uploading file use .docx type file to upload")
  })
}


 
  return (
    <div className="App">
      <form onSubmit={handlesubmit}>
      <Input type='file' name='files' onChange={(e)=>{handleChange(e)}}/>
      <Button type='submit'>Submit</Button>
      </form>
    </div>
  );
}

export default App;
