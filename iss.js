const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  const url = 'https://api.ipify.org?format=json';
  // use request to fetch IP address from JSON API
  request(url, (error, response, body) => {
    // if the request succeeded, parse the JSON string into an object
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    try {
      const ip = JSON.parse(body).ip;
      callback(null, ip);
    } catch (error) {
      callback(error, null);
    }
  });
};

// const fetchCoordsByIP = function (ip, callback) {
//   const url = `https://ipvigilante.com/${ip}`;
//   request(url, (error, response, body) => {
//     if (error) {
//       callback(error, null);
//       return;
//     }

//     if (response.statusCode !== 200) {
//       const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
//       callback(Error(msg), null);
//       return;
//     }

//     try {
//       const { latitude, longitude } = JSON.parse(body).data;
//       callback(null, { latitude, longitude });
//     } catch (error) {
//       callback(error, null);
//     }
//   });
// };

const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error)
      return callback(
        'There has been an error retrieving coordinates: ' + error,
        null
      );

    if (response.statusCode !== 200) {
      callback(
        Error(
          `Status Code ${response.statusCode} when fetching coordinates: ${body}`
        ),
        null
      );
      return;
    }

    const lat = JSON.parse(body).data.latitude;
    const lon = JSON.parse(body).data.longitude;
    const coords = {
      lat: lat,
      lon: lon,
    };
    callback(null, coords);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(
    `http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.lon}`,
    (error, response, body) => {
      if (error)
        return callback(
          'There has been an error retrieving flyover times: ' + error,
          null
        );

      if (response.statusCode !== 200) {
        callback(
          Error(
            `Status Code ${response.statusCode} when fetching flyover times: ${body}`
          ),
          null
        );
        return;
      }

      const flyover = JSON.parse(body).response;
      callback(null, flyover);
    }
  );
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, flyover) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, flyover);
      });
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};
