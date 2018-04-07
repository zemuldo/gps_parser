import test from 'ava';
import Main from '../lib/main.js';
import momment from 'moment-timezone';

test('Test initialize the library with no data, error', t => {

  let gpsPack = new Main();
  t.is(gpsPack.validate().error, 'initialized parser with no string');
  t.is(gpsPack.getEncodingType().isVoid, true);
});


test('Test Unknown Encoding Type', t => {

  let data = 'dskfsdjfhsdkjhfsdjkf';

  let gpsPack = new Main(data);
  t.is(gpsPack.getEncodingType().isVoid, true);
  t.is(gpsPack.getEncodingType().encoding, 'invalid');
});

test('Test initialize the library with data, should return the string true', t => {

  let data = '$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A';

  let gpsPack = new Main(data);
  t.is(gpsPack.validate(), true);
  t.is(gpsPack.getEncodingType().isVoid, false);
});

test('Test Nmea Encoding Type', t => {

  let data = '$GPRMC,123519,V,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A';

  let gpsPack = new Main(data);
  t.is(gpsPack.getEncodingType().isVoid, true);
  t.is(gpsPack.getEncodingType().encoding, 'nmea');
});

test('Test Nmea Encoding Type', t => {

  let data = '$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A';

  let gpsPack = new Main(data);
  t.is(gpsPack.getEncodingType().isVoid, false);
  t.is(gpsPack.getEncodingType().encoding, 'nmea');
});


test('Test HQ Nmea Encoding Type', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.getEncodingType().isVoid, false);
  t.is(gpsPack.getEncodingType().encoding, 'hqnmea');
});

test('Test Get Pole orientation', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.getPoles()[0], 'S');
  t.is(gpsPack.getPoles()[1], 'E');
  t.is(gpsPack.getPoles()[2], undefined);
});

test('Test Get Pole orientation', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.getPoles()[0], 'N');
  t.is(gpsPack.getPoles()[1], 'W');
  t.is(gpsPack.getPoles()[2], undefined);
});

test('Test Get decoded data', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.decode(), true);
  t.is(gpsPack.getLatitude(gpsPack.getPoles()[0]), -1.21582);
  t.is(gpsPack.getLongitude(gpsPack.getPoles()[1]), 36.903733333333335);
});

test('Test Get Long ', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,098.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.decode(), true);
  t.is(gpsPack.getLongitude(), -36.903733333333335);
});

test('Test Get Lat ', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,098.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.decode(), true);
  t.is(gpsPack.getLatitude(), 1.21582);
});

test('Test Get  speed KmH ', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,098.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.decode(), true);
  t.is(gpsPack.getSpeedKmH(), 181.57008000000002);
  t.is(gpsPack.getSpeedKnots(), 98.04);
});

test('Test Get  speed knots ', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,098.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.decode(), true);
  t.is(gpsPack.getSpeedKnots(), 98.04);
});

test('Test Get Date Time data', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,098.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';
  
  let gpsPack = new Main(data);
  let poles = gpsPack.getPoles();
  t.is(gpsPack.decode(), true);
  t.deepEqual(gpsPack.getDateISO(), new Date(Date.parse(momment([2018, 2, 17, 15, 56, 1]).tz('Africa/Nairobi').format())));
  t.is(gpsPack.getDateISO().toISOString(), '2018-03-17T12:56:01.000Z');
  t.deepEqual(gpsPack.getDateArr(), [2018, 2, 17, 15, 56, 1]);
});

test('Test Range', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';
    
  let gpsPack = new Main(data);
  let poles = gpsPack.getPoles();
  t.is(gpsPack.decode(), true);
  t.is(gpsPack.getRangeFromKnow(-1.21343, 36.92356), 2.2200929037438093);
});

test('Test Range', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';
    
  let gpsPack = new Main(data);
  t.is(gpsPack.decode(), true);
  gpsPack.reverseGeoLocGoogle(process.env.GOOGLE_MAPS_API_KEY).then(o=>{
    t.is(o.status,'kljlkj');
  });
});

test('Test reverse geocoding google', t => {
  let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';
    
  let gpsPack = new Main(data);
  t.is(gpsPack.decode(), true);
  
  return Promise.resolve(gpsPack.reverseGeoLocGoogle(process.env.GOOGLE_MAPS_API_KEY))
    .then(o => {
      t.is(o.constructor, Array);
    });
});
