export function getAppointmentsForDay(state, day) {
  const { days, appointments } = state;

  let matchingDay = days.find((dayObj) => dayObj.name === day)
  
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
}

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
}

//I;m given an interview(that currently holds a student name and interviewer id)
// Want to return an object that replaces the interviewer id with a interviewer object
// We also want to return null as default
//check if given interview object interviewer id(for in through the interviewers object and check)
//if id === id within given interview obj, replace the id with the current interveiwer obj
