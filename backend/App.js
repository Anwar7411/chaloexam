const express=require('express')
const cors=require('cors')

const {connection} =require('./server')


const app=express();
app.use(express.json());
app.use(cors({
    origin: '*'
}))



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