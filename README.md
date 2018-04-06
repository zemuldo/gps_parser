# gps_parser

Library for decoding gps data, Supports Nmea data format.

Usage 

```
let data = '$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A';

let gpsPack = new Main(data);
  gpsPack.decode(), true;
  gpsPack.getLatitude(), 1.21582);
  gpsPack.getLongitude(), -36.903733333333335;
  gpsPack.getSpeedKmH(), 181.57008000000002;
  gpsPack.getSpeedKnots(), 98.04;

```

# Contributions welcome, Have Fun
