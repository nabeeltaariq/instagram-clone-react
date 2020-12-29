import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { auth, db } from './firebase'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import Input from '@material-ui/core/Input'
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed'
import './App.css'
import Post from './Post'
function rand() {
  return Math.round(Math.random() * 20) - 10
}
function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

function App() {
  const [modalStyle] = React.useState(getModalStyle)
  const classes = useStyles()
  const [posts, setPosts] = useState([])
  const [openSignIn, setopenSignIn] = useState(false)
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()
  const [username, setUsername] = useState()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user hase logged in
        authUser.updateProfile({ displayName: username, photoUrl: '' })

        console.log(authUser)
        setUser(authUser)
        if (authUser.displayName) {
          // don't update warning
        } else {
          return authUser.updateProfile({
            displayName: username,
          })
        }
      } else {
        // user has logged out
        setUser(null)
      }
    })
    return () => {
      //perform some cleanup
      unsubscribe()
    }
  }, [user, username])
  useEffect(() => {
    db.collection('posts').onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })))
    })
  }, [])

  const signUp = (event) => {
    event.preventDefault()
    auth
      .createUserWithEmailAndPassword(email, password)

      .catch((error) => alert(error.message))
  }
  const signIn = (event) => {
    event.preventDefault()
    auth
      .signInWithEmailAndPassword(email, password)

      .catch((error) => alert(error.message))
    setopenSignIn(false)
  }

  return (
    <div className='App'>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form action='' className='app__signup'>
            <center>
              <img
                src='https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png'
                alt=''
                className='app__headerImage'
              />
            </center>

            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>SignUp</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setopenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form action='' className='app__signup'>
            <center>
              <img
                src='https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png'
                alt=''
                className='app__headerImage'
              />
            </center>

            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>SignIn</Button>
          </form>
        </div>
      </Modal>
      <div className='app__header'>
        <img
          src='https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png'
          alt=''
          className='app__headerImage'
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>LogOut</Button>
        ) : (
          <div className='app__loginContainer'>
            <Button onClick={() => setOpen(true)}>SignUp</Button>
            <Button onClick={() => setopenSignIn(true)}>SignIn</Button>
          </div>
        )}
      </div>
      <div className='app__posts'>
        <div>
          {posts.map(({ id, post }) => {
            return (
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            )
          })}
        </div>
      </div>

      <div>
        <InstagramEmbed
          url='https://instagr.com/p/B_uf9dnAGPw/'
          clientAccessToken='123|456'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to Upload post</h3>
      )}
      {/* Header */}
      {/* Posts */}
    </div>
  )
}

export default App
