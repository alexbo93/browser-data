# browser-data
JS Browser Data collector

## Description
JS script loaded into a simple HTML that retrieve some sensitive data from the system and makes a simulation of code/encode process.

### Operations Run
- Obtaining following data from the browser/system:
  - btl: Battery level
  - btc: Battery charging
  - rtt: Navigator Effective round-trip time connection
  - bmc: Browser compatibility with video and audio formats: webm, ogg, mp4 & hls
  - plt: Device Platform
  
- Encoding using Javascript btoa method
  - Code includes a polyfill to make it IE8+ compatible
  
- Decoding using Javascript atob method
- Displaying results dynamically in a simple HTML
 
