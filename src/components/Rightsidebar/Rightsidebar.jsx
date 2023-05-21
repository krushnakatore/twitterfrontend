import React from "react";
import { TwitterTimelineEmbed, TwitterVideoEmbed } from "react-twitter-embed";

export const Rightsidebar = () => {
  return (
    <div style={{ width: "35vh" }}>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="saurabhnemade"
        options={{ height: 400 }}
        style={{ width: "30%" }}
      />
      <TwitterVideoEmbed
        id={"560070183650213889"}
        // options={{ height: 100, width: 100 }}
      />
    </div>
  );
};
