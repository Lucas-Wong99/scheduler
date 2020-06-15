import React from "react";
import "./styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    return props.bookInterview(props.id ,interview)
      .then(() => {
        transition(SHOW);
      })
      .catch(() => {
        transition(ERROR_SAVE, true);
      })
  };

  function destroy(){
    transition(DELETING, true);
    return props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(() => {
        transition(ERROR_DELETE, true);
      })
  };

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={transition} />}
      {mode === SAVING && <Status message={SAVING}/>}
      {mode === DELETING && <Status message={DELETING}/>}
      {mode === ERROR_SAVE && <Error onClose={back} message={ERROR_SAVE}/>}
      {mode === ERROR_DELETE && <Error onClose={back} message={ERROR_DELETE}/>}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={transition}
          onDelete={transition}
        />
      )}
      {mode === CONFIRM && (
        <Confirm 
          onCancel={back}
          onConfirm={destroy}
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