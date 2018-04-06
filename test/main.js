import test from 'ava';
import Main from '../lib/main.js';

test('initialize the library with no data, error', t => {
    
  let gpsPack = new Main();
  t.is(gpsPack.validate().error, 'initialized parser with no string');
  t.is(gpsPack.getEncodingType().isVoid, true);
});

test('initialize the library with data, should return the string true', t => {
    
  let data = '$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A';

  let gpsPack = new Main(data);
  t.is(gpsPack.validate(), true);
  t.is(gpsPack.getEncodingType().isVoid, false);
});

test('Test Unknown Encoding Type', t => {

  let data = 'dskfsdjfhsdkjhfsdjkf';

  let gpsPack = new Main(data);
  t.is(gpsPack.getEncodingType().isVoid, true);
  t.is(gpsPack.getEncodingType().encoding, 'invalid');
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

test('Test Get decoded data', t => {

  let data = '*HQ,6028021806,V1,125601,A,0112.9492,N,03654.2240,W,098.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';
            
  let gpsPack = new Main(data);
  t.is(gpsPack.decode(), true);
  t.is(gpsPack.getLatitude(gpsPack.getPoles()[0]), 1.21582);
  t.is(gpsPack.getLongitude(gpsPack.getPoles()[1]), -36.903733333333335);
  t.is(gpsPack.getSpeedKmH(gpsPack.getPoles()[1]), 181.57008000000002);
  t.is(gpsPack.getSpeedKnots(gpsPack.getPoles()[1]), 98.04);
});




