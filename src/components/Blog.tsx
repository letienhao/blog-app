import React from 'react'
import CreatePost from './blog/CreatePost'
import PostList from './blog/PostList'
import '../style/blog.css'
const Blog = () => {
  return (
    <div className="blog_main" >
      <CreatePost/>
      <PostList/>
    </div>
  )
}

export default Blog