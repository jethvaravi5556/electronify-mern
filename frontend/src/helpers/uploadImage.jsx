import React from 'react'
const url= `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUD_NAME_CLOUDINARY}/image/upload`
const uploadImage = async(image) => {

    const formData=new FormData()
    formData.append("file",image)
    formData.append("upload_preset",import.meta.env.VITE_UPLOAD_PRESET)

    const dataResponse = await fetch(url,{
        method:"post",
        body: formData

    })
  return dataResponse.json()

}

export default uploadImage