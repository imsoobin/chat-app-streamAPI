import React from "react";
import { AddChannel } from "../assets";

interface Props {
  children?: any;
  error: boolean;
  loading?: boolean;
  type?: string;
  isCreating?: boolean;
  setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateType?: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleContainer: any;
}

const TeamChannelList: React.FC<Props> = ({
  children,
  error = false,
  loading,
  type,
  isCreating,
  setIsCreating,
  setCreateType,
  setIsEditing,
  setToggleContainer,
}) => {
  if (error) {
    return type === "team" ? (
      <div className="team-channel-list">
        <div className="team-channel-list__message">
          Connection error, please wait a moment and try again.
        </div>
      </div>
    ) : null;
  }
  if (loading) {
    return (
      <div className="team-channel-list">
        <div className="team-channel-list__message loading">
          {type === "team" ? "Channels" : "Message"}loading...
        </div>
      </div>
    );
  }
  return (
    <div className="team-channel-list">
      <div className="team-channel-list__header">
        <p className="team-channel-list__header__title">
          {type === "team" ? "Channels" : "Direct Message"}
        </p>
        {/* Button add channels */}
        <AddChannel
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          type={type === "team" ? "team" : "messaging"}
          setToggleContainer={setToggleContainer}
        />
      </div>
      {children}
    </div>
  );
};
export default TeamChannelList;
