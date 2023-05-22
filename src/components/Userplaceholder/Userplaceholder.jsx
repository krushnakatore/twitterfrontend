import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

export const Userplaceholder = ({ setUserData, userData }) => {
  const { id } = useParams();
  const location = useLocation().pathname;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER}/user/find/${id}`
        );
        setUserData(userProfile.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [id]);

  return <div>{userData?.username}</div>;
};
