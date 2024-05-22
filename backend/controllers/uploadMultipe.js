// const multer =require('multer')
// const cloudinary = require("../utils/cloudinaryConfig");


// const uploadMultiple =async(req,res,next) =>{
//     try{
//         const images = req.files;

//         console.log(images)

//         const imageUrls =[];
        
//         for(const image of images){
//             const result = cloudinary.uploader.upload(image.path{resource_type:"auto"});

//             imageUrls.push(result.secure_url)
//         }
//     }
//     catch(error){
//         consol.log(error)
//         res.status(500).json({message:"internal error",
//             error:error
//         })
//     }
// }
// to us it in the upload middle ware we add upload.array("imagess")