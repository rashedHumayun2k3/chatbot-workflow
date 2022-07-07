import React from 'react';
import Avatar from 'react-avatar';

function ProfileWithAvatar(props) {
  const { name } = props;
  return (
    <div className="person-container-parent">
      <div className="person-container">
        <div name={name} className="flex logo-with-text">
          <div className="avatar-container">
            <Avatar name={name} size="24" round={true} />
          </div>
          <div className="person-details">
            <div className="name-container">
              <div className="name-text">{name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileWithAvatar;
