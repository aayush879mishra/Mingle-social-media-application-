import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const {user} = useSelector(store => store.auth);
  return (
    <div className='w-fit my-10 pr-20 fixed top-0 right-0 hidden lg:block'>
      <div className='flex flex-col gap-2'>
        <Link to={`/profile/${user?._id}`} >
          <Avatar>
            <AvatarImage src={user?.profilePicture} className='object-cover' alt="profile_picture" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        
        <div>
          <h1 className='text-sm font-semibold'><Link to={`/profile/${user?._id}`} >{user?.username}</Link></h1>
          <span className=' text-sm text-gray-600'>{user?.bio || "No bio"}</span>
        </div>
      </div>

      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar