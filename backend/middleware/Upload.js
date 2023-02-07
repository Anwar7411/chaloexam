const path=require('path');
const multer=require('multer')

let storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: function(req,file,cb){
        let ext= file.originalname
        cb(null,ext)
    }

})

let upload=multer({
    storage:storage,
    fileFilter: function(req,file,cb){
        
        if(file.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            cb(null,true)
        }else{          
            console.log("please upload .docx file")
            cb(null,false)
        }
    },
    limits: {
        fileSize: 1024*1024*3
    }
})

module.exports={upload}