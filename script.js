let distInfoData = document.getElementById('distInfoData');

var userX;
var userY;
var userZ; // earth radius: 3963 miles
const radius = 3963;
var issX;
var issY;
var issZ;
const issAlt = 4217; // avg ISS altitude: 254 miles, 4217 miles from earth center


window.onload = () => {
    getUserLocation();
}


// gets the iss coordinates and next passover from the open notify api
function issData() {
    fetch('http://api.open-notify.org/iss-now.json')
    .then(resp => resp.json())
    .then(issData => {
        issX = toRectX(issData.iss_position.latitude, issData.iss_position.longitude, issAlt);
        issY = toRectY(issData.iss_position.latitude, issData.iss_position.longitude, issAlt);
        issZ = toRectZ(issData.iss_position.latitude, issAlt);

        distInfoData.innerHTML = findDistance(userX, userY, userZ, issX, issY, issZ).toLocaleString('en') + " miles away";
    })
    .catch(function() {
		handleLocationError("Cannot access ISS location, ");
    })

    setTimeout(issData, 1500);
}

// makes a geolocation request, calculates distance, and fetches the next iss overhead pass
function getUserLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getUserPos = position => {
            userX = toRectX(position.coords.latitude, position.coords.longitude, radius);
            userY = toRectY(position.coords.latitude, position.coords.longitude, radius);
            userZ = toRectZ(position.coords.latitude, radius);
            issData();
        }, getUserErr);
    } else {
        handleLocationError("Location not supported, ");
    }
}

// determines which error, if any, occurred with geolocation
function getUserErr(err) {
    switch(err.code) {
        case err.PERMISSION_DENIED:
          handleLocationError("Location request was denied, ")
          break;
        case err.POSITION_UNAVAILABLE:
          handleLocationError("Location is currently unavailable, ")
          break;
        case err.TIMEOUT:
          handleLocationError("Location request timed out, ")
          break;
        default:
          handleLocationError("Location couldn't be found, an unknown error occurred, ")
          break;
    }
}

// displays appropriate error depending on if its a user geo error or data fetch error
function handleLocationError(errType) {
    distInfoData.style.fontSize = '25px';
    distInfoData.innerHTML = errType + "refresh the page and enable location to begin.";
    distInfoData.style.color = '#FF3333';
}

// gets linear distance to the iss
function findDistance(user_x, user_y, user_z, iss_x, iss_y, iss_z) {
    return Math.trunc((Math.sqrt((Math.pow((user_x-iss_x), 2) + Math.pow((user_y-iss_y), 2) + Math.pow((user_z-iss_z), 2)))));
}

//converts spherical coordinates to rectangular
function toRectX(lat, long, rad) {
    return (rad * Math.cos((lat*Math.PI / 180)) * Math.cos((long*Math.PI / 180)));
}

function toRectY(lat, long, rad) {
    return (rad * Math.cos((lat*Math.PI / 180)) * Math.sin((long*Math.PI / 180)));
}

function toRectZ(lat, rad) {
    return (rad * Math.sin((lat*Math.PI / 180)));
}