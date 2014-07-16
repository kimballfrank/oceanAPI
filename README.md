oceanAPI
========

Wrapper for Digital Ocean API v2

## Usage
```JavaScript
var myToken = 'your_private_token_here';
var oceanAPI = digitalOcean(myToken);

oceanAPI.droplets.get(function(results, error){
  console.log(results);
});
```

