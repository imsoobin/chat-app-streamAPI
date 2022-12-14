import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import {
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelActionContext,
  Avatar,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";

import { ChannelInfo } from "../assets";
import { useAppDispatch } from "../hooks/hook";
import { toggleModal } from "../redux/reducer";
import { VideoIcon } from "./VideoIcon";

export const GiphyContext = React.createContext({});

interface Props {
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChannelInner: React.FC<Props> = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState<boolean>(false);
  const { sendMessage } = useChannelActionContext();

  const overrideSubmitHandler = (message: any) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };

    if (giphyState) {
      updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
    }

    if (sendMessage) {
      sendMessage(updatedMessage);
      setGiphyState(false);
    }
  };

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <div style={{ display: "flex", width: "100%" }}>
        <Window>
          <TeamChannelHeader setIsEditing={setIsEditing} />
          <MessageList />
          <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  );
};

const TeamChannelHeader = ({ setIsEditing }: any) => {
  const { channel, watcher_count }: any = useChannelStateContext();
  const { client }: any = useChatContext();
  const dispatch = useAppDispatch();

  const MessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }: any) => user.id !== client.userID
    );

    const additionalMembers = members.length - 3;

    if (channel.type === "messaging") {
      return (
        <div className="team-channel-header__name-wrapper">
          {members.map(({ user }: any, i: number) => (
            <div key={i} className="team-channel-header__name-multi">
              <Avatar
                image={user?.image}
                name={user.fullName || user.id}
                size={32}
              />
              <p className="team-channel-header__name user">
                {user.fullName || user.id}
              </p>
            </div>
          ))}

          {additionalMembers > 0 && (
            <p className="team-channel-header__name user">
              and {additionalMembers} more
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="team-channel-header__channel-wrapper">
        <p className="team-channel-header__name"># {channel?.data?.name}</p>
        <span style={{ display: "flex" }} onClick={() => setIsEditing(true)}>
          <ChannelInfo />
        </span>
      </div>
    );
  };

  const getWatcherText = (watchers: any) => {
    if (!watchers) return "No users online";
    if (watchers === 1) return "1 online";
    return `${watchers} online`;
  };

  const handleLeaveGroup = async () => {
    await channel?.removeMembers([client?.userID], {
      text: `${client?.user?.name} leaved group`,
    });
  };

  const handleDeleteChannel = async () => {
    if (
      client?.user?.name === "admin" ||
      channel?.data?.created_by?.id === client?.userID
    ) {
      await channel.delete();
    } else {
      return alert("You are not admin or user created");
    }
  };
  const handleOpenModal = () => {
    return dispatch(toggleModal(true));
  };
  return (
    <div className="team-channel-header__container">
      <MessagingHeader />
      <div className="team-channel-header__right">
        <Button onClick={handleOpenModal}>
          <VideoIcon />
        </Button>
        <p className="team-channel-header__right-text">
          {getWatcherText(watcher_count)}
        </p>
        <button className="button-channel__top" onClick={handleLeaveGroup}>
          Leave
        </button>
        {channel?.type === "team" ? (
          <button className="button-channel__top" onClick={handleDeleteChannel}>
            Delete channel
          </button>
        ) : (
          <button className="button-channel__top" onClick={handleDeleteChannel}>
            Delete group
          </button>
        )}
      </div>
    </div>
  );
};

export default ChannelInner;
