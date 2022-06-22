import React from "react";
import classNames from "classnames";

import "components/InterviewerListItem.scss";

function InterviewerListItem(props) {
  const handleClick = function() {
    props.setInterviewer();
  };

  const interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });
  return (
    <li className={interviewerClass} onClick={handleClick}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
};

export default InterviewerListItem;