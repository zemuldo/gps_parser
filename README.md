# gps_parser

Library for decoding gps data, Supports Nmea data format.

Usage 

```javascript
let data = '*HQ,6028021806,V1,125601,A,0112.9492,S,03654.2240,E,000.04,000,170218,FFF7BBFF,639,02,04009,12902,7,31#';

let gpsPack = new Main(data);
  gpsPack.isVoid, false;
  gpsPack.latitude, 1.21582;
  gpsPack.longitude, -36.903733333333335;
  gpsPack.speedkmh, 181.57008000000002;
  gpsPack.speedknots, 98.04;
  gpsPack.date, '2018-04-17T12:56:01.000Z'
  gpsPack.getRangeFromKnow(-1.21343, 36.92356), 2.2200929037438093
  gpsPack.reverseGeoLocGoogle(process.env.GOOGLE_MAPS_API_KEY))
    .then(o => Array of objects with all addresses ) ;
    .catch(e => Error Object ) ;

```

# Contributions welcome, Have Fun
