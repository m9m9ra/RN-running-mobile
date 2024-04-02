
// example
// alert(calcCrow(54.71124420809773, 20.512098706572534, 54.72041610357387, 20.514191773350316).toFixed(1));



//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
export const pointToDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Converts numeric degrees to radians
    const toRad = (Value) => Value * Math.PI / 180;

    let R = 6371; // km
    let dLat = toRad(lat2-lat1);
    let dLon = toRad(lon2-lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;

    return d;
}
