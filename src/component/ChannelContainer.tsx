import React from "react";
import { Channel } from "stream-chat-react";
import { useAppSelector } from "../hooks/hook";
import { ChannelInner, CreateChannel, EditChannel, Edituser } from "./";

interface Props {
  isCreating?: boolean;
  setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing?: boolean;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  createType?: string;
}

const ChannelContainer: React.FC<Props> = ({
  isCreating,
  setIsCreating,
  isEditing,
  setIsEditing,
  createType,
}) => {
  // const { channel } = useChatContext();
  const isUserEdit = useAppSelector((state) => state.actionEvt.showUser);
  if (isUserEdit) {
    return (
      <div className="channel__container">
        <Edituser />
      </div>
    );
  }
  if (isCreating) {
    return (
      <div className="channel__container">
        <CreateChannel createType={createType} setIsCreating={setIsCreating} />
      </div>
    );
  }
  if (isEditing) {
    return (
      <div className="channel__container">
        <EditChannel setIsEditing={setIsEditing} />
      </div>
    );
  }
  const EmptyState = () => {
    return (
      <div className="channel-empty__container">
        <p className="channel-empty__first">
          This is the beginning of your chat history.
        </p>
        <p className="channel-empty__second">
          Send messages, attachments, links, emojis, and more!
        </p>
      </div>
    );
  };
  return (
    <div className="channel__container">
      <Channel
        EmptyStateIndicator={EmptyState}
        // Message={(mess, i) => <MessageTeam key={i} {...mess} />}
      >
        <ChannelInner setIsEditing={setIsEditing} />
      </Channel>
    </div>
  );
};
export default ChannelContainer;
