import React, { useState } from 'react';
import * as moment from 'moment';
import MappleToolTip from 'reactjs-mappletooltip';
import ShowUserAvatar from '../create-request/show-user-avatar';
import Laguage from '../utility/Language';

const ApproverReaderUserList = (props) => {
  const { userList, title, isApprover } = props;
  const [selectedLang] = useState(Laguage.jap);
  const generateKey = (pre) => `${pre}_${new Date().getTime()}`;

  const showResponse = (user) => <div>
     {
        user.ResponseDate
        && <div className='user-comment'>
            {
                moment(user.ResponseDate).format('YYYY/MM/DD HH:mm')
            }
        </div>
    }
    {
        user.Comment
        && user.Comment.length > 50 ? <MappleToolTip>
        <div className='user-comment'>
            {`${user.Comment.substring(0, 50)}...`}
        </div>
        <div className='user-comment'>
            {user.Comment}
        </div>
        </MappleToolTip> : 
         <div className='user-comment'>
             {user.Comment}
        </div>
    }
 </div>;
  return <div className="user-list-container">
        <div className="user-list-with-photo">
            <ul className="ui-userlist">
                {userList
                    && userList.map((user, i) => <li className='people-list' key={generateKey(user.Name) + i}>
                            <div className="profile-row">
                                <ShowUserAvatar requestCreator={user} />
                                {
                                     isApprover === true
                                     && <div>
                                    {
                                        user.HasApproved != null ? user.HasApproved
                                          ? <div className="answer-status approved">{selectedLang.ApprovedApproval}</div>
                                          : <div className="answer-status rejected">{selectedLang.RejectedApproval}</div> : null
                                    }
                                </div>
                                }

                            </div>
                            {
                             isApprover === true && showResponse(user)
                            }

                        </li>)
                }
            </ul>
        </div>
    </div>;
};

export default ApproverReaderUserList;
