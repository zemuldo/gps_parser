const getPoles = (arrayData) => {
  let poles = ['N', 'S', 'E', 'W'];
  let validPoles = [];
  let i;
  for (i = 0; i < poles.length; i++) {
    if (arrayData.includes(poles[i])) {
      validPoles.push(poles[i]);
    }
  }
  if (i === poles.length) {
    return validPoles;
  }
};

const getEncodingType = (stri) => {
  let final = {
    arrayData: stri ? stri.split(',') : [],
    encoding: 'invalid',
    isVoid: true
  };
  let invalid = true;
  let isVoid = true;
  if (stri && (stri.match(',E,') || stri.match(',W,') || stri.match(',S,') || stri.match(',N,'))) {
    invalid = false;
  }

  if (stri && !invalid && stri.split(',').length > 8) {

    if (!stri.match(',V,')) {
      final.isVoid = false;
    }
    if (stri.match('GPGGA') || stri.match('GPRMC')) {
      final.encoding = 'nmea';
      return final;
    } else if (stri.match('HQ')) {
      final.encoding = 'hqnmea';
      return final;
    } else {
      final.encoding = 'unknown';
      return final;
    }
  } else {
    final.encoding = 'invalid';
    return final;
  }

};


const getLatitude = (pole, arrayData) => {
  if (pole === 'S') {
    let raw = arrayData[arrayData.indexOf(pole) - 1];
    return 0 - (Number(raw.slice(0, 2)) + Number(raw.slice(2, raw.length) / 60));
  } else {
    let raw = arrayData[arrayData.indexOf(pole) - 1];
    return Number(raw.slice(0, 2)) + Number(raw.slice(2, raw.length) / 60);
  }
};
const getLongitude = (pole, arrayData) => {
  if (pole === 'W') {
    let raw = arrayData[arrayData.indexOf(pole) - 1];
    return 0 - (Number(raw.slice(0, 3)) + Number(raw.slice(3, raw.length) / 60));
  } else {
    let raw = arrayData[arrayData.indexOf(pole) - 1];
    return Number(raw.slice(0, 3)) + Number(raw.slice(3, raw.length) / 60);
  }
};

const getSpeedKMH = (hPOle, arrayData) => {
  let raw = arrayData[arrayData.indexOf(hPOle) + 1];
  return 1.852 * Number(raw);

};
const getSpeedKnots = (hPOle, arrayData) => {
  let raw = arrayData[arrayData.indexOf(hPOle) + 1];
  return Number(raw);

};

const GetDateTime = (poles, arrayData) => {
  let t = {};
  let rawT = arrayData[arrayData.indexOf(poles[0]) - 3];
  let rawD = arrayData[arrayData.indexOf(poles[1]) + 3];
  
  t.hour = parseInt(rawT.slice(0, 2), 10);
  t.minute =parseInt(rawT.slice(2, 4), 10);
  t.seconds = parseInt(rawT.slice(4, 6), 10);
  t.year =parseInt(rawD.slice(4, 6), 10);
  t.month = parseInt(rawD.slice(2, 4), 10);
  t.day = parseInt(rawD.slice(0, 2), 10);
  if (t.year < 73) {
    t.year = t.year + 2000;
  } else {
    t.year = t.year + 1900;
  }

  return new Date(Date.parse(`${t.year}-${t.month}-${t.day} ${t.hour}:${t.minute}:${t.seconds}:`));
};

const getDateArr = (poles, arrayData) => {
  let t = {};
  let rawT = arrayData[arrayData.indexOf(poles[0]) - 3];
  let rawD = arrayData[arrayData.indexOf(poles[1]) + 3];
 
  t.hour = parseInt(rawT.slice(0, 2), 10);
  t.minute =parseInt(rawT.slice(2, 4), 10);
  t.seconds = parseInt(rawT.slice(4, 6), 10);
  t.year =parseInt(rawD.slice(4, 6), 10);
  t.month = parseInt(rawD.slice(2, 4), 10);
  t.day = parseInt(rawD.slice(0, 2), 10);
  if (t.year < 73) {
    t.year = t.year + 2000;
  } else {
    t.year = t.year + 1900;
  }
  return [t.year, t.month, t.day, t.hour, t.minute, t.seconds];
};

const GetDateTimeLocale = (poles,arrayData)=>{
  let t = {};
  let rawT = arrayData[arrayData.indexOf(poles[0]) - 3];
  let rawD = arrayData[arrayData.indexOf(poles[1]) + 3];
 
  t.hour = parseInt(rawT.slice(0, 2), 10);
  t.minute =parseInt(rawT.slice(2, 4), 10);
  t.seconds = parseInt(rawT.slice(4, 6), 10);
  t.year =parseInt(rawD.slice(4, 6), 10);
  t.month = parseInt(rawD.slice(2, 4), 10);
  t.day = parseInt(rawD.slice(0, 2), 10);
  if (t.year < 73) {
    t.year = t.year + 2000;
  } else {
    t.year = t.year + 1900;
  }
  return new Date(Date.parse(`${t.year}-${t.month}-${t.day} ${t.hour}:${t.minute}:${t.seconds}:`));
};


module.exports = {
  getPoles: getPoles,
  getEncodingType: getEncodingType,
  getLatitude: getLatitude,
  getLongitude: getLongitude,
  getSpeedKMH: getSpeedKMH,
  getSpeedKnots: getSpeedKnots,
  GetDateTime: GetDateTime,
  getDateArr: getDateArr,
  GetDateTimeLocale: GetDateTimeLocale
};