export function getAppointmentsForDay(state, day) {
  const { days, appointments } = state;

  let matchingDay = days.find((dayObj) => dayObj.name === day);
  
  let res = [];
  if (typeof matchingDay === 'undefined') {
    return res;
  }
  for (const key in appointments) {
    if(matchingDay.appointments.includes(appointments[key].id)) {
      res.push(appointments[key]);
    }  
  }
  return res;
};

export function getInterview(state, interview) { 
  const { interviewers } = state;
  
  if (!interview) {
    return null;
  }

  for (const key in interviewers) {
    if (interviewers[key].id === interview.interviewer) {
      return {
        ...interview,
        interviewer: interviewers[key]
      }
    }
  }
};

export function getInterviewersForDay(state, day) {
  const { days, interviewers } = state;

  let matchingDay = days.find((dayObj) => dayObj.name === day)
  
  let res = [];
  if (typeof matchingDay === 'undefined') {
    return res;
  }
  for (const key in interviewers) {
    if(matchingDay.interviewers.includes(interviewers[key].id)) {
      res.push(interviewers[key]);
    }  
  }
  return res;
};