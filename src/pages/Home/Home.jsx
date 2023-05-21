import React from "react";
import { Leftsidebar } from "../../components/Leftsidebar/Leftsidebar";
import { Rightsidebar } from "../../components/Rightsidebar/Rightsidebar";
import { Maintweets } from "../../components/Maintweets/Maintweets";

export const Home = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      <div className="px-6">
        <Leftsidebar />
      </div>
      <div className="px-6 col-span-2 border-x-2 bordert-slate-800 px-6">
        <Maintweets />
      </div>
      <div className="px-6">
        <Rightsidebar />
      </div>
    </div>
  );
};
