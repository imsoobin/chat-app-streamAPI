import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { CloseCreateChannel } from "../assets";
import { useAppDispatch } from "../hooks/hook";
import { showUserEdit } from "../redux/reducer";

interface Names {
  urlAvatar?: string;
  setUrlAvatar: React.Dispatch<React.SetStateAction<string>>;
}
const ChangeNameInput: React.FC<Names> = ({ urlAvatar, setUrlAvatar }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUrlAvatar(e.currentTarget.value);
  };
  return (
    <div className="channel-name-input__wrapper">
      <p>Avatar URL</p>
      <input type="text" onChange={handleChange} value={urlAvatar} />
      <p></p>
    </div>
  );
};
const EditUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const { client }: any = useChatContext();

  const [urlAvatar, setUrlAvatar] = useState<string>(client?.user?.image);

  const handleSaveChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const changed = urlAvatar !== (client?.user?.image || client?.user?.id);
    if (changed) {
      await client.partialUpdateUsers([
        {
          id: client?.userID,
          set: { image: urlAvatar },
        },
      ]);
    }
    dispatch(showUserEdit(false));
  };
  const handleCloseEditUser = () => {
    return dispatch(showUserEdit(false));
  };
  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
        <p>Edit User</p>
        <div onClick={handleCloseEditUser}>
          <CloseCreateChannel />
        </div>
      </div>
      <ChangeNameInput urlAvatar={urlAvatar} setUrlAvatar={setUrlAvatar} />
      <div className="edit-channel__button-wrapper" onClick={handleSaveChange}>
        <p>Save</p>
      </div>
    </div>
  );
};
export default EditUser;
