import { useState, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(([resDays, resAppointments, resInterviewers]) => {
      setState(prevState => ({
        ...prevState,
        days: resDays.data,
        appointments: resAppointments.data,
        interviewers: resInterviewers.data
      }))
    })
  }, []);

  function updateSpotsForDay(id, days, shouldDecrement) {

    return days.map((dayObj) => {
      if(dayObj.appointments.includes(id)) {
        let spots = 0;
        spots = (shouldDecrement ? dayObj.spots -= 1 : dayObj.spots += 1);
        return { ...dayObj, spots }
      } else {
        return dayObj;
      }
    })
  }

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, {
      interview
    })
    .then((response) => {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      setState({
        ...state,
        appointments,
        days: updateSpotsForDay(id, state.days, true)
      })
    })
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: null
        }
        const appointments  = {
          ...state.appointments,
          [id]: appointment
        }
        setState({
          ...state,
          appointments,
          days: updateSpotsForDay(id, state.days, false)
        })
      })
  }

  return { state, setDay, bookInterview, cancelInterview }

}

export default useApplicationData;