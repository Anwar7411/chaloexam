import { Alert, Button, Grid, Input, Snackbar } from '@mui/material';
import axios from 'axios'
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [filename, setFileName] = useState();
  const [data, setData] = useState([]);
  const [openerror, setOpenError] =useState({ bool:false, mssg:"" });
  const [opensuccess, setOpenSuccess] =useState({ bool:false, mssg:"" });
  const [bool, setBool]=useState(false)

  useEffect(() => {
    axios.get("http://localhost:8080/upload/getall")
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [bool])

  const handleChange = (e) => {
    setFileName(e.target.files[0])
  }

  const handlesubmit = (event) => {
    event.preventDefault();
    const formData = new FormData()
    formData.append('files', filename)
    axios.post("http://localhost:8080/upload", formData)
      .then((res) => {
        if (res.data == "File upload successfully") {
          setOpenSuccess({bool:true,mssg:"File upload successfully"})
          setBool(!bool)
        }
      })
      .catch((err) => {
        console.log("error", err)
        setOpenError({bool:true,mssg:"Error in Uploading file use .docx type file to upload"});
      })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError({ bool:false, mssg:"" });
    setOpenSuccess({ bool:false, mssg:"" });
  };

  const handledownload = (el) => {
    axios.get(`http://localhost:8080/upload/download/${el._id}`)
      .then((res) => {
        window.location.href = res.data
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="App">
      <Grid className='formgrid'>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAhEK0nHmYil-y_U2VdSNHluYo8Bqs8C2B2A&usqp=CAU" />
        <form onSubmit={handlesubmit}>
          <Input type='file' name='files' onChange={(e) => { handleChange(e) }} />
          <Button type='submit'>Upload</Button>
        </form>
      </Grid>
      <Grid
        className='outergrid'
      >
        {
          data && data?.map((el) => (
            <Grid item key={el._id} className='innergrid'>
              <h3>{el.files.slice(8)}</h3>
              <Button onClick={() => handledownload(el)}>Download</Button>
            </Grid>
          ))
        }
      </Grid>
      <Snackbar open={openerror.bool} autoHideDuration={2000} onClose={handleClose}   anchorOrigin={{ vertical:"top", horizontal:"center" }}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {openerror.mssg}
      </Alert>
    </Snackbar>
    <Snackbar open={opensuccess.bool} autoHideDuration={2000} onClose={handleClose}   anchorOrigin={{ vertical:"top", horizontal:"center" }}>
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        {opensuccess.mssg}
      </Alert>
    </Snackbar>
    </div>
  );
}

export default App;
