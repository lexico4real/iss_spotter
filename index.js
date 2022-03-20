// index.js
const {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
} = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned IP:', ip);
  return ip;
});

fetchCoordsByIP('102.89.32.146', (error, data) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned data:', data);
});

fetchISSFlyOverTimes(
  { latitude: '49.27670', longitude: '-123.13000' },
  (error, passTimes) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    console.log('It worked! Returned flyover times:', passTimes);
  }
);

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned flyover times:', passTimes);
});
