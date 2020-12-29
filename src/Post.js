import React from 'react'
import { useState, useEffect } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase'
import firebase from 'firebase'

const Post = ({ postId, user, username, caption, imageUrl }) => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const postComment = (event) => {
    event.preventDefault()
    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
    })
    setComment('')
  }
  useEffect(() => {
    let unsubsribe
    if (postId) {
      unsubsribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .onSnapshot((snapshot) =>
          setComments(snapshot.docs.map((doc) => doc.data()))
        )
    }
  }, [postId])

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          src='https://instagram.fisb6-1.fna.fbcdn.net/v/t51.2885-19/s150x150/90877839_531323710771237_5637759065560973312_n.jpg?_nc_ht=instagram.fisb6-1.fna.fbcdn.net&_nc_ohc=MQA0ZsHDEl4AX9qkO9t&tp=1&oh=88b7c5c9b475952766b680b6242a34e5&oe=60130298'
          alt='Nabeel Bhatti'
          className='post__avatar'
        ></Avatar>
        <h3>{username}</h3>
      </div>

      <img className='post__image' src={imageUrl} alt='' />
      <h4 className='post__text'>
        <strong>{username}</strong>:{caption}
      </h4>
      <div className='post__comments'>
        {comments.map((comment) => (
          <p>
            <b>{comment.username}</b>
            {comment.text}
          </p>
        ))}
      </div>
      <form action='' className='post__commentBox'>
        <input
          className='post__input'
          type='text'
          placeholder='Add a comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          disabled={!comment}
          className='post__button'
          type='submit'
          onClick={postComment}
        >
          Add Comment
        </button>
      </form>
    </div>
  )
}

export default Post
