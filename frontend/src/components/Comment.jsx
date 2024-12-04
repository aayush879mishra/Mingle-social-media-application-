import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const comment = ({comment}) => {
  return (
    <div className='my-2'>
        <div className='flex items-center gap-2'>
            <Avatar>
                <AvatarImage src={comment?.author?.profilePicture} className='object-cover'/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className='text-sm font-bold'>{comment?.author.username} <span className='font-normal pl-1'>{comment?.text}</span></h1>
        </div>
    </div>
  )
}

export default comment