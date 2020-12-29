import React from 'react'
import { useState } from 'react'
import { Button } from '@material-ui/core'
import { storage, db } from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({ username }) {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState()
  const [progress, setProgress] = useState(0)
  const allInputs = { imgUrl: '' }
  const [imageAsFile, setImageAsFile] = useState('')
  const [imageAsUrl, setImageAsUrl] = useState(allInputs)

  const handleChange = (e) => {
    const image = e.target.files[0]
    setImageAsFile((imageFile) => image)
  }
  const handleUpload = () => {
    const taskUpload = storage
      .ref(`images/${imageAsFile.name}`)
      .put(imageAsFile)

    taskUpload.on(
      'state_changed',
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progress)
      },
      (error) => {
        ///hbhgkhkj
        console.log(error)
        alert(error.message)
      },
      () => {
        storage
          .ref('images')
          .child(imageAsFile.name)
          .getDownloadURL()
          .then((url) => {
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            })
            setProgress(0)
            setCaption('')
            setImageAsFile(null)
          })
      }
    )
  }

  return (
    <div className='imageupload'>
      <progress className='image__upload' value={progress} max='100' />

      <input
        type='text'
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        placeholder='Enter a Caption ..'
      />

      <input type='file' onChange={handleChange} />
      <Button className='imageupload__button' onClick={handleUpload}>
        Upload Image
      </Button>
    </div>
  )
}

export default ImageUpload
