export const homeCoordinates = { latitude: 29.809449, longitude: -95.540523 };

export const getTileFromCoordinates = (longitude: number, latitude: number, zoom: number): { x: number, y: number } => {
  return {
    x: Math.floor((longitude+180)/360*Math.pow(2,zoom)),
    y: Math.floor((1-Math.log(Math.tan(latitude*Math.PI/180) + 1/Math.cos(latitude*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))
  }
}