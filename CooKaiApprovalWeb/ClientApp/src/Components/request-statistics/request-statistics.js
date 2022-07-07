import React, { useState, useEffect } from 'react';
import UnproccessedIcon from '@material-ui/icons/gavel';
import { useDispatch, useSelector } from 'react-redux';
import * as moment from 'moment';
import { Icon } from 'office-ui-fabric-react';
import Laguage from '../utility/Language';

const RequestStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [selectedLang] = useState(Laguage.jap);
  const { requestStats } = useSelector((state) => state.dashboard);
  useEffect(() => {
    if (requestStats) {
      setStatistics(requestStats);
    }
  }, [requestStats]);

  return (
        <div>
             <div className="requestListContainer">
                <div className="requestSearchContainer">
 		            <div className="searchWrapper">
                     <div className="statisticsContainer">
                        <div className="leftContainer stat">
                            <div className="totalStatBlock">
                                <div className="leftStatLabel">
                                <label><Icon iconName="DietPlanNotebook" className='hide' /> {selectedLang.TotalRequested}: {statistics.Requested}</label>
                                </div>
                                <div className="rightStatLabel">
                                    <Icon iconName="SkypeCircleClock" /> <label> {selectedLang.AverageApprovedRequested}:
                                    {
                                        statistics.AverageApproved > 0 ? parseFloat(statistics.AverageApproved).toFixed(2) : 0.00
                                    }</label>
                                </div>
                            </div>
                            <div className="statisticsBlock">
                                <label className="awaiting"><Icon iconName="SkypeCircleClock" /> {selectedLang.AwaitingApproval}</label>
                                <p className="awaiting">{statistics.Awaiting}</p>
                            </div>
                            <div className="statisticsBlock">
                                <label className="approved"><Icon iconName='SkypeCircleCheck' /> {selectedLang.ApprovedApproval}</label>
                                <p className="approved">{statistics.Approved}</p>
                            </div>
                            <div className="statisticsBlock">
                                <label className="rejected"><Icon iconName="SkypeCircleMinus" /> {selectedLang.RejectedApproval}</label>
                                <p className="rejected">{statistics.Rejected}</p>
                            </div>
                        </div>
                    <div className="divider"></div>
                    <div className="rightContainer stat">
                        <div className="totalStatBlock">
                            <div className="leftStatLabel">
                                <label><Icon iconName="DietPlanNotebook" className='hide' /> {selectedLang.TotalRequestedByApprover}:  {statistics.ApproverTotalRequested}</label>
                            </div>
                            <div className="rightStatLabel">
                                <Icon iconName="SkypeCircleClock" /> <label> {selectedLang.AverageApprovedByApprover}:
                                {
                                statistics.ApproverAverageApproved > 0 ? parseFloat(statistics.ApproverAverageApproved).toFixed(2) : 0.00
                                }</label>
                            </div>
                        </div>
                    <div className="statisticsBlock">
                        <label className="pending"><UnproccessedIcon className='unprocessed processed-rejected-icon' /> {selectedLang.PendingApproval}</label>
                        <p className="pending">{statistics.ApproverPending}</p>
                    </div>
                    <div className="statisticsBlock">
                        <img className='processed' src="../../../Content/custom-icons/processed.PNG" height='20px' /> <label className="return">  {selectedLang.ApprovedByApprover}</label>
                        <p className="average return"><b> {statistics.ApproverTotalAnswered}</b></p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  );
};
export default RequestStatistics;
