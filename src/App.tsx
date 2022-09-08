import React, { useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { ChannelContainer, ChannelListContainer, Auth } from "./component";
import "stream-chat-react/dist/css/index.css";
import "./App.css";
import ModalCall from "./modal";
import { useAppSelector } from "./hooks/hook";

const cookies = new Cookies();
const api_key: any = process.env.REACT_APP_API_KEY;
const client: any = StreamChat.getInstance(api_key);
const authToken: string = cookies.get("token");

if (authToken) {
  client.connectUser(
    {
      id: cookies.get("userId"),
      name: cookies.get("userName"),
      fullName: cookies.get("fullName"),
      image: cookies.get("avatarUrl"),
      hashPassword: cookies.get("hashPassword"),
      phoneNumber: cookies.get("phoneNumber"),
    },
    authToken
  );
}

const App: React.FC = () => {
  const [createType, setCreateType] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const isOpen = useAppSelector((state) => state.actionEvt.isOpen)
  if ((authToken === undefined && authToken === null) || !authToken)
    return <Auth />;
  return (
    <>
      <div className="app__wrapper">
        <Chat client={client} theme="team light">
          <ChannelListContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setCreateType={setCreateType}
            setIsEditing={setIsEditing}
          />
          <ChannelContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            createType={createType}
          />
        </Chat>
      </div>
      {isOpen && <ModalCall />}
    </>
  );
};

export default App;
