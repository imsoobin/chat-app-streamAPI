import React, { useState } from "react";
import { UserList } from "./";
import { CloseCreateChannel } from "../assets";
import { useChatContext } from "stream-chat-react";
interface Props {
  createType?: any;
  setIsCreating?: any;
}

interface Names {
  nameChange?: string;
  setNameChange: React.Dispatch<React.SetStateAction<string>>;
}
const ChangeNameInput: React.FC<Names> = ({ nameChange, setNameChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNameChange(e.currentTarget.value);
  };
  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input
        type="text"
        placeholder="New channel..."
        onChange={handleChange}
        value={nameChange}
      />
      <p>Add member</p>
    </div>
  );
};
const CreateChannel: React.FC<Props> = ({ createType, setIsCreating }) => {
  const { client, setActiveChannel } = useChatContext();
  const [selectedusers, setSelectedUsers] = useState<any>([
    client.userID || '',
  ]);
  const [nameChange, setNameChange] = useState<string>("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newChannel = await client.channel(createType, nameChange, {
        name: nameChange,
        members: selectedusers,
      });
      await newChannel.watch();
      setNameChange("");
      setIsCreating(false);
      setSelectedUsers([client?.userID]);
      setActiveChannel(newChannel);
    } catch (error) {
      console.log(error);
      return;
    }
  };
  return (
    <div className="create-channel__container">
      <div className="create-channel__header">
        <p>
          {createType === "team"
            ? "Create a New Channel"
            : "Send a Direct Message"}
        </p>
        <CloseCreateChannel setIsCreating={setIsCreating} />
      </div>
      {createType === "team" && (
        <ChangeNameInput
          nameChange={nameChange}
          setNameChange={setNameChange}
        />
      )}
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className="create-channel__button-wrapper" onClick={handleCreate}>
        <p>{createType === "team" ? "Create channel" : "Create group"}</p>
      </div>
    </div>
  );
};
export default CreateChannel;
