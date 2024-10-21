import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import smlogo from '../assets/Mingle-logo-small.png'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
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
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                )
        ,text:"Profile"
    },
    {
        icon:<LogOut/>,text:"Logout"
    }
]
const LeftSidebar = () => {
    const navigate = useNavigate();
    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/logout', {
                withCredentials: true
            });
            if (res.data.success) {
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.message.data.message)
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === "Logout") {
            logoutHandler();
        }
    }
  return (
    <div className=" w-[20%] h-screen border-r border-slate-300 bg-[#F7F9FB]"> 
        <img
          className="w-full h-11 mb-2 py-1 object-center object-contain cursor-pointer shadow-[0px_7px_7px_0px_rgba(0,0,0,0.20)] bg-gray-50"
          src={smlogo} // logo URL here
          alt="Mingle Logo"
        />
        {
            sidebarItems.map((item, index)=>{
                return( <div onClick={() => sidebarHandler(item.text)} key={index}
                    className="flex items-center relative space-x-4 p-3 mr-3 ml-3 rounded-lg hover:bg-[#FCCD04] transition duration-300 transform hover:scale-[1.04] cursor-pointer">
                    <div className='text-2xl'>
                    {item.icon}
                    </div>
                   <span className='font-medium'>{item.text}</span> 
                </div>
                )
            })
        }
    </div>
  )
}

export default LeftSidebar