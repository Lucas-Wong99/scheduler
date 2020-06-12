import React from "react";
import "./styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true)
    return props.bookInterview(props.id ,interview)
      .then(() => {
        transition(SHOW)
      })
  }

  function onDelete() {
    transition(CONFIRM);
  }

  function onConfirmDelete(){
    transition(DELETING, true);
    return props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY)
      })
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={transition} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={transition}
          onDelete={onDelete}
        />
      )}
      {mode === SAVING && <Status message={SAVING}/>}
      {mode === DELETING && <Status message={DELETING}/>}
      {mode === CONFIRM && (
        <Confirm 
          onCancel={back}
          onConfirm={onConfirmDelete}
          message="Are you sure you would like to delete?"
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={[...props.interviewers]}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={[...props.interviewers]}
          onCancel={back}
          onSave={save}
        />
      )}
    </article>
  );
}