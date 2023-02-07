const express=require('express')
const cors=require('cors')
const bodyParser = require('body-parser')
const { upload } = require("./middleware/Upload")
const {FileRouter} = require('./routes/FileRoute.route')

const {connection} =require('./server')


const app=express();

app.use(cors({
    origin: '*'
}))

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads',express.static('uploads'))

app.use("/upload",upload.single('files'),FileRouter)



app.listen(8080, async ()=>{
    try{
      await connection;
      console.log("connected to database");
    }
    catch(err){
        console.log("Error in connection",err);
    }
    console.log("Listening on port 8080");
})