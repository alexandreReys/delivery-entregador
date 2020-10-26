import apiNominatim from "./apiNominatim";

const reverseGeocoding = (latitude, longitude, callback) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

  var resp = {};
  apiNominatim.get(url).then((response) => {
    resp = response.data.address;
    return callback(resp);
  });
};

export default reverseGeocoding;

// exemplo de uso
// reverseGeocoding(-23.627212, -46.561431, (response) => {console.log(response)} );
// response = {
//   "city": "São Caetano do Sul",
//   "city_district": "São Caetano do Sul",
//   "country": "Brasil",
//   "country_code": "br",
//   "postcode": "09570-320",
//   "quarter": "Vila Paula",
//   "region": "Região Sudeste",
//   "road": "Avenida Tijucussu",
//   "state": "São Paulo",
//   "suburb": "Olímpico", }
