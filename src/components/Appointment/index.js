import React from "react";
import { useEffect } from "react";
import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM_DELETE = "CONFIRM_DELETE";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
   }, [props.interview, transition, mode]);
   

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(res => {
        transition(SHOW);
      })
      .catch(err => {
        console.log(err);
        transition(ERROR_SAVE, true);
      });
  }
  
  const onCancelInterview = function() {
    console.log("On cancel - application component");
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(err => {
        console.log(err);
        transition(ERROR_DELETE, true);
      })
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          confirmCancel={() => transition(CONFIRM_DELETE)}
        />
      )}
      {mode === CONFIRM_DELETE && (
        <Confirm
          message="Delete the appointment?"
          onConfirm={onCancelInterview}
          onCancel={back}
        />
      )}
      {mode === SAVING && <Status message="Saving appointment"/>}
      {mode === ERROR_SAVE && <Error message="Could not save appointment." onClose={back} /> }
      {mode === DELETING && <Status message="Deleting" />}
      {mode === ERROR_DELETE && <Error message="Could not delete appointment." onClose={back} /> }
      {mode === CREATE && (
        <Form onSave={save} interviewers={props.interviewers} onCancel={back}/>
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
    </article>
  );
};