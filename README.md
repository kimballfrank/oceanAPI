oceanAPI
========

Wrapper for Digital Ocean API v2

## Usage
```JavaScript
var myToken = 'your_private_token_here';
var oceanAPI = require('oceanAPI')(myToken);

oceanAPI.droplets.get(function(results, error){
  console.log(results);
});
```

## Warning!
this module is not finished and doesn't yet include full api coverage.

