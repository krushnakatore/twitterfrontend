import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Avatar } from "@mui/material";
import ReactPlayer from "react-player";

export const Tweet = ({ tweet, setData }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());
  const location = useLocation().pathname;
  const { id } = useParams();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const getTweets = async () => {
      try {
        //find user
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER}/user/find/${tweet.userId}`
        );
        setUserData(data);
      } catch (err) {
        console.log(err);
      }
    };
    getTweets();
  }, [tweet.likes, tweet.userId]);

  const handleLike = async (e) => {
    e.preventDefault();

    try {
      const like = await axios.put(
        `${process.env.REACT_APP_BACKEND_SERVER}/tweet/like/${tweet._id}`,
        {
          userId: currentUser._id,
        }
      );

      if (location.includes("profile")) {
        const newData = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER}/tweet/user/all/${id}`
        );
        setData(newData.data);
      } else if (location.includes("explore")) {
        const newData = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER}/tweet/explore`
        );
        setData(newData.data);
      } else {
        const newData = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER}/tweet/timeline/${currentUser._id}`
        );
        setData(newData.data);
      }
    } catch (err) {
      console.log("error", err);
    }
  };
  console.log(tweet?.video);
  return (
    <>
      {userData && (
        <>
          <div className="flex justify-start">
            <div className="flex-2">
              {userData?.profilePicture ? (
                <img
                  src={userData?.profilePicture}
                  alt="Profile Picture"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <Avatar />
              )}
            </div>
            <div className="flex-6 ml-5 w-3/4">
              <div className="flex space-x-2 items-center">
                <Link to={`/profile/${userData._id}`}>
                  <h3 className="font-bold">{userData.username}</h3>
                </Link>
                <span className="font-normal">@{userData.username}</span>
                <p> - {dateStr}</p>
              </div>
              {tweet?.photo ? (
                <div className="flex justify-center rounded border bg-white p-1 ">
                  <img
                    src={tweet?.photo}
                    alt="Tweet_photo"
                    className="object-fill h-48 w-full border-1 rounded-lg "
                  />
                </div>
              ) : tweet?.video ? (
                <div className="flex justify-center rounded border bg-white p-1 ">
                  <ReactPlayer
                    url={tweet?.video}
                    className="h-48"
                    height="200"
                    controls
                    playing={false}
                  />
                </div>
              ) : (
                ""
              )}

              <p>{tweet.description}</p>
              <button onClick={handleLike}>
                {tweet.likes.includes(currentUser._id) ? (
                  <FavoriteIcon
                    className="mr-2 my-2 cursor-pointer"
                    sx={{ color: "red" }}
                  ></FavoriteIcon>
                ) : (
                  <FavoriteBorderIcon className="mr-2 my-2 cursor-pointer"></FavoriteBorderIcon>
                )}
                {tweet.likes.length}
              </button>
            </div>
          </div>
          <div className="border-b-2 border-t-slate-800 mb-2"></div>
        </>
      )}
    </>
  );
};
