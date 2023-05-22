import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Tweet } from "../Tweet/Tweet";
import { Loader } from "../Loader/Loader";

export const Timelinetweets = () => {
  const [timeline, setTimeline] = useState();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getTimelineTweets = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER}/tweet/timeline/${currentUser._id}`
        );
        setTimeline(data);
      } catch (err) {
        console.log(err);
      }
    };

    getTimelineTweets();
  }, [currentUser._id]);

  return (
    <div className="mt-6">
      {timeline ? (
        timeline.map((tweet) => {
          return (
            <div key={tweet._id}>
              <Tweet tweet={tweet} setData={setTimeline} />
            </div>
          );
        })
      ) : (
        <Loader />
      )}
    </div>
  );
};
