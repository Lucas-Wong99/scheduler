import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
// const SET_DAYS = "SET_DAYS";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.day}
      // case SET_DAYS:
      //   return {...state, days: action.days}
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        }
      case SET_INTERVIEW: {
        return {
          ...state,
          appointments: action.appointments,
          days: action.days(action.id, state.days, state.appointments, action.interview)
        }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

const useApplicationData = () => {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })
  console.log(state)
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
  //   axios.get("/api/days")
  //   .then(res => {
  //     dispatch({type: SET_DAYS, days: res.data})
  //   }) 
  // }, [state])

  // function updateSpotsForDay(id, days, interview) {
  //   return days.map((dayObj) => {
  //     if(dayObj.appointments.includes(id)) {
  //       const currentSpots = dayObj.spots
  //       if (currentSpots === 0 && typeof interview !== "undefined") {
  //         return dayObj
  //       } else {
  //         let spots = 0;
  //         spots = (typeof interview !== "undefined"? dayObj.spots -= 1 : dayObj.spots += 1);
  //         return { ...dayObj, spots }
  //       }
  //     } else {
  //       return dayObj;
  //     }
  //   })
  // };

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
      
    })
  }

  // console.log(updateSpotsForDay(1, state.days, state.appointments, {interview: 0}))

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