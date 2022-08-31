import React, { useEffect, useState } from "react";
import { Avatar, useChatContext } from "stream-chat-react";

import { InviteIcon } from "../assets";

const ListContainer: React.FC<any> = ({ children }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserItem: React.FC<any> = ({ user, setSelectedUsers }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const handleActive = () => {
    if (isActive) {
      setSelectedUsers((prevUsers: any) =>
        prevUsers.filter((prevUser: any) => prevUser !== user.id)
      );
    } else {
      setSelectedUsers((prevUsers: any) => [...prevUsers, user.id]);
    }
    setIsActive((prev) => !prev);
  };
  return (
    <div className="user-item__wrapper" onClick={handleActive}>
      <div className="user-item__name-wrapper">
        <Avatar
          image={user?.image}
          name={user?.fullName || user?.id}
          size={30}
        />
        <p className="user-item__name">{user?.fullName || user?.id}</p>
      </div>
      {isActive ? (
        <InviteIcon />
      ) : (
        <div className="user-item__invite-empty"></div>
      )}
    </div>
  );
};

const UserList: React.FC<any> = ({ setSelectedUsers }) => {
  const { client } = useChatContext();
  const [users, setusers] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    const getusers = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const rs: any = await client.queryUsers(
          { id: { $ne: client.userID! } },
          { id: 1 },
          { limit: 8 }
        );
        if (rs.users.length) {
          setusers(rs.users);
        } else {
          setIsEmpty(true);
        }
      } catch (error) {
        setError(true);
        console.log(error);
        return;
      }
      setIsLoading(false);
    };
    if (client) getusers();
    // eslint-disable-next-line
  }, []);

  if (isEmpty) {
    return (
      <ListContainer>
        <div className="user-list__message">No user found.</div>
      </ListContainer>
    );
  }
  if (error) {
    return (
      <ListContainer>
        <div className="user-list__message">Error loading, pls try again!</div>
      </ListContainer>
    );
  }
  return (
    <ListContainer>
      {isLoading ? (
        <div className="user-list__message">Loading...</div>
      ) : (
        users?.map((user: any, idx: number) => (
          <UserItem
            index={idx}
            key={user?.id}
            user={user}
            setSelectedUsers={setSelectedUsers}
          />
        ))
      )}
    </ListContainer>
  );
};

export default UserList;
