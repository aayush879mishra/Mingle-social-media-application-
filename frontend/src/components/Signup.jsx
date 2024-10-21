import { Label } from '@radix-ui/react-label'
import { Button } from './ui/button'
import logo from '../assets/Mingle-logo-transparent.png'
import friendslogo from '../assets/friends.jpg'
import React, { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const Signup = () => {
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({
      ...input,[e.target.name]: e.target.value
    })
  }
  const signupHandler =async (e) => {
    e.preventDefault()
    console.log(input);
    try{
      setLoading(true)
      const res = await axios.post('http://localhost:3000/api/v1/user/register', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true 
      })
      if(res.data.success){
        navigate('/login')
        toast.success(res.data.message);
        setInput({
          username: '',
          email: '',
          password: ''
        })
      }
    }catch(error){
      console.log(error)
      toast.error(error.response.data.message);
    }finally{
      setLoading(false)
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="h-[500px] bg-white shadow-md rounded-lg flex max-w-4xl ">
        {/* Left Side - Image */}
        <div className="hidden md:block w-2/5">
          <img
            className="h-full w-full object-cover shadow-md rounded-l-lg"
            src={friendslogo} // Replace with your image URL
            alt="Signup Illustration"
          />
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-8 ">
          <div className="flex flex-col items-center">
            <img
              className="w-20 h-12 mb-2"
              src={logo} // Replace with your logo URL
              alt="Mingle Logo"
            />
            
            <p className="text-gray-500 mb-6">Signup to make new friends</p>
          </div>

          <form onSubmit={signupHandler}>
            <div className="mb-4">
              <Label className="block text-gray-700" htmlFor="username">
                Username
              </Label>
              <input
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                type="text"
                placeholder="Enter your username"
                name="username"
                value={input.username}
                onChange={changeEventHandler}
              />
            </div>
            <div className="mb-4">
              <Label className="block text-gray-700" htmlFor="email">
                Email
              </Label>
              <input
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                type="email"
                placeholder="Enter your email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
              />
            </div>
            <div className="mb-6">
              <Label className="block text-gray-700" htmlFor="password">
                Password
              </Label>
              <input
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                type="password"
                placeholder="Enter your password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
              />
            </div>
            {
              loading ? (<Button>
              <Loader2 className="animate-spin mr-2 h-4 w-4"
            />
              Please wait
            </Button>
            ) :(
            <Button
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300"
              type="submit"
            >
              Signup
            </Button>
            )
            }
            <span className="flex items-center justify-center text-sm text-gray-500 mt-2">
              Already have an account?
              <Link to="/login" className="text-yellow-500 ml-1 hover:underline">Login</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Signup