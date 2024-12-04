import React from 'react'
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';

const SuggestedUsers = () => {
    const {suggestedUsers} = useSelector(store => store.auth);
  return (
    <div className='my-10'>
      <div className='flex items-center justify-between text-sm'>
        <h1 className='font-semibold '>Suggested for you</h1>
        <span className='font-medium cursor-pointer text-gray-500 hover:text-gray-600'>See All</span>
      </div>
      {
        suggestedUsers?.map((user) => {
          return (
            <div className='flex items-center justify-between my-4 ' key={user._id}>
            <div className='flex items-center gap-2'>
            <Link to={`/profile/${user?._id}`} >
                <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="profile_picture" className='object-cover'/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Link>
        
            <div>
                <h1 className='text-sm font-semibold'><Link to={`/profile/${user?._id}`} >{user?.username}</Link></h1>
                <span className=' text-sm text-gray-600'>{user?.bio}</span>
            </div>
            </div>
            <span className='font-bold text-xs text-[#3BADF8] cursor-pointer hover:text-[#2973a4]'>Follow</span>
        </div>
        )
      })
      }
    </div>
  )
}

export default SuggestedUsers