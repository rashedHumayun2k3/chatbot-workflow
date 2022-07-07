import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';

export default function RemarksUserWithAvatar(AadObjectId) {
  const { userInformation } = useSelector((state) => state.auth);
  const [remarksCreator, setRemarksCreator] = useState(null);
  useEffect(() => {
    if (userInformation) {
      const remarksCreatorObj = userInformation.find(
        (element) => element.AadObjectId === AadObjectId.AadObjectId,
      );
      if (remarksCreatorObj) {
        setRemarksCreator(remarksCreatorObj);
      }
    }
  }, [userInformation]);

  return (
      <>{
        remarksCreator
        && <>
        {
          (remarksCreator.imageUrl && remarksCreator.imageUrl !== '') ? <img src={remarksCreator.imageUrl} className="image-small"></img>
            : <Avatar name={remarksCreator.Name} size="24" round={true} />

        }
        </>
        }
    </>);
}
