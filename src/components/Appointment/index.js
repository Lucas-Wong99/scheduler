import React from "react";
import "./styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";    

  const initialMode = props.interview ? SHOW : EMPTY;

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {
        props.interview ?
        <Show 
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        // onEdit={props.onEdit}
        // onDelete={props.onDelete}
        />
        :
        <Empty
          // onAdd={props.onAdd}
        />
      }
    </article>
  );
} 