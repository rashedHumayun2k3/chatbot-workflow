import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { orderBy } from 'lodash';
import Laguage from '../utility/Language';
import ShowDateTime from '../create-request/show-datetime';

export default function RemarksHistory(props) {
  const { requestDetails } = useSelector((state) => state.request);
  const [requestRemarks, setRequestRemarks] = useState([]);
  const [selectedLang] = useState(Laguage.jap);

  useEffect(() => {
    if (requestDetails) {
      setRequestRemarks(requestDetails.RequestRemarks);
    }
  }, [requestDetails]);

  return (
    <>
      <div className="title-bolder padding-top-5px">
        {selectedLang.TitleRecentRemarks}
      </div>
      <div className="width-100p remarks-history-container">
        {
          requestRemarks && requestRemarks.length > 0
            ? orderBy(requestRemarks, 'Created', 'desc').map(
              (remarksObj, remarkIndex) => (
                <div key={remarkIndex} className="each-remarks-container ">
                  <div className="flex creator-container ui-userlist">
                    <div className="image-container">
                      {/* <RemarksUserWithAvatar
                        AadObjectId={remarksObj.CreatedBy.AadObjectId}
                      /> */}
                      <Avatar name={remarksObj.CreatedBy.Name} size="24" round={true} />
                    </div>
                    <div className="user-name-title text-ellipsis">
                      {remarksObj.CreatedBy.Name}
                    </div>
                    <div className="user-comment remarks-history-font">
                      <ShowDateTime dateTimeValue={remarksObj.Created} />
                    </div>
                  </div>
                  <div className="remarks-container ui-userlist">
                    <div className="user-comment remarks-font-style">{remarksObj.Remark}</div>
                  </div>
                </div>
              ),
            )
            : <div className='text-center-middle'>
              備考はありません
              </div>
        }
      </div>
    </>
  );
}
