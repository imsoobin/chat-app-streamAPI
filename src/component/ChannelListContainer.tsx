import React, { useState } from "react";
import Cookies from "universal-cookie";
import { ChannelSerach, TeamChannelList, TeamChannelPreview } from "./";
import Hospital from "../assets/hospital.png";
import Logout from "../assets/logout.png";
import { ChannelList, useChatContext } from "stream-chat-react";

const cookies = new Cookies();

interface Props {
  LogoutFunc: () => void;
}
interface ChannelListContentState {
  isCreating?: boolean;
  setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateType?: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleContainer?: any;
}
interface ChannelListContainerState {
  isCreating?: boolean;
  setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateType?: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}
const SildeBar: React.FC<Props> = ({ LogoutFunc }) => {
  return (
    <div className="channel-list__sidebar">
      <div className="channel-list__sidebar__icon1">
        <div className="icon1__inner">
          <img src={Hospital} alt="Hospital" width="30" />
        </div>
      </div>
      <div className="channel-list__sidebar__icon2">
        <div className="icon1__inner">
          <img src={Logout} alt="Logout" width="30" onClick={LogoutFunc} />
        </div>
      </div>
    </div>
  );
};

const CompanyHeader: React.FC = () => {
  return (
    <div className="channel-list__header">
      <div className="channel-list__header__text">The header</div>
    </div>
  );
};

const customChannelTeam = (channels: any) => {
  return channels.filter((channel: any) => channel.type === "team");
};

const customChannelMessaging = (channels: any) => {
  return channels.filter((channel: any) => channel.type === "messaging");
};

const ChannelListContent: React.FC<ChannelListContentState> = ({
  isCreating,
  setIsCreating,
  setCreateType,
  setIsEditing,
  setToggleContainer,
}) => {
  const { client } = useChatContext();
  const LogoutFunc = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("userName");
    cookies.remove("fullName");
    cookies.remove("avatarUrl");
    cookies.remove("hashPassword");
    cookies.remove("phoneNumber");
    window.location.reload();
  };
  const filters: any = { members: { $in: [client.userID] } };
  return (
    <React.Fragment>
      <SildeBar LogoutFunc={LogoutFunc} />
      <div className="channel-list__list__wrapper">
        <CompanyHeader />
        <ChannelSerach setToggleContainer={setToggleContainer} />
        <ChannelList
          filters={filters}
          channelRenderFilterFn={customChannelTeam}
          List={(listprops: any) => (
            <TeamChannelList
              {...listprops}
              type="team"
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setCreateType={setCreateType}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              type="team"
              setToggleContainer={setToggleContainer}
              setIsCreating={setIsCreating}
              setIsEditing={setIsEditing}
            />
          )}
        />
        <ChannelList
          filters={filters}
          channelRenderFilterFn={customChannelMessaging}
          List={(listprops: any) => (
            <TeamChannelList
              {...listprops}
              type="messaging"
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setCreateType={setCreateType}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              type="messaging"
              setToggleContainer={setToggleContainer}
              setIsCreating={setIsCreating}
              setIsEditing={setIsEditing}
            />
          )}
        />
      </div>
    </React.Fragment>
  );
};

const ChannelListContainer: React.FC<ChannelListContainerState> = ({
  setIsCreating,
  setCreateType,
  setIsEditing,
}) => {
  const [toggleContainer, setToggleContainer] = useState<boolean>(false);
  return (
    <div className="channel-list__container">
      <ChannelListContent
        setIsCreating={setIsCreating}
        setCreateType={setCreateType}
        setIsEditing={setIsEditing}
      />
      <div
        className="channel-list__container-responsive"
        style={{
          left: toggleContainer ? "0%" : "-90%",
          backgroundColor: "#005fff",
        }}
      >
        <div
          className="channel-list__container-toggle"
          onClick={() => setToggleContainer((prev) => !prev)}
        ></div>
        <ChannelListContent
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          setToggleContainer={setToggleContainer}
        />
      </div>
    </div>
  );
};
export default ChannelListContainer;
