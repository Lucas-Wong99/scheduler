import React from "react";
import 'components/DayListItem.scss';
import classNames from 'classnames';

export default function DayListItem(props) {
  let dayClass = classNames(
    'daylist',
    '&__item',
    {
      '&--selected' : props.selected,
      '&--full' : props.spots === 0,
    }
  );

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{props.spots}</h3>
    </li>
  );
}