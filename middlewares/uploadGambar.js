const multer = require("multer")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null,"./gambar" )
        // ini config utk menentukan folder penyimpanan yg diupload
    },
    filename: (request, file, callback) => {
        callback(null, `gambar-${Date.now()}${path.extname(file.originalname)}`)
        // ini config utk menentukan nama file yg diupload 
    }
})

exports.upload = multer({storage: storage})