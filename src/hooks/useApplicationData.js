import { useEffect, useReducer } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "../reducers/application";

const useApplicationData = () => {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => { 
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(([days, appointments, interviewers]) => {
      dispatch({ 
        type: SET_APPLICATION_DATA,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data });
    })
  }, []);

  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:8001");

  //   ws.onmessage = function(event) {
  //     const data = JSON.parse(event.data)

  //     const appointment = {
  //       ...state.appointments[data.id],
  //       interview: { ...data.interview }
  //     };
  //     const appointments = {
  //       ...state.appointments,
  //       [data.id]: appointment
  //     };
  //     if (data.type === SET_INTERVIEW && data.interview !== null) {
        
  //       dispatch({ 
  //         type: SET_INTERVIEW,
  //         appointments,
  //         id: data.id,
  //         days: updateSpotsForDay,
  //         interview: data.interview
  //       });
  //     } else {
  //       dispatch({ 
  //         type: SET_INTERVIEW,
  //         appointments,
  //         id: data.id,
  //         days: updateSpotsForDay
  //       });
  //     }
  //   }
    
  //   // return () => {
  //   //   ws.close();
  //   // }
  // }, [state.appointments]);
 
  function updateSpotsForDay(id, days, appointments, interview) {
    return days.map((dayObj) => {
      //checks if there is already an interview value for a specific appointment id
      let interviewVal;
      if (appointments[id].interview === null) {
        interviewVal = null;
      }
      //checks if there appointment arr has the id, that the value of interview is not null, and if we are givin an interview object
      if (dayObj.appointments.includes(id) && interviewVal !== null && typeof interview !== "undefined") {
        return dayObj;
      } else if (dayObj.appointments.includes(id)){
        let spots = 0;
          spots = (typeof interview !== "undefined"? dayObj.spots -= 1 : dayObj.spots += 1);
          return { ...dayObj, spots }
      } else {
        return dayObj
      }
    });
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
      return dispatch({ 
        type: SET_INTERVIEW,
        appointments,
        id,
        days: updateSpotsForDay,
        interview
      }); 
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
      return dispatch({
        type: SET_INTERVIEW,
        appointments,
        id,
        days: updateSpotsForDay
      });
    })
  }
  
  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;