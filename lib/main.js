const momment = require('moment-timezone');
const https = require('https');

const { getPoles, getEncodingType, getLatitude, getLongitude, getSpeedKMH, getSpeedKnots, GetDateTime, getDateArr, GetDateTimeLocale } = require('./util');

const initialState = {
  arrayData: [],
  encoding: 'invalid',
  isVoid: true,
  poles: []
};
class gps_parser {
  constructor(raw) {
    this.arrayData = [],
    this.encoding = 'invalid',
    this.isVoid = true,
    this.poles = [];
    if (raw) {
      this.raw = raw;
      let state = getEncodingType(raw);
      this.isVoid = state.isVoid,
      this.encoding = state.encoding;
      this.arrayData = state.arrayData;
      this.poles = getPoles(raw.split(','));
      this.latitude = getLatitude(this.poles[0], this.arrayData);
      this.longitude = getLongitude(this.poles[1], this.arrayData);
      this.speedkmh = getSpeedKMH(this.poles[1], this.arrayData);
      this.speedknots = getSpeedKnots(this.poles[1], this.arrayData);
      this.date = GetDateTime(this.poles, this.arrayData);
      this.dateArray = getDateArr(this.poles, this.arrayData);
      this.ownDate = GetDateTimeLocale(this.poles, this.arrayData);
    }
  }

  getRangeFromKnow(lat2, lon2) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - this.latitude) * p) / 2 +
      c(this.latitude * p) * c(lat2 * p) *
      (1 - c((lon2 - this.longitude) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  reverseGeoLocGoogle(api_key) {
    return new Promise((resolve, reject) => {
      https.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=${api_key}`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data).results);
        });

      }).on('error', (err) => {
        reject({ error: err });
      });
    });
  }
}

module.exports = gps_parser;