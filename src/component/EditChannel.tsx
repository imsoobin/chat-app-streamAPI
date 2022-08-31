import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { UserList } from "./";
import { CloseCreateChannel } from "../assets";

interface Props {
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>> | any;
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
      <input type="text" onChange={handleChange} value={nameChange} />
      <p>Add member</p>
    </div>
  );
};
const EditChannel: React.FC<Props> = ({ setIsEditing }) => {
  const { channel }: any = useChatContext();

  const [nameChange, setNameChange] = useState<string>(channel?.data?.name);
  const [selectedusers, setSelectedUsers] = useState<any>([]);

  const handleSaveChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const changed = nameChange !== (channel?.data?.name || channel?.data?.id);
    if (changed) {
      await channel.update(
        { name: nameChange },
        { text: `Channel name changed to ${nameChange}` }
      );
    }
    if (selectedusers.length) {
      await channel?.addMembers(selectedusers);
    }
    setIsEditing(false);
    setNameChange("");
    setSelectedUsers([]);
  };
  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
        <p>Edit Channel</p>
        <CloseCreateChannel setIsEditing={setIsEditing} />
      </div>
      <ChangeNameInput nameChange={nameChange} setNameChange={setNameChange} />
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className="edit-channel__button-wrapper" onClick={handleSaveChange}>
        <p>Save changes</p>
      </div>
    </div>
  );
};
export default EditChannel;
