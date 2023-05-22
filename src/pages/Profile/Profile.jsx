import React, { useEffect, useState } from "react";
import { Leftsidebar } from "../../components/Leftsidebar/Leftsidebar";
import { Rightsidebar } from "../../components/Rightsidebar/Rightsidebar";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { BiCalendar } from "react-icons/bi";
import axios from "axios";
import { Tweet } from "../../components/Tweet/Tweet";
import { following } from "../../redux/userSlice";
import { Editprofile } from "../../components/Editprofile/Editprofile";
import { Avatar } from "@mui/material";
import { Loader } from "../../components/Loader/Loader";

export const Profile = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [userTweets, setUserTweets] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userTweets = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER}/tweet/user/all/${id}`
        );
        const userProfile = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER}/user/find/${id}`
        );

        setUserTweets(userTweets.data);
        setUserProfile(userProfile.data);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [currentUser, id]);

  const handleFollow = async () => {
    if (!currentUser.following.includes(id)) {
      try {
        const follow = await axios.put(
          `${process.env.REACT_APP_BACKEND_SERVER}/user/follow/${id}`,
          {
            id: currentUser._id,
          },
          { withCredentials: true, credentials: "include" }
        );
        dispatch(following(id));
      } catch (err) {
        console.log("error", err);
      }
    } else {
      try {
        const unfollow = await axios.put(
          `${process.env.REACT_APP_BACKEND_SERVER}/user/unfollow/${id}`,
          {
            id: currentUser._id,
          },
          { withCredentials: true, credentials: "include" }
        );

        dispatch(following(id));
      } catch (err) {
        console.log("error", err);
      }
    }
  };
  console.log("currentUser", currentUser);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="px-6">
          <Leftsidebar />
        </div>
        <div className="col-span-2 border-x-2 border-t-slate-800 ">
          <div className="bg-neutral-700 h-44 relative">
            {userProfile?.profilePicture ? (
              <div className="absolute -bottom-11 left-4">
                <img
                  src={userProfile?.profilePicture}
                  alt="Profile Picture"
                  className="rounded-full object-cover"
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "2px solid white",
                  }}
                />
              </div>
            ) : (
              <div className="absolute -bottom-11 left-4">
                <Avatar
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "2px solid white",
                  }}
                />
              </div>
            )}
          </div>
          <div className="border-b-[1px] border-neutral-800 pb-4">
            <div className="flex justify-end p-2">
              {currentUser._id === id ? (
                <button
                  className="px-4 -y-2 bg-blue-500 rounded-full text-white"
                  onClick={() => setOpen(true)}
                >
                  Edit Profile
                </button>
              ) : currentUser.following.includes(id) ? (
                <button
                  className="px-4 -y-2 bg-blue-500 rounded-full text-white"
                  onClick={handleFollow}
                >
                  Following
                </button>
              ) : (
                <button
                  className="px-4 -y-2 bg-blue-500 rounded-full text-white"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )}
            </div>
            <div className="mt-8 px-4">
              <div className="flex flex-col">
                <p className="text-black text-2xl font-semibold">
                  {userProfile?.username}
                </p>
                <p className="text-md text-neutral-500">
                  @{userProfile?.username}
                </p>
              </div>
              <div className="flex flex-col mt-4">
                <p className="text-white">{userProfile?.bio}</p>
                <div
                  className="
              flex 
              flex-row 
              items-center 
              gap-2 
              mt-4 
              text-neutral-500
          "
                >
                  <BiCalendar size={24} />
                  <p>
                    Joined{" "}
                    {userProfile?.createdAt &&
                      format(new Date(userProfile?.createdAt), "MMMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-center mt-4 gap-6">
                <div className="flex flex-row items-center gap-1">
                  <p className="text-black">
                    {userProfile?.following?.length || 0}
                  </p>
                  <p className="text-neutral-500">Following</p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <p className="text-black">
                    {userProfile?.followers?.length || 0}
                  </p>
                  <p className="text-neutral-500">Followers</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            {/* {userProfile?.profilePicture ? (
              <img
                src={userProfile?.profilePicture}
                alt="Profile Picture"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <Avatar />
            )} */}
          </div>
          <div className="mt-6">
            {userTweets ? (
              userTweets.map((tweet) => {
                return (
                  <div className="p-2" key={tweet._id}>
                    <Tweet tweet={tweet} setData={setUserTweets} />
                  </div>
                );
              })
            ) : (
              <Loader />
            )}
          </div>
        </div>
        <div className="px-6">
          <Rightsidebar />
        </div>
      </div>
      {open && <Editprofile setOpen={setOpen} />}
    </>
  );
};
