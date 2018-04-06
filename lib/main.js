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
    if (pole ==='S') {
      return this.arrayData[this.arrayData.indexOf(pole)-1];
    } else {
      return this.arrayData[this.arrayData.indexOf(pole)-1];
    }
    // let data = o.split(',');
    // let tmpLat = Number(data[5].slice(0, 2)) + Number(data[5].slice(2, data[5].length) / 60);
    // let tmpLon = Number(data[7].slice(0, 3)) + Number(data[7].slice(3, data[7].length) / 60);
       
    // if (o.match('W')) {
    //     lon = 0 - tmpLon
    // } else {
    //     lon = tmpLon
    // }
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