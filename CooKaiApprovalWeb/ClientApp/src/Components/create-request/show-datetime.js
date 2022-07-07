import React from 'react';
import * as moment from 'moment';

const ShowDateTime = (dateTimeValue) => {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const showDate = (value) => {
    const formatedDate = moment(new Date(value.dateTimeValue)).format('YYYY年 MM月 D日');
    const formatedTime = moment(new Date(value.dateTimeValue)).format('HH:mm');
    const formatedDayName = days[new Date(value.dateTimeValue).getDay()];

    return <div className="flex">
            <div>{formatedDate}</div>
            <div className="formated-day">({formatedDayName})</div>
            <div className="formated-time">{formatedTime}</div>
        </div>;
  };

  return <div>
        {!!dateTimeValue && !!dateTimeValue.dateTimeValue ? showDate(dateTimeValue) : null}
    </div>;
};

export default ShowDateTime;
