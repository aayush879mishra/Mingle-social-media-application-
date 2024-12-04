import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import smlogo from '../assets/Mingle-logo-small.png'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
// import store from '@/redux/store'
import CreatePost from './CreatePost'
import { setAuthUser } from '@/redux/authSlice'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftSidebar = () => {
    const navigate = useNavigate();
    const {user} = useSelector(store => store.auth);
    const {likeNotification} = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open,setOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/logout', {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error details:", error); // Log the complete error object
            const errorMessage = error.response?.data?.message || "Logout failed. Please try again.";
            toast.error(errorMessage);
        }
    }

   
    const sidebarHandler = (textType) => {
        if (textType === "Logout") {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate(`/`);
        } else if (textType === "Messages") {
            navigate(`/chat`);
        }
    }

    const sidebarItems = [

        {
            icon:<Home/>,text:"Home"
        },
        {
            icon:<Search/>,text:"Search"
        },
        {
            icon:<TrendingUp/>,text:"Explore"
        },
        {
            icon:<MessageCircle/>,text:"Messages"
        },
        {
            icon:<Heart/>,text:"Notifications"
        },
        {
            icon:<PlusSquare/>,text:"Create"
        },
        {
            icon:
                    (
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={user?.profilePicture} className="object-cover" alt="profile_picture" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    )
            ,text:"Profile"
        },
        {
            icon:<LogOut/>,text:"Logout"
        }
    ]
  return (
    <div className="fixed top-0 z-10 left-0 w-[20%] h-screen border-r border-slate-300 bg-[#F7F9FB]"> 
        <img
          className="w-full h-11 mb-2 py-1 object-center object-contain cursor-pointer shadow-[0px_7px_7px_0px_rgba(0,0,0,0.20)] bg-gray-50"
          src={smlogo} // logo URL here
          alt="Mingle Logo"
        />
        {
            sidebarItems.map((item, index)=>{
                return( <div onClick={() => sidebarHandler(item.text)} key={index}
                    className="flex items-center relative space-x-4 p-3 mr-3 ml-3 rounded-lg hover:bg-[#FCCD04] transition duration-300 transform hover:scale-[1.04] active:bg-yellow-500 active:scale-[1.09] active:text-gray-400  cursor-pointer">
                    <div className='text-2xl'>
                    {item.icon}
                    </div>
                   <span className='font-medium truncate '>{item.text}</span> 
                   {
                    item.text === "Notifications" && likeNotification.length > 0 && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button size="icon" className="rounded-full w-5 h-5 bg-red-600 hover:bg-red-700 absolute bottom-6 left-3">{likeNotification.length}</Button>

                            </PopoverTrigger>
                            <PopoverContent>
                                <div>
                                    {
                                        likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                            likeNotification.map((notification) =>{
                                                return(
                                                    <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                        <Avatar>
                                                            <AvatarImage src={notification.userDetails?.profilePicture} alt="profile_picture" className='object-cover'/>
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                    </div>
                                                )
                                                
                                            })
                                    )
                                     }
                                </div>
                            </PopoverContent>
                        </Popover>
                    )
                   }
                </div>
                )
            })
        }

        <CreatePost open={open} setOpen={setOpen}/>
    </div>
  )
}

export default LeftSidebar