import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import DayList from "./DayList";
import Appointment from "./Appointment";

import "components/Application.scss";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

/* const days = [
  {
    id: 1,
    name: "Monday",
    spots: 2,
  },
  {
    id: 2,
    name: "Tuesday",
    spots: 5,
  },
  {
    id: 3,
    name: "Wednesday",
    spots: 0,
  },
];

const appointments = {
  "1": {
    id: 1,
    time: "12pm",
  },
  "2": {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer:{
        id: 3,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  "3": {
    id: 3,
    time: "2pm",
  },
  "4": {
    id: 4,
    time: "3pm",
    interview: {
      student: "Archie Andrews",
      interviewer:{
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg",
      }
    }
  },
  "5": {
    id: 5,
    time: "4pm",
  }
};
 */

export default function Application(props) {
  /* const [day, setDay] = useState("Monday");
  const [days, setDays] = useState([]); */

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {},
    interviewers: {}
  });

  //Add the line below:
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  const setDay = day => setState({ ...state, day });

  const setDays = (days) => {
    setState(prev => ({ ...prev, days }));
  };
  
  useEffect(() => {
    const GET_DAYS = "/api/days";
    const GET_APPOINTMENTS = "/api/appointments";
    const GET_INTERVIEWERS = "/api/interviewers";
    /* axios.get(GET_DAYS)
      .then(response => {
        console.log(response);
        setDays(response.data);
      }) */
    Promise.all([
      axios.get(GET_DAYS),
      axios.get(GET_APPOINTMENTS),
      axios.get(GET_INTERVIEWERS)
    ]).then((all) => {
      // set your states here with the correct values...
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
  }, []);

  function bookInterview(id, interview) {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    /* setState({
      ...state,
      appointments
    }); */
    const api = `/api/appointments/${id}`;
    return axios.put(api, {interview})
      .then(res => {
        setState({
          ...state,
          appointments
        });
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const api = `/api/appointments/${id}`;
    return axios.delete(api)
      .then(res => {
        console.log("Put successfull");
        //setState({...state, appointments})
      });
  }
  

  //const schedule = Object.values(appointments).map(appointment => {
  const schedule = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDay(state, state.day);
    return <Appointment 
        key={appointment.id} 
        id={appointment.id} 
        time={appointment.time} 
        interview={interview}
        interviewers={interviewers} 
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
      <DayList 
        days={state.days} 
        value={state.day} 
        onChange={setDay} 
      />

      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />

      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
