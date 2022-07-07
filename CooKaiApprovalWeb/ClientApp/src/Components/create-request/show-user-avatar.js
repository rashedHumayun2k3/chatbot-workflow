import React from 'react';
import Avatar from 'react-avatar';

const ShowUserAvatar = (props) => {
  const { requestCreator, IsNonEditable } = props;

  return <div className="flex creator-container">
        <div className="image-container">
            {
                requestCreator.imageUrl
                  ? <img src={requestCreator.imageUrl} className="image-small"></img>
                  : <Avatar name={requestCreator.Name} size="24" round={true} />
            }
        </div>
        <div className={`user-name-title text-ellipsis ${IsNonEditable ? 'non-editable-color' : ''}`}>
            {requestCreator.Name}
        </div>
    </div>;
};

export default ShowUserAvatar;
