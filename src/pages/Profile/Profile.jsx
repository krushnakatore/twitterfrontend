import React from "react";
import { Leftsidebar } from "../../components/Leftsidebar/Leftsidebar";
import { Rightsidebar } from "../../components/Rightsidebar/Rightsidebar";

export const Profile = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      <div className="px-6">
        <Leftsidebar />
      </div>
      <div className="col-span-2 border-x-2 border-t-slate-800 px-6"></div>
      <div className="px-6">
        <Rightsidebar />
      </div>
    </div>
  );
};
