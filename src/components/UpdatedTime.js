import React from 'react';
import moment from "moment";

let UpdatedTime = ({ time }) => {
    return (
        <span>
      <i>
        Lần cập nhập cuối: <b>{moment.unix(time).format("DD/MM/YYYY h:mm:ss a")}</b>
      </i>
    </span>
    );
};

export default UpdatedTime;
