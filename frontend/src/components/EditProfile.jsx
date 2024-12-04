import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
       profilePhoto:user?.profilePicture,
       bio:user?.bio,
       gender:user?.gender
  });
   const navigate = useNavigate ();
   const dispatch = useDispatch();

   const fileChangeHandler =  (e) => {
    const file = e.target.files?.[0];
    if (file) 
      setInput({ ...input, profilePhoto: file });
   }

   const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
   }

  const editProfileHandler = async (e) => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if(input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/v1/user/profile/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
          profilePicture: res.data.user?.profilePicture
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex max-w-2xl mx-auto pl-36">
      <section className="flex flex-col gap-4 w-full my-8">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <div className="flex items-center justify-between rounded-xl bg-gray-100 p-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="profile_picture" className="object-cover" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-sm font-bold"></h1>
              <span className="text-sm text-gray-600">
                {user?.bio || "No bio"}
              </span>
            </div>
          </div>
          <input ref={imageRef} type="file" onChange={fileChangeHandler} className="hidden" />
          <Button
            onClick={() => imageRef?.current.click()}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Change Picture
          </Button>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-2">Bio</h1>
          <Textarea
            value={input?.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            placeholder="Write something about yourself"
            className="w-full focus-visible:ring-transparent focus-visible:bg-blue-100"
          ></Textarea>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-2">Gender</h1>
          <Select defaultValue="{input?.gender}" onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-[180px]">
              <SelectValue  />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
            {
              loading ? (
                <Button className="w-fit bg-yellow-600 ">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...</Button>

              ) : (
                <Button onClick={editProfileHandler} className="w-fit bg-yellow-600 hover:bg-yellow-700">Save</Button>
              )
            }
            
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
