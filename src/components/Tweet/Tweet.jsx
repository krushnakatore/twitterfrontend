import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Avatar } from "@mui/material";
import ReactPlayer from "react-player";
import {
  CalendarTodayOutlined,
  DeleteOutlineOutlined,
  Edit,
  GifBoxOutlined,
  ImageOutlined,
  LocationOnOutlined,
  PollOutlined,
  SentimentSatisfiedAltOutlined,
  VideocamOutlined,
} from "@mui/icons-material";

export const Tweet = ({ tweet, setData }) => {
  const { currentUser, access_token } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [vidOpen, setVidOpen] = useState(false);
  const [tweetText, setTweetText] = useState("");
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

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const updateTweet = await axios.put(
        `${process.env.REACT_APP_BACKEND_SERVER}/tweet/update/${tweet._id}`,
        {
          description: tweetText,
        },
        {
          headers: { Authorization: access_token },
        }
      );
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTweet = async () => {
    try {
      const deleteTweet = await axios.delete(
        `${process.env.REACT_APP_BACKEND_SERVER}/tweet/delete/${tweet._id}/${currentUser._id}`,
        {
          headers: { Authorization: access_token },
        }
      );
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };
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
                {currentUser?._id === id && (
                  <>
                    {" "}
                    <Edit
                      onClick={() => setOpen(true)}
                      className="cursor-pointer"
                    />
                    <DeleteOutlineOutlined
                      onClick={() => handleDeleteTweet()}
                      className="cursor-pointer"
                    />
                  </>
                )}
              </div>
              {open && (
                <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
                  <div className="w-[600px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4 relative">
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute top-3 right-3 cursor-pointer"
                    >
                      X
                    </button>
                    <form className="realative border-b-2 pb-6">
                      <div className="flex justify-start mb-3 mt-2">
                        {open && (
                          <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
                            <div className="w-[600px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4 relative">
                              <button
                                onClick={() => setOpen(false)}
                                className="absolute top-3 right-3 cursor-pointer"
                              >
                                X
                              </button>
                              <h2 className="font-bold text-xl">Edit Tweet</h2>
                              <textarea
                                type="text"
                                onChange={(e) => setTweetText(e.target.value)}
                                placeholder="What's Happening"
                                maxLength={280}
                                className="bg-white-200 rounded-lg w-full p-2"
                              ></textarea>
                            </div>
                            <button
                              onClick={(e) => handleEdit(e)}
                              className="absolute t-50 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full ml-auto"
                            >
                              Tweet
                            </button>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              )}
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
