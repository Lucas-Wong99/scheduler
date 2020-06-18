import React from "react";
import './InterviewerListItem.scss';
import classNames from 'classnames';

export default function InterviewerListItem(props) {
  const { name, avatar, selected, setInterviewer} = props;

  const interviewerClass = classNames(
    "interviewers__item",
    {
      "interviewers__item--selected": selected,
    }
  );

  const interviewerImageClass = classNames(
    "interviewers__item",
    "interviewers__item-image",
    {
      "interviewers__item--selected-image": selected,
    }
  );

  return (
    <li className={interviewerClass} onClick={setInterviewer}>
  <img
    className={interviewerImageClass}
    src={avatar}
    alt={name}
  />
  {selected && name}
</li>
  );
};