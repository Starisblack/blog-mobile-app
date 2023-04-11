import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase-config";



const uploadImage = async  (file: any) => {

    const storage = getStorage(app);

// Create the file metadata
/** @type {any} */
// const metadata = {
//   contentType: 'image/jpeg'
// };

const storageRef: any = ref(storage, 'images/' + file.name);
const uploadTask = uploadBytesResumable(storageRef, file);

// Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
 
     () => {
    
     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
         
         return console.log(downloadURL)
    });
  }
  
);
  
}

export default uploadImage;