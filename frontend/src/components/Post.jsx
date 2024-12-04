import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const {user} = useSelector((state) => state.auth)
  const {posts} = useSelector((state) => state.post)
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(`http://localhost:3000/api/v1/post/${post._id}/${action}`, {
        withCredentials: true,
      });
      console.log(res.data);
      if (res.data.success) {
        const updatedLikes = liked ? postLike -1 : postLike +1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        // update post
        const updatedPostData = posts.map(p => 
          p._id === post._id ?{
              ...p,
              likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
            } : p
      );
        dispatch(setPosts(updatedPostData));
      //  console.log(post.likes); // Check the data type and contents
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.response?.data?.message);
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/post/${post._id}/comment`, {
        text,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map(p => 
          p._id === post._id ?{
              ...p,
              comments: updatedCommentData
            } : p
      );
        dispatch(setPosts(updatedPostData));
        setText("");
        // setOpen(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/post/delete/${post._id}`, 
        {withCredentials: true}
      );
      if (res.data.success) {
        const updatedPostData = posts.filter((postItem) => postItem?._id !== post._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/post/${post?._id}/bookmark`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <div className="my-6 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} className="object-cover" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center  gap-3">
          <h1>{post.author?.username}</h1>
          {
            user && user._id === post?.author._id && (
              <Badge  variant="secondary" >Author</Badge>
            )
          }  
          </div>
          
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {
              post?.author?._id !== user?._id  && (
                <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956]  font-bold"
            >
              Unfollow
            </Button>
              )
            }
            
            <Button variant="ghost" className="cursor-pointer w-fit font-bold ">
              Add to favorites
            </Button>
            {
                user && user._id === post?.author._id && (
                  <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit text-red-600 font-bold">
                  Delete
                  </Button>
                )
            }
            
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="my-2 w-full rounded-sm aspect-square object-cover"
        src={post.image}
        alt="post_image"
      />

      <div>
        <div className="flex items-center justify-between my-2">
          <div className="flex items-center gap-3">
            {
              liked ? (
                <FaHeart
                  onClick={likeOrDislikeHandler}
                  size={"22px"}
                  className="cursor-pointer text-red-600 "
                />
              ) : (
                <FaRegHeart
                onClick={likeOrDislikeHandler}
                size={"22px"}
                className="cursor-pointer hover:text-gray-600"
              />
              )
            }
           
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="cursor-pointer hover:text-gray-600"
            />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>

          <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600" />
        </div>
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-bold mr-1">{post.author?.username}</span>
        <span>
          {post.caption}
        </span>
      </p>

      {
        comment.length > 0 && (
          <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="text-sm text-gray-600 cursor-pointer"
        >
          View all {comment.length} comments
        </span>
        )
      }
     
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between mt-2">
        <input
          type="text"
          placeholder="Add a comment"
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm  py-1 px-4 w-full"
        />
        {text && <span onClick={commentHandler} className=" text-yellow-600 cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default Post;