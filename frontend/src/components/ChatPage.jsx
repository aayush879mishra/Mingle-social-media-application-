import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import { setMessages } from "@/redux/chatSlice";
import axios from "axios";


const ChatPage = () => {
    const [textMessage, setTextMessage] = useState('');
    const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
    const { onlineUsers, messages } = useSelector((store) => store.chat);
    
    
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:3000/api/v1/message/send/${receiverId}`, {
                textMessage
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
              dispatch(setMessages([...messages, res.data.newMessage]));
              setTextMessage('');
            }
        } catch (error) {
            console.log(error);
        }
    }
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    }
  },[])
  return (
    <div className="flex ml-[20%] h-screen">
      <section className="w-full md:w-1/4 my-0">
        <h1 className="text-xl mb-4 font-bold px-3">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh] divide-y divide-slate-100">
          {suggestedUsers?.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100  transition duration-300 transform hover:scale-[0.98]  cursor-pointer ">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt="profile_picture"
                    className="object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold">{suggestedUser?.username}</span>
                    <span className={`text-xs font-semibold  ${isOnline ? "text-green-600" : "text-red-500"}`}>{isOnline ? <i class="ri-infinity-fill"></i> : <i class="ri-infinity-line"></i>}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {
        selectedUser ? (
            <section  className="flex-1 border-l border-gray-300 flex flex-col h-full  "  >
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10 " >
                    <Avatar>
                        <AvatarImage src={selectedUser?.profilePicture} alt="profile_picture" className='object-cover'/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <span className='font-semibold'>{selectedUser?.username}</span>
                    </div>
                </div>
                
                <Messages selectedUser={selectedUser} />
                <div className="flex items-center p-4 border-t border-t-gray-300">
                    <input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} placeholder="Type a message" type="text" className="flex-1 p-2 mr-2 bg-[#f2e6fa] placeholder:text-gray-500 rounded-lg  focus:outline-none" />
                    <Button className="bg-[#a043f1] hover:bg-[#6617ab] font-bold rounded-full text-xl" onClick={() => sendMessageHandler(selectedUser?._id)}><i  class="ri-send-plane-fill"></i></Button>
                </div>
            </section>
        ) : (
            <div className="flex flex-col items-center justify-center flex-1">
                <MessageCircleCode className="w-40 h-40 text-gray-400" />
                <h1 className="text-2xl font-semibold text-gray-400">Your messages</h1>
                <span>Select a friend to start a conversation</span>
            </div>
        )
      }
    </div>
  );
};

export default ChatPage;
