open Express;

/* The tests below relies upon the ability to store in the Request
   objects abritrary JSON properties.
   Each middleware will both check that previous middleware
   have been called by making properties exists in the Request object and
   upon success will themselves adds another property to the Request.
 */
/* [checkProperty req next property k] makes sure [property] is
   present in [req]. If success then [k()] is invoked, otherwise
   [Next.route] is called with next */
let checkProperty = (req, next, property, k, res) => {
  let reqData = Request.asJsonObject(req);
  switch (Js.Dict.get(reqData, property)) {
    | None => next(Next.route, res)
    | Some(x) =>
    switch (Js.Json.decodeBoolean(x)) {
      | Some(b) when b => k(res)
      | _ => next(Next.route, res)
      }
  };
};

/* same as [checkProperty] but with a list of properties */
let checkProperties = (req, next, properties, k, res) => {
  let rec aux = properties =>
    switch (properties) {
      | [] => k(res)
      | [p, ...tl] => checkProperty(req, next, p, (_) => aux(tl), res)
      };
  aux(properties);
};

/* [setProperty req property] sets the [property] in the [req] Request
   value */
let setProperty = (req, property, res) => {
  let reqData = Request.asJsonObject(req);
  Js.Dict.set(reqData, property, Js.Json.boolean(true));
  res;
};

/* return the string value for [key], None if the key is not in [dict]
   TODO once BOption.map is released */
let getDictString = (dict, key) =>
switch (Js.Dict.get(dict, key)) {
  | Some(json) => Js.Json.decodeString(json)
  | _ => None
  };

/* make a common JSON object representing success */
let makeSuccessJson = (~message=?, ()) => {
  let json = Js.Dict.empty();
  Js.Dict.set(json, "success", Js.Json.boolean(true));
  Js.Dict.set(json, "code", Js.Json.number(float_of_int(0)));
  switch (message) {
    | Some(_message) => Js.Dict.set(json, "message", Js.Json.string(_message));
    | None => Js.Dict.set(json, "message", Js.Json.string("Success!"));
  }
  Js.Json.object_(json);
};

let app = express();

App.useOnPath(app, ~path="/") @@
Middleware.from((next, req, res) =>
                res |> setProperty(req, "middleware0") |> next(Next.middleware)
                ) /* call the next middleware in the processing pipeline */;

App.useWithMany(
  app,
  [|
  Middleware.from((next, req) =>
                  checkProperty(req, next, "middleware0", res =>
                                res |> setProperty(req, "middleware1") |> next(Next.middleware)
                                )
  ),
  Middleware.from((next, req) =>
                  checkProperties(req, next, ["middleware0", "middleware1"], res =>
                                  next(Next.middleware, setProperty(req, "middleware2", res))
                  )
  ),
  |],
  );

App.get(app, ~path="/") @@
Middleware.from((next, req) => {
  let previousMiddlewares = ["middleware0", "middleware1", "middleware2"];
  checkProperties(
    req,
    next,
    previousMiddlewares,
    Response.sendJson(makeSuccessJson()),
  );
});

App.useOnPath(
  app,
  ~path="/static",
  {
    let options = Static.defaultOptions();
    Static.make("static", options) |> Static.asMiddleware;
    },
);

App.get(app, ~path="/baseUrl") @@
Middleware.from((next, req) =>
                switch (Request.baseUrl(req)) {
                  | "" => Response.sendJson(makeSuccessJson())
                  | _ => next(Next.route)
                  }
);

App.get(app, ~path="/hostname") @@
Middleware.from((next, req) =>
                switch (Request.hostname(req)) {
                  | "localhost" => Response.sendJson(makeSuccessJson(~message=Request.hostname(req), ()))
                  | _ => next(Next.route)
                  }
);

App.get(app, ~path="/ip") @@
Middleware.from((next, req) =>
                switch (Request.ip(req)) {
                  | "127.0.0.1" => Response.sendJson(makeSuccessJson(~message=Request.ip(req), ()))
                  | s =>
                  Js.log(s);
                  next(Next.route);
                  /* TODO why is it printing ::1 */
                }
);

App.get(app, ~path="/method") @@
Middleware.from((next, req) =>
                switch (Request.httpMethod(req)) {
                  | Request.Get => Response.sendJson(makeSuccessJson(~message="GET", ()))
                  | s =>
                  Js.log(s);
                  next(Next.route);
                }
);

App.get(app, ~path="/originalUrl") @@
Middleware.from((next, req) =>
                switch (Request.originalUrl(req)) {
                  | "/originalUrl" => Response.sendJson(makeSuccessJson())
                  | s =>
                  Js.log(s);
                  next(Next.route);
                }
);

App.get(app, ~path="/path") @@
Middleware.from((next, req) =>
                switch (Request.path(req)) {
                  | "/path" => Response.sendJson(makeSuccessJson(~message=Request.path(req), ()))
                  | s =>
                  Js.log(s);
                  next(Next.route);
                }
);

App.get(app, ~path="/protocol") @@
Middleware.from((next, req) =>
                switch (Request.protocol(req)) {
                  | Request.Http => Response.sendJson(makeSuccessJson(~message="Http", ()))
                  | s =>
                  Js.log(s);
                  next(Next.route);
                }
);

App.get(app, ~path="/query") @@
Middleware.from((next, req) =>
                switch (getDictString(Request.query(req), "key")) {
                  | Some("value") => Response.sendJson(makeSuccessJson())
                  | _ => next(Next.route)
                  }
);

App.get(app, ~path="/not-found") @@
Middleware.from((_, _) => Response.sendStatus(Response.StatusCode.NotFound));

App.get(app, ~path="/error") @@
Middleware.from((_, _, res) =>
                res
                |> Response.status(Response.StatusCode.InternalServerError)
                |> Response.sendJson(makeSuccessJson())
                );

/* Get vatiables to run the server */
let x = [%bs.raw {| 'here is a string from javascript' |}];
let port = [%bs.raw {| process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080 |}];
let ip = [%bs.raw {| process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0' |}];
let mongoURL = [%bs.raw {| process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL |}];
let mongoURLLabel = "";

let onListen = e =>
switch (e) {
  | exception (Js.Exn.Error(e)) =>
  Js.log(e);
  Node.Process.exit(1);
  | _ => Js.log @@ "Listening at http://" ++ ip ++ ":" ++ port
  };

let server = App.listen(app, ~port=port, ~onListen, ());

let countRequestsInJavascript: (HttpServer.t, unit) => int = [%bs.raw
{|
function setupEnpointWithHttpServer(server) {
  let count = 0;
  server.on('request', (req, res) => ++count)
    return () => {
      const result = count;
      count = -1 // reset the count
        return result
    }
}
|}
];

let getRequestsCount = countRequestsInJavascript(server);

App.post(app, ~path="/get-request-count") @@
Middleware.from((_, _) =>
                Response.sendString(
                  "The server has been called "
                  ++ string_of_int(getRequestsCount())
                  ++ " times.",
                )
);
/* Other examples are
   App.listen app ();
   App.listen app port::1000 ();
   App.listen app port::1000 onListen::(fun e => Js.log e) ();
 */
/* -- Test the server --
   npm run start && cd tests && ./test.sh
 */
