import { Alert, Button, Grid, Input, Snackbar } from '@mui/material';
import axios from 'axios'
import { useThrottle } from 'use-throttle';
import { useEffect, useState,useCallback } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './App.css';

function App() {
  const [filename, setFileName] = useState();
  const [data, setData] = useState([]);
  const [openerror, setOpenError] =useState({ bool:false, mssg:"" });
  const [opensuccess, setOpenSuccess] =useState({ bool:false, mssg:"" });
  const [bool, setBool]=useState(false)
  const [searchdata, setSearchData]=useState([]);
   const [quaery, setQuaery]=useState("");
   const [inputText, setInputText]=useState("");
   const [select, setSelect]=useState(false);

   const quaeryHandler=useCallback((val)=>{
    setQuaery(val);
  },[]);

  const throttleText=useThrottle(inputText,1000)

  useEffect(()=>{
    axios.get(`http://localhost:8080/upload/search?search=${quaery}`)
    .then((res)=>{
      setSearchData(res.data)
      console.log("indata",res.data)
    }).catch((err)=>{
        console.log(err)
    })
   },[quaery])

   useEffect(()=>{
    quaeryHandler(throttleText)
},[quaeryHandler,throttleText])

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

  window.addEventListener('mouseup',function(event){
    var sugest = document.getElementById('sugest');
    if(event.target != sugest && event.target.parentNode != sugest){
        setInputText("");
        setSelect(false)
    }
});  

  const handledownload = (event,el) => {
    console.log("indownload",el)
    event.stopPropagation()
    axios.get(`http://localhost:8080/upload/download/${el._id}`)
      .then((res) => {
        window.location.href = res.data;
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="App">
      <div className='navbar'>
        <div>
          Home
        </div>
        <div >
          <SearchIcon />
         <input type="text" value={inputText} onChange={(e)=>{setSelect(true);setInputText(e.target.value)}} />
         <div id="sugest" >
           {select ? 
           <div id="sugest">{
            searchdata.map((item)=>{
                return <div className='itemdiv'>
                  <div>{ item.files.slice(8) }</div>
                  <button onClick={(e) => handledownload(e,item)}>Download</button>
                </div>
                }) 
            }</div>
            : null }
        </div>
        </div>
      </div>
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
              <Button onClick={(e) => handledownload(e,el)}>Download</Button>
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
