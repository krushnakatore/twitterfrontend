import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tweet } from "../Tweet/Tweet";
import axios from "axios";
import { Loader } from "../Loader/Loader";

export const Exlploretweets = () => {
  const [explore, setExplore] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exploreTweets = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER}/tweet/explore`
        );
        setExplore(exploreTweets.data);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchData();
  }, [currentUser._id]);
  return (
    <div className="mt-6">
      {explore ? (
        explore.map((tweet) => {
          return (
            <div key={tweet._id} className="p-2">
              <Tweet tweet={tweet} setData={setExplore} />
            </div>
          );
        })
      ) : (
        <Loader />
      )}
    </div>
  );
};
