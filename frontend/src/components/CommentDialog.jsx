import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const {selectedPost, posts} = useSelector(store => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost){
    setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  
  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/post/${selectedPost._id}/comment`, {
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
          p._id === selectedPost._id ?{
              ...p,
              comments: updatedCommentData
            } : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
        
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.response?.data?.message);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col max-h-[90vh] overflow-y-scroll"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="post_image"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between ">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} className="object-cover"  alt="post_image" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">{selectedPost?.author?.username}</Link>
                  {/* <span>Bio here...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit text-[#ED4956] font-bold"
                  >
                    Unfollow
                  </Button>
                  <Button variant="ghost" className="cursor-pointer w-fit ">
                    Add to favorites
                  </Button>
                  <Button variant="ghost" className="cursor-pointer w-fit ">
                    Delete
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 max-h-96 overflow-y-auto p-4">
              {
                comment.map((comment) => <Comment key={comment._id} comment={comment}/>)
              }
              
            </div>
            <div className="p-4 sticky bottom-0">
              <div className="flex items-center gap-2 ">
                <input
                  type="text"
                  onChange={changeEventHandler}
                  value={text}
                  placeholder="Write a comment"
                  className="w-full p-2 outline-none text-sm border border-slate-300 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                  className="hover:bg-yellow-500 hover:text-slate-50"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
