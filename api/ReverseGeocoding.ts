interface GetNearestCityPayload {
  latitude: number;
  longitude: number;
  setCity: (city: string) => void;
}

//https://www.bigdatacloud.com/geocoding-apis/free-reverse-geocode-to-city-api
export const getNearestCity = (payload: GetNearestCityPayload): Promise<void> => {
  const { latitude, longitude } = payload;
  return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
    .then((response) => response.json())
    .then((json: { city: string }) => {
      payload.setCity(json.city);
    })
    .catch((error) => {
      console.log(error);
      payload.setCity("Unknown Location");
    })
}