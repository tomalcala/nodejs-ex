// Generated by BUCKLESCRIPT VERSION 4.0.5, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Js_exn = require("bs-platform/lib/js/js_exn.js");
var Express = require("bs-express/lib/js/src/Express.js");
var Js_json = require("bs-platform/lib/js/js_json.js");
var Process = require("process");

function checkProperty(req, next, property, k, res) {
  var reqData = Express.Request[/* asJsonObject */1](req);
  var match = reqData[property];
  if (match !== undefined) {
    var match$1 = Js_json.decodeBoolean(match);
    if (match$1 !== undefined && match$1) {
      return Curry._1(k, res);
    } else {
      return Curry._2(next, Express.Next[/* route */1], res);
    }
  } else {
    return Curry._2(next, Express.Next[/* route */1], res);
  }
}

function checkProperties(req, next, properties, k, res) {
  var aux = function (properties) {
    if (properties) {
      var tl = properties[1];
      return checkProperty(req, next, properties[0], (function () {
                    return aux(tl);
                  }), res);
    } else {
      return Curry._1(k, res);
    }
  };
  return aux(properties);
}

function setProperty(req, property, res) {
  var reqData = Express.Request[/* asJsonObject */1](req);
  reqData[property] = true;
  return res;
}

function getDictString(dict, key) {
  var match = dict[key];
  if (match !== undefined) {
    return Js_json.decodeString(match);
  }
  
}

function makeSuccessJson(message, _) {
  var json = { };
  json["success"] = true;
  json["code"] = 0;
  if (message !== undefined) {
    json["message"] = message;
  } else {
    json["message"] = "Success!";
  }
  return json;
}

var app = Express.express(/* () */0);

Express.App[/* useOnPath */2](app, "/", Express.Middleware[/* from */5]((function (next, req, res) {
            return Curry._2(next, Express.Next[/* middleware */0], setProperty(req, "middleware0", res));
          })));

Express.App[/* useWithMany */1](app, /* array */[
      Express.Middleware[/* from */5]((function (next, req) {
              return (function (param) {
                  return checkProperty(req, next, "middleware0", (function (res) {
                                return Curry._2(next, Express.Next[/* middleware */0], setProperty(req, "middleware1", res));
                              }), param);
                });
            })),
      Express.Middleware[/* from */5]((function (next, req) {
              var partial_arg = /* :: */[
                "middleware0",
                /* :: */[
                  "middleware1",
                  /* [] */0
                ]
              ];
              return (function (param) {
                  return checkProperties(req, next, partial_arg, (function (res) {
                                return Curry._2(next, Express.Next[/* middleware */0], setProperty(req, "middleware2", res));
                              }), param);
                });
            }))
    ]);

Express.App[/* get */4](app, "/", Express.Middleware[/* from */5]((function (next, req) {
            var partial_arg = makeSuccessJson(undefined, /* () */0);
            var partial_arg$1 = Express.Response[/* sendJson */3];
            var partial_arg$2 = function (param) {
              return partial_arg$1(partial_arg, param);
            };
            return (function (param) {
                return checkProperties(req, next, /* :: */[
                            "middleware0",
                            /* :: */[
                              "middleware1",
                              /* :: */[
                                "middleware2",
                                /* [] */0
                              ]
                            ]
                          ], partial_arg$2, param);
              });
          })));

var options = Express.Static[/* defaultOptions */0](/* () */0);

Express.App[/* useOnPath */2](app, "/static", Express.Static[/* asMiddleware */4](Express.Static[/* make */3]("static", options)));

Express.App[/* get */4](app, "/baseUrl", Express.Middleware[/* from */5]((function (next, req) {
            var match = Express.Request[/* baseUrl */2](req);
            if (match === "") {
              var partial_arg = makeSuccessJson(undefined, /* () */0);
              var partial_arg$1 = Express.Response[/* sendJson */3];
              return (function (param) {
                  return partial_arg$1(partial_arg, param);
                });
            } else {
              return Curry._1(next, Express.Next[/* route */1]);
            }
          })));

Express.App[/* get */4](app, "/hostname", Express.Middleware[/* from */5]((function (next, req) {
            var match = Express.Request[/* hostname */9](req);
            if (match === "localhost") {
              var partial_arg = makeSuccessJson(Express.Request[/* hostname */9](req), /* () */0);
              var partial_arg$1 = Express.Response[/* sendJson */3];
              return (function (param) {
                  return partial_arg$1(partial_arg, param);
                });
            } else {
              return Curry._1(next, Express.Next[/* route */1]);
            }
          })));

Express.App[/* get */4](app, "/ip", Express.Middleware[/* from */5]((function (next, req) {
            var s = Express.Request[/* ip */10](req);
            if (s === "127.0.0.1") {
              var partial_arg = makeSuccessJson(Express.Request[/* ip */10](req), /* () */0);
              var partial_arg$1 = Express.Response[/* sendJson */3];
              return (function (param) {
                  return partial_arg$1(partial_arg, param);
                });
            } else {
              console.log(s);
              return Curry._1(next, Express.Next[/* route */1]);
            }
          })));

Express.App[/* get */4](app, "/method", Express.Middleware[/* from */5]((function (next, req) {
            var s = Express.Request[/* httpMethod */14](req);
            if (s !== 0) {
              console.log(s);
              return Curry._1(next, Express.Next[/* route */1]);
            } else {
              var partial_arg = makeSuccessJson("GET", /* () */0);
              var partial_arg$1 = Express.Response[/* sendJson */3];
              return (function (param) {
                  return partial_arg$1(partial_arg, param);
                });
            }
          })));

Express.App[/* get */4](app, "/originalUrl", Express.Middleware[/* from */5]((function (next, req) {
            var s = Express.Request[/* originalUrl */15](req);
            if (s === "/originalUrl") {
              var partial_arg = makeSuccessJson(undefined, /* () */0);
              var partial_arg$1 = Express.Response[/* sendJson */3];
              return (function (param) {
                  return partial_arg$1(partial_arg, param);
                });
            } else {
              console.log(s);
              return Curry._1(next, Express.Next[/* route */1]);
            }
          })));

Express.App[/* get */4](app, "/path", Express.Middleware[/* from */5]((function (next, req) {
            var s = Express.Request[/* path */16](req);
            if (s === "/path") {
              var partial_arg = makeSuccessJson(Express.Request[/* path */16](req), /* () */0);
              var partial_arg$1 = Express.Response[/* sendJson */3];
              return (function (param) {
                  return partial_arg$1(partial_arg, param);
                });
            } else {
              console.log(s);
              return Curry._1(next, Express.Next[/* route */1]);
            }
          })));

Express.App[/* get */4](app, "/protocol", Express.Middleware[/* from */5]((function (next, req) {
            var s = Express.Request[/* protocol */17](req);
            if (s) {
              console.log(s);
              return Curry._1(next, Express.Next[/* route */1]);
            } else {
              var partial_arg = makeSuccessJson("Http", /* () */0);
              var partial_arg$1 = Express.Response[/* sendJson */3];
              return (function (param) {
                  return partial_arg$1(partial_arg, param);
                });
            }
          })));

Express.App[/* get */4](app, "/query", Express.Middleware[/* from */5]((function (next, req) {
            var match = getDictString(Express.Request[/* query */19](req), "key");
            if (match !== undefined && match === "value") {
              var partial_arg = makeSuccessJson(undefined, /* () */0);
              var partial_arg$1 = Express.Response[/* sendJson */3];
              return (function (param) {
                  return partial_arg$1(partial_arg, param);
                });
            } else {
              return Curry._1(next, Express.Next[/* route */1]);
            }
          })));

Express.App[/* get */4](app, "/not-found", Express.Middleware[/* from */5]((function (_, _$1) {
            return Express.Response[/* sendStatus */7](/* NotFound */23);
          })));

Express.App[/* get */4](app, "/error", Express.Middleware[/* from */5]((function (_, _$1, res) {
            return Express.Response[/* sendJson */3](makeSuccessJson(undefined, /* () */0), Express.Response[/* status */9](/* InternalServerError */47)(res));
          })));

var x = ( 'here is a string from javascript' );

var port = ( process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080 );

var ip = ( process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0' );

var mongoURL = ( process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL );

function onListen(e) {
  var exit = 0;
  var val;
  try {
    val = e;
    exit = 1;
  }
  catch (raw_exn){
    var exn = Js_exn.internalToOCamlException(raw_exn);
    if (exn[0] === Js_exn.$$Error) {
      console.log(exn[1]);
      Process.exit(1);
      return /* () */0;
    } else {
      throw exn;
    }
  }
  if (exit === 1) {
    console.log("Listening at http://" + (ip + (":" + port)));
    return /* () */0;
  }
  
}

var server = Express.App[/* listen */19](app, port, onListen, /* () */0);

var countRequestsInJavascript = (
function setupEnpointWithHttpServer(server) {
  let count = 0;
  server.on('request', (req, res) => ++count)
    return () => {
      const result = count;
      count = -1 // reset the count
        return result
    }
}
);

var getRequestsCount = Curry._1(countRequestsInJavascript, server);

Express.App[/* post */7](app, "/get-request-count", Express.Middleware[/* from */5]((function (_, _$1) {
            var partial_arg = "The server has been called " + (String(Curry._1(getRequestsCount, /* () */0)) + " times.");
            var partial_arg$1 = Express.Response[/* sendString */2];
            return (function (param) {
                return partial_arg$1(partial_arg, param);
              });
          })));

var mongoURLLabel = "";

exports.checkProperty = checkProperty;
exports.checkProperties = checkProperties;
exports.setProperty = setProperty;
exports.getDictString = getDictString;
exports.makeSuccessJson = makeSuccessJson;
exports.app = app;
exports.x = x;
exports.port = port;
exports.ip = ip;
exports.mongoURL = mongoURL;
exports.mongoURLLabel = mongoURLLabel;
exports.onListen = onListen;
exports.server = server;
exports.countRequestsInJavascript = countRequestsInJavascript;
exports.getRequestsCount = getRequestsCount;
/* app Not a pure module */