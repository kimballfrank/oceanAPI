var Promise = require("bluebird");
var request = Promise.promisify(require('request'));
var _ = require('lodash');
var uuid = require('uuid-v4');

exports = module.exports = (function(token){
  var rootURL = "https://api.digitalocean.com/v2";
  var apiToken = token;
  var ssh_keys = {};
  var settingsPromisify = false;

  var baseMethods = {
      get: function(options, fn){
        return request({
            url: rootURL + options.path + (options.query || '')
          , method: "GET"
          , headers: { "Authorization": "Bearer " + apiToken}
        }).spread(function(response, body) {
            if(fn){
              fn(JSON.parse(body));
            }
            else {
              return body;
            }
        }).catch(function(err) {
            if(fn) fn(null, err);
            else return err;
        });

      }
    , del: function(options, fn){
        return request({
            url: rootURL + options.path + (options.query || '')
          , method: "DELETE"
          , headers: {"Authorization": "Bearer " + apiToken, "Content-Type": "application/x-www-form-urlencoded" }
        }).spread(function(response, body) {
            fn(JSON.parse(body));
        }).catch(function(err) {
            fn(null, err);
        });

      }
    , requestWithBody: function(method, options, fn){
        return request({
            url: rootURL + options.path + (options.query || '')
          , method: method
          , headers: {"Authorization": "Bearer " + apiToken, "Content-type": "application/json" }
          , body: JSON.stringify(options.body) || "{}"
        }).spread(function(response, body) {
            fn(JSON.parse(body));
        }).catch(function(err) {
            fn(null, err);
        });

      }
  } // end reqMethods

  baseMethods.post = function(options, fn) {
    return baseMethods.requestWithBody("POST", options, fn);
  };

  baseMethods.put = function(options, fn) {
    return baseMethods.requestWithBody("PUT", options, fn);
  };


  var oceanAPI = function(endpoint){

    r = {
      get: function(id, query, fn){
        var options = {};
        options.path = endpoint;


       if(_.isFunction(id)){
           fn = id;
       }

       else if(id) {
          options.path = options.path + '/' + id;
       }

      if(_.isFunction(query)){
        fn = query;
      }
      else if(query) {
          options.query = '?';

         _.forIn(query, function(value, key){
            options.query = options.query + '&' + key + "=" + value;
            console.log(options.query)
         });
      }
      else {
        options.query = '';
      }

      return baseMethods.get(options, fn);
     }

    , post: function(body, query, fn){
      var options = {};
      options.path = endpoint;

      if(_.isFunction(body)){
        fn = body;
        var subdomain = uuid();
        options.body = {"name": subdomain + ".drop.madewithstudio.com","region":"nyc1","size":"1gb","image":3240036};
      }
      else if(_.isObject(body)){
          options.body = body;
      }
      if(_.isFunction(query)){
        fn = query;
      }
      else if(query){

        options.query = '?';

       _.forIn(query, function(value, key){
          options.query = options.query + '&' + key + "=" + value;
          console.log(options.query)
       });
      }
      else {
        options.query = '';
      }

      return baseMethods.post(options, fn);
    }

//    , put: {
//
//    }

    , del: function(id, query, fn){
      var options = {};
      options.path = endpoint;
      if(_.isFunction(id)){
        fn = id;
      }
      else if(id){
        options.path = options.path + '/' + id;
      }
      if(_.isFunction(query)){
        fn = query;
      }
      else if(query){

       _.forIn(query, function(value, key){
          options.query = options.query + '&' + key + "=" + value;
          console.log(options.query)
       });
      }
      else {
        options.query = '';
      }
      return baseMethods.del(options, fn);
    }
   }


  return r;

  } // end OceanAPI

  // droplets
  oceanAPI.droplets = oceanAPI('/droplets');

  // droplet actions
  oceanAPI.droplets.actions = function(id, body, fn){
    var options = {};
    options.path = '/droplets/' + id + '/actions';
    options.body = {"type": type};
    return baseMethods.post(options, fn);
  }

  oceanAPI.droplets.reboot = function(id, fn){
    return oceanAPI.droplets.actions("post", id, {"type": "reboot"}, fn);
  }

  oceanAPI.droplets.power_cycle = function(id, fn){
    return oceanAPI.droplets.actions(id, {"type": "power_cycle"}, fn);
  }

  oceanAPI.droplets.shutdown = function(id, fn){
    return oceanAPI.droplets.actions(id, {"type": "shutdown"}, fn);
  }

  oceanAPI.droplets.power_off = function(id, fn){
    return oceanAPI.droplets.actions(id, {"type": "power_off"}, fn);
  }

  oceanAPI.droplets.power_on = function(id, fn){
    return oceanAPI.droplets.actions(id, {"type": "power_on"}, fn);
  }

  oceanAPI.droplets.password_reset = function(id, fn){
    return oceanAPI.droplets.actions(id, {"type": "password_reset"}, fn);
  }

  oceanAPI.droplets.resize = function(id, size, fn){
    return oceanAPI.droplets.actions(id, {"type": "resize", "size": size}, fn);
  }

  oceanAPI.droplets.restore = function(id, image, fn){
    return oceanAPI.droplets.actions(id, {"type": "restore", "image": image}, fn);
  }

  oceanAPI.droplets.rebuild = function(id, image, fn){
    return oceanAPI.droplets.actions(id, {"type": "rebuild", "image": image}, fn);
  }

  oceanAPI.droplets.rename = function(id, image, fn){
    return oceanAPI.droplets.actions(id, {"type": "rename", "image": image}, fn);
  }

  oceanAPI.droplets.change_kernel = function(id, kernel, fn){
    return oceanAPI.droplets.actions(id, {"type": "rebuild", "kernel": kernel}, fn);
  }

  oceanAPI.droplets.enable_ipv6 = function(id, fn){
    return oceanAPI.droplets.actions(id, {"type": "enable_ipv6"}, fn);
  }

  oceanAPI.droplets.disable_backups = function(id, fn){
    return oceanAPI.droplets.actions(id, {"type": "disable_backups"}, fn);
  }

  oceanAPI.droplets.enable_private_networking = function(id, fn){
    return oceanAPI.droplets.actions(id, {"type": "enable_private_networking"}, fn);
  }

  oceanAPI.droplets.snapshot = function(id, fn){
    return oceanAPI.droplets.actions(id, {"type": "snapshot"}, fn);
  }

  oceanAPI.droplets.getAction = function(dropletId, actionId, fn){
   var options = {};
   options.path = '/droplets/' + dropletId + '/actions/' + actionId;

    if(_.isFunction(fn)){
     return baseMethods.get(options, fn);
    }
    else {
      return baseMethods.get(options);
    }
  }

  if(settingsPromisify === true){
    Promise.promisify(oceanAPI.droplets.getAction); // the only one I know can do promises so far...
  }

  // just give me what I want!
  return oceanAPI;
});
