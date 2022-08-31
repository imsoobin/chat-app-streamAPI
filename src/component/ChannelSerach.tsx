import React, { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import { SearchIcon } from "../assets";
import ResultsDropdown from "./ResultsDropdown";

const ChannelSerach: React.FC<any> = ({ setToggleContainer }) => {
  const { client, setActiveChannel }: any = useChatContext();
  const [query, setQuery] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [teamChannel, setTeamChannel] = useState([]);
  const [directChannel, setDirectChannel] = useState([]);

  useEffect(() => {
    if (!query) {
      setTeamChannel([]);
      setDirectChannel([]);
    }
  }, [query]);

  const getChannels = async (text: string) => {
    try {
      //fetch something
      const channelRes = client.queryChannels({
        type: "team",
        name: { $autocomplete: text },
        members: { $in: [client.userID] },
      });
      const userRes = client.queryUsers({
        id: { $ne: client.userID! },
        name: { $autocomplete: text },
      });

      const [channels, { users }] = await Promise.all([channelRes, userRes]);

      if (channels.length) {
        setTeamChannel(channels);
      }
      if (users.length) {
        setDirectChannel(users);
      }
    } catch (error) {
      setQuery("");
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setQuery(e.currentTarget.value);
    getChannels(e.currentTarget.value);
  };

  const setChannel = (channel: any) => {
    setQuery("");
    setActiveChannel(channel);
  };

  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-serach__input__icon">
          <SearchIcon />
        </div>
        <input
          className="channel-search__input__text"
          name="text"
          type={"text"}
          placeholder="Search"
          value={query}
          onChange={handleSearch}
        />
      </div>
      {query && (
        <ResultsDropdown
          teamChannel={teamChannel}
          directChannel={directChannel}
          isloading={isloading}
          setQuery={setQuery}
          setChannel={setChannel}
          setToggleContainer={setToggleContainer}
        />
      )}
    </div>
  );
};
export default ChannelSerach;
