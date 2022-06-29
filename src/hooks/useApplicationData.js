//import { useState } from "react";
import { useReducer } from "react";
import { useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day:action.value };
    case SET_APPLICATION_DATA:
      const {days, appointments, interviewers} = action;
      return {...state, days, appointments, interviewers}
    case SET_INTERVIEW: {
      const {id, interview} = action;
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
  
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      return {...state, appointments, days: updateSpots(state, appointments, id)};
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }

  function updateSpots(state, appointments, id) {
    const newDays = state.days.map(day => {
      if (day.appointments.includes(id)) {
        const dayAppointments = day.appointments;
        const emptySpots = dayAppointments.filter(id => !appointments[id].interview);
        const spots = emptySpots.length;
        return { ...day, spots: spots };
      }
      return day;
    })
    return newDays;
  }
}


export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //const setDay = day => setState({ ...state, day });
  const setDay = day => dispatch({ type:SET_DAY, value: day });

  /* const setDays = (days) => {
    setState(prev => ({ ...prev, days }));
  }; */

  useEffect(() => {
    const GET_DAYS = "/api/days";
    const GET_APPOINTMENTS = "/api/appointments";
    const GET_INTERVIEWERS = "/api/interviewers";
    Promise.all([
      axios.get(GET_DAYS),
      axios.get(GET_APPOINTMENTS),
      axios.get(GET_INTERVIEWERS)
    ]).then((all) => {
      //setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
      dispatch({type:SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data})
    })
  }, []);

  function bookInterview(id, interview) {
    const api = `/api/appointments/${id}`;
    return axios.put(api, { interview })
      .then(res => {
        dispatch({type:SET_INTERVIEW, id, interview});
      });
  }

  function cancelInterview(id) {
    const api = `/api/appointments/${id}`;
    return axios.delete(api)
      .then(res => {
        dispatch({type:SET_INTERVIEW, id})
      });
  };



  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
};
