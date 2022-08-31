import React from "react";
import { Avatar, useChatContext } from "stream-chat-react";

interface Props {
  channel?: any;
  type?: string;
  setToggleContainer?: any;
  setIsCreating?: any;
  setIsEditing?: any;
  setActiveChannel?: any;
}

const TeamChannelPreview: React.FC<Props> = ({
  channel,
  type,
  setToggleContainer,
  setIsEditing,
  setIsCreating,
  setActiveChannel,
}) => {
  const { channel: activeChannel, client } = useChatContext();
  const ChannelPreview = () => {
    return (
      <p className="channel-preview__item">
        #{channel?.data?.name || channel?.data?.id}
      </p>
    );
  };

  const DirectPreview = () => {
    const members: any = Object.values(channel.state.members).filter(
      ({ user }: any) => user.id !== client.userID
    );

    return (
      <div className="channel-preview__item single">
        <Avatar
          image={members[0]?.user?.image}
          name={members[0]?.user?.fullName || members[0]?.user?.id}
          size={24}
        />
        <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
      </div>
    );
  };
  return (
    <div
      className={
        channel?.id === activeChannel?.id
          ? "channel-preview__wrapper__selected"
          : "channel-preview__wrapper"
      }
      onClick={() => {
        setIsCreating(false);
        setIsEditing(false);
        setActiveChannel(channel);
        if (setToggleContainer) {
          setToggleContainer((prev: any) => !prev);
        }
      }}
    >
      {type === "team" ? <ChannelPreview /> : <DirectPreview />}
    </div>
  );
};

export default TeamChannelPreview;
