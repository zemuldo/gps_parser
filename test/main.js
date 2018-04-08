import test from 'ava';
import Main from '../lib/main.js';
import momment from 'moment-timezone';

test('Test initialize the library with no data, error', t => {

  let gpsPack = new Main();
  t.deepEqual(gpsPack.poles, []);
  t.is(gpsPack.isVoid, true);
  t.is(gpsPack.encoding, 'invalid');
  t.deepEqual(gpsPack.arrayData, []);
});


test('Test Unknown Encoding Type', t => {

  let data = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  let gpsPack = new Main();
  t.deepEqual(gpsPack.poles, []);
  t.is(gpsPack.isVoid, true);
  t.is(gpsPack.encoding, 'invalid');
  t.deepEqual(gpsPack.arrayData, []);
});

test('Test initialize the library with data, should return the string true', t => {

  let data = '$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A';

  let gpsPack = new Main(data);
  t.deepEqual(gpsPack.poles, ['N', 'E']);
  t.is(gpsPack.isVoid, false);
  t.is(gpsPack.encoding, 'nmea');
  t.deepEqual(gpsPack.arrayData, data.split(','));
});

test('Test Nmea Encoding Type', t => {

  let data = '$GPRMC,123519,V,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A';

  let gpsPack = new Main(data);
  t.is(gpsPack.encoding, 'nmea');
});

test('Test void data NMEA', t => {

  let data = '$GPRMC,123519,V,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A';

  let gpsPack = new Main(data);
  t.is(gpsPack.isVoid, true);
});

test('Test void data HQ NMEA', t => {

  let data = '*HQ,6028021806,V1,125601,V,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.isVoid, true);
});

test('Test HQ Nmea Encoding Type', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.isVoid, false);
  t.is(gpsPack.encoding, 'hqnmea');
});

test('Test Get Pole orientation', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.poles[0], 'S');
  t.is(gpsPack.poles[1], 'E');
  t.is(gpsPack.poles[2], undefined);
});

test('Test Get Pole orientation', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.poles[0], 'N');
  t.is(gpsPack.poles[1], 'W');
  t.is(gpsPack.poles[2], undefined);
});

test('Test Get decoded data', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.latitude, -1.21582);
  t.is(gpsPack.longitude, 36.903733333333335);
});

test('Test Get Long ', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,098.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.longitude, -36.903733333333335);
});

test('Test Get Lat ', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,098.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.latitude, 1.21582);
});

test('Test Get  speed KmH ', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,098.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.speedkmh, 181.57008000000002);
});

test('Test Get  speed knots ', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,098.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.speedknots, 98.04);
});

test('Test Get Date Time array', t => {

  let data = '*HQ,6028022385,V1,171403,A,0114.5751,S,03639.7117,E,000.02,000,080418,FFFFBBFF,639,02,04104,12176,10,31#';

  let gpsPack = new Main(data);
  t.deepEqual(gpsPack.dateArray, [2018,4,8,17,14,3]);
});



test('Test Get Date Time data', t => {

  let data = '*HQ,6028022385,V1,173126,A,0114.5769,S,03639.7117,E,000.02,000,080418,FFFFBBFF,639,02,04104,12176,10,31#';

  let gpsPack = new Main(data);
  t.deepEqual(gpsPack.date.toISOString(), new Date('2018-04-08 17:31:26 UTC').toISOString());
});

test('Test Range', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

  let gpsPack = new Main(data);
  t.is(gpsPack.getRangeFromKnow(-1.21343, 36.92356), 2.2200929037438093);
});

// test('Test reverse geocoding google', t => {
//   let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

//   let gpsPack = new Main(data);
//   t.is(gpsPack.decode(), true);

//   return Promise.resolve(gpsPack.reverseGeoLocGoogle(process.env.GOOGLE_MAPS_API_KEY))
//     .then(o => {
//       t.is(o.constructor, Array);
//     });
// });