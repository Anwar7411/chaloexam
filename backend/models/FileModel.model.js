const mongoose=require('mongoose');

const FileSchema=({ 
    files:String
})

const FileModel=mongoose.model("Files",FileSchema)

module.exports={FileModel}