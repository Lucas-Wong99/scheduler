import { useEffect, useReducer } from "react";
import axios from "axios";

//importing in the reducer function that sets the state based on the action type
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

  //Sends a Get request to all three of these endpoints and calls dispatch to set state with the data
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
  //Submits a put request to this endpoint
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
      //On response we create a new appointments object with new interview data
      return dispatch({ 
        type: SET_INTERVIEW,
        appointments,
        id,
        days: updateSpotsForDay,
        interview
      }); 
    })
  }
  //Submits a delete request
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
      //On reponse creates a new appointment object with a null interview
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