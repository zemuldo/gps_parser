const momment = require('moment-timezone');

class gps_parser {
  constructor(gps_string) {
    this.gps_info = gps_string;
    this.validData = [];
    this.poles = ['N', 'S', 'E', 'W'];
  }

  getEncodingType() {
    let invalid = true;
    let valid = this.validate();
    let isVoid = true;
    let stri = this.gps_info;
    let arrayData = [];
    if (stri && (stri.match(',E,') || stri.match(',W,') || stri.match(',S,') || stri.match(',N,'))) {
      invalid = false;
      arrayData = stri.split(',');
      this.arrayData = arrayData;
    }

    if (valid && !invalid && this.arrayData.length > 8) {

      if (!stri.match(',V,')) {
        isVoid = false;
      }
      if (stri.match('GPGGA') || stri.match('GPRMC')) {
        return { encoding: 'nmea', isVoid: isVoid };
      } else if (stri.match('HQ')) {
        return { encoding: 'hqnmea', isVoid: isVoid };
      } else return { encoding: 'unknown', isVoid: isVoid };
    } else {
      return { encoding: 'invalid', isVoid: isVoid };
    }

  }

  validate() {
    if (!this.gps_info) {
      return { error: 'initialized parser with no string' };
    } else {
      return true;
    }
  }

  getPoles() {
    let poles = [];
    let valid_encoded = this.getEncodingType();
    if (this.arrayData && this.arrayData.length > 8 && !valid_encoded.isVoid && !valid_encoded.encoding !== 'invalid') {
      let i;
      for (i = 0; i < this.poles.length; i++) {
        if (this.arrayData.includes(this.poles[i])) {
          poles.push(this.poles[i]);
        }
      }
      if (i === this.poles.length) {
        return poles;
      }

    } else return { error: 'check your data' };
  }

  getLatitude(pole) {
    if (pole === 'S') {
      let raw = this.arrayData[this.arrayData.indexOf(pole) - 1];
      return 0-(Number(raw.slice(0, 2)) + Number(raw.slice(2, raw.length) / 60));
    } else {
      let raw = this.arrayData[this.arrayData.indexOf(pole) - 1];
      return Number(raw.slice(0, 2)) + Number(raw.slice(2, raw.length) / 60);
    }
  }
  getLongitude(pole) {
    if (pole === 'W') {
      let raw = this.arrayData[this.arrayData.indexOf(pole) - 1];
      return 0-(Number(raw.slice(0, 3)) + Number(raw.slice(3, raw.length) / 60));
    } else {
      let raw = this.arrayData[this.arrayData.indexOf(pole) - 1];
      return Number(raw.slice(0, 3)) + Number(raw.slice(3, raw.length) / 60);
    }
  }

  getSpeed(hPOle){
    let raw = this.arrayData[this.arrayData.indexOf(hPOle) + 1];
    return  1.852 * Number(raw);
    
  }
  getSpeedKmH(hPOle){
    let raw = this.arrayData[this.arrayData.indexOf(hPOle) + 1];
    return  1.852 * Number(raw);
    
  }
  getSpeedKnots(hPOle){
    let raw = this.arrayData[this.arrayData.indexOf(hPOle) + 1];
    return  Number(raw);
    
  }

  getDateArr(timezone){
    let poles = this.getPoles();
    let t = {};
    let rawT = this.arrayData[this.arrayData.indexOf(poles[0]) - 3];
    let rawD = this.arrayData[this.arrayData.indexOf(poles[1]) + 3];
    t.hour = Number(rawT.slice(0, 2)) + 3;
    t.minute = Number(rawT.slice(2, 4));
    t.seconds = Number(rawT.slice(4, 6));
    t.year = Number(rawD.slice(4, 6)) + 2000;
    t.month = Number(rawD.slice(2, 4));
    t.day = Number(rawD.slice(0, 2));
    return [t.year, t.month, t.day, t.hour, t.minute, t.seconds];
  }

  getDateISO(timezone){
    let poles = this.getPoles();
    let t = {};
    let rawT = this.arrayData[this.arrayData.indexOf(poles[0]) - 3];
    let rawD = this.arrayData[this.arrayData.indexOf(poles[1]) + 3];
    t.hour = Number(rawT.slice(0, 2)) + 3;
    t.minute = Number(rawT.slice(2, 4));
    t.seconds = Number(rawT.slice(4, 6));
    t.year = Number(rawD.slice(4, 6)) + 2000;
    t.month = Number(rawD.slice(2, 4));
    t.day = Number(rawD.slice(0, 2));
    return new Date(Date.parse(momment([t.year, t.month, t.day, t.hour, t.minute, t.seconds]).tz(timezone || 'Africa/Nairobi').format()));


  }

  decode() {
    let poles = this.getPoles();
    if ((poles[0] === 'N' || poles[0] === 'S') && (poles[1] === 'W' || poles[1] === 'E')) {
      return true;
    } else {
      return { error: 'data is void' };
    }
  }
}

module.exports = gps_parser;