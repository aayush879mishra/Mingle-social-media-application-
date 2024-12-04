import { Label } from '@radix-ui/react-label';
import { Button } from './ui/button';
import logo from '../assets/Mingle-logo-transparent.png';
import friendslogin from '../assets/friends-login.jpg';
import loginbackground from '../assets/b-background.jpeg';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:3000/api/v1/user/login',
        input,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate('/');
        toast.success(res.data.message);
        setInput({
          email: '',
          password: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url("${loginbackground}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="h-[530px] w-[400px] shadow-md rounded-lg flex max-w-4xl overflow-hidden"
        style={{
          backgroundImage: `url(${friendslogin})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full md:w-full p-8 bg-white/0">
          <div className="flex flex-col items-center">
            <img
              className="w-20 h-12 mb-2"
              src={logo}
              alt="Mingle Logo"
            />
            <p className="text-gray-300 mb-4">Login! Your friends are waiting in</p>
          </div>

          <form onSubmit={signupHandler}>
            <div className="mb-4">
              <Label className="block text-gray-200" htmlFor="email">
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
            <div className="mb-6 relative">
              <Label className="block text-gray-200" htmlFor="password">
                Password
              </Label>
              <input
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
              />
              <i
                className={`absolute right-3 top-[58%] cursor-pointer text-gray-500 ${
                  showPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                }`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            {loading ? (
              <Button className="w-full mt-3 bg-yellow-500 text-white rounded-lg">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Please wait
              </Button>
            ) : (
              <Button
                className="w-full mt-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300"
                type="submit"
              >
                Login
              </Button>
            )}
            <span className="flex items-center justify-center text-sm text-gray-300 mt-2">
              Don't have an account?
              <Link to="/signup" className="text-yellow-500 ml-1 hover:underline">
                Signup
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
