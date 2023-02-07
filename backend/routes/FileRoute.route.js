const express=require('express')
const { FileModel } = require('../models/FileModel.model')

const FileRouter=express.Router();

FileRouter.post("/",async (req,res)=>{
  try{
   let fileupload=await new FileModel({files:req.file.path})
   fileupload.save();
   res.send("File upload successfully")
  }
  catch(err){
    console.log("Error in FileRouter")
  }
})

FileRouter.get("/download/:id",async (req,res)=>{
    try{
        let id=req.params.id
        let data=await FileModel.find({_id:id})
        if(data.length>0){
            let x='http://localhost:8080/'+data[0].files;
            res.send(x)
        }
    }
    catch(err){
        console.log("error in downloading file",err)
    }
})

module.exports={FileRouter}