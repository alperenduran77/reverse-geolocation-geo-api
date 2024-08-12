const { format, parseISO } = require('date-fns');

const formatRoute = (data) => {
  if (!data.routes || data.routes.length === 0) {
    throw new Error('No route data available');
  }

  const route = data.routes[0];
  const { summary, legs } = route;
  const { departureTime, arrivalTime, lengthInMeters, travelTimeInSeconds, trafficDelayInSeconds } = summary;

  const formattedDepartureTime = format(parseISO(departureTime), 'PPpp');
  const formattedArrivalTime = format(parseISO(arrivalTime), 'PPpp');

  const points = legs[0].points.map((point) => ({
    latitude: point.latitude,
    longitude: point.longitude,
  }));

  return {
    lengthInMeters,
    travelTimeInSeconds,
    trafficDelayInSeconds,
    departureTime: formattedDepartureTime,
    arrivalTime: formattedArrivalTime,
    
  };
};

module.exports = formatRoute;
