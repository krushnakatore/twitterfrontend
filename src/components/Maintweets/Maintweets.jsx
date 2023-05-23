import React, { useEffect, useState } from "react";
import { Timelinetweets } from "../Timelinetweets/Timelinetweets";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { useSelector } from "react-redux";
import axios from "axios";
import { Avatar } from "@mui/material";
import {
  CalendarTodayOutlined,
  GifBoxOutlined,
  ImageOutlined,
  LocationOnOutlined,
  PollOutlined,
  SentimentSatisfiedAltOutlined,
  VideocamOutlined,
} from "@mui/icons-material";

export const Maintweets = () => {
  const [img, setImg] = useState("");
  const [uploadPhoto, setUploadPhoto] = useState("");
  const [uploadVideo, setUploadVideo] = useState("");
  const [video, setVideo] = useState("");
  const [imgUploadProgress, setImgUploadProgress] = useState();
  const [vidUploadProgress, setVidUploadProgress] = useState();
  const [tweetText, setTweetText] = useState("");
  const [open, setOpen] = useState(false);
  const [vidOpen, setVidOpen] = useState(false);
  const { currentUser, access_token } = useSelector((state) => state.user);

  const uploadImg = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadProgress(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setUploadPhoto(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    img && uploadImg(img);
  }, [img]);

  const uploadVid = () => {
    const storage = getStorage(app);
    if (video === null) return;
    const fileRef = ref(storage, `videos/${video.name}`);
    const uploadTask = uploadBytesResumable(fileRef, video);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setVidUploadProgress(Math.round(progress));
      },
      (error) => {
        console.log("error :(");
      },
      () => {
        console.log("success!!");
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadVideo(downloadURL);
          console.log("videoURL", downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    video && uploadVid(video);
  }, [video]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitTweet = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER}/tweet/create`,
        {
          userId: currentUser._id,
          description: tweetText,
          photo: uploadPhoto,
          video: uploadVideo ? uploadVideo : null,
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
  return (
    <div>
      {currentUser && (
        <div className="flex py-4">
          {currentUser?.profilePicture ? (
            <img
              src={currentUser?.profilePicture}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <Avatar />
          )}
          <p className="font-bold pl-2 my-2">{currentUser?.username}</p>
        </div>
      )}
      <form className="border-b-2 pb-6">
        <textarea
          type="text"
          onChange={(e) => setTweetText(e.target.value)}
          placeholder="What's Happening"
          maxLength={280}
          className="bg-slate-200 rounded-lg w-full p-2"
        ></textarea>
        <div className="flex justify-start mb-3 mt-2">
          <ImageOutlined
            className="text-blue-500 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          {open && (
            <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
              <div className="w-[600px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4 relative">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 cursor-pointer"
                >
                  X
                </button>
                <h2 className="font-bold text-xl">Add Image</h2>
                <p>Choose a new picture to post</p>
                {imgUploadProgress > 0 ? (
                  "Uploading " + imgUploadProgress + "%"
                ) : (
                  <input
                    type="file"
                    className="bg-transparent border border-slate-500 rounded p-2"
                    accept="image/*"
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                )}
              </div>
            </div>
          )}
          <VideocamOutlined
            className="text-blue-500 ml-5 cursor-pointer"
            onClick={() => setVidOpen(!open)}
          />
          {vidOpen && (
            <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
              <div className="w-[600px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4 relative">
                <button
                  onClick={() => setVidOpen(false)}
                  className="absolute top-3 right-3 cursor-pointer"
                >
                  X
                </button>
                <h2 className="font-bold text-xl">Add Video</h2>
                <p>Choose a new Video to post</p>
                {vidUploadProgress > 0 ? (
                  "Uploading " + vidUploadProgress + "%"
                ) : (
                  <input
                    type="file"
                    className="bg-transparent border border-slate-500 rounded p-2"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                  />
                )}
              </div>
            </div>
          )}
          <GifBoxOutlined className="text-blue-500 ml-5 cursor-pointer" />
          <PollOutlined className="text-blue-500 ml-5 cursor-pointer" />
          <SentimentSatisfiedAltOutlined className="text-blue-500 ml-5 cursor-pointer" />
          <CalendarTodayOutlined className="text-blue-500 ml-5 cursor-pointer" />
          <LocationOnOutlined className="text-blue-500 ml-5 cursor-pointer" />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-full ml-auto"
        >
          Tweet
        </button>
      </form>
      <Timelinetweets />
    </div>
  );
};
