import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  const setDays = (days) => {
    setState(prev => ({ ...prev, days }));
  };

  useEffect(() => {
    const GET_DAYS = "/api/days";
    const GET_APPOINTMENTS = "/api/appointments";
    const GET_INTERVIEWERS = "/api/interviewers";
    Promise.all([
      axios.get(GET_DAYS),
      axios.get(GET_APPOINTMENTS),
      axios.get(GET_INTERVIEWERS)
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
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
    const api = `/api/appointments/${id}`;
    return axios.put(api, { interview })
      .then(res => {
        /*  setState({
           ...state,
           appointments
         }); */
        const days = updateSpots(state, appointments, id)
        setState({
          ...state,
          days,
          appointments,
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
        const days = updateSpots(state, appointments, id)
        setState({
          ...state,
          days,
          appointments,
        });
        //setState({...state, appointments})
      });
  };

  function updateSpots(state, appointments, id) {
    const newDays = state.days.map(day => {
      if (day.appointments.includes(id)) {
        const dayAppointments = day.appointments;
        const emptySpots = dayAppointments.filter(id => !appointments[id].interview);
        const spots = emptySpots.length;
        //const newSpots = isPlus ? day.spots + 1 : day.spots - 1;
        return { ...day, spots: spots };
      }
      return day;
    })
    return newDays;
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
};
