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