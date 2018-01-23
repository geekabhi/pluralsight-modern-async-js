const delayms = 1;

function getCurrentCity(callback) {
  setTimeout(function () {

    const city = "New York, NY";
    callback(null, city);

  }, delayms)
}

function getWeather(city, callback) {
  setTimeout(function () {

    if (!city) {
      callback(new Error("City required to get weather"));
      return;
    }

    const weather = {
      temp: 50
    };

    callback(null, weather)

  }, delayms)
}

function getForecast(city, callback) {
  setTimeout(function () {

    if (!city) {
      callback(new Error("City required to get forecast"));
      return;
    }

    const fiveDay = {
      fiveDay: [60, 70, 80, 45, 50]
    };

    callback(null, fiveDay)

  }, delayms)
}

suite.only("Operations")

function fetchCurrentCity1(onSuccess, onError) {
  getCurrentCity(function (error, city) {
    if(error) onError(error);
    onSuccess(city);
  });
}

function fetchCurrentCity2() {
  const operation = {};

  getCurrentCity(function (error, city) {
      if(error) {
        operation.onError(error);
        return;
      }
      operation.onSuccess(city);
  });

  operation.setCallbacks = function (onSuccess, onError) {
      operation.onSuccess = onSuccess;
      operation.onError = onError;
  }

    return operation;
}

function fetchCurrentCity3() {
  const operation = {};

  getCurrentCity(function (error, city) {
      if(error) {
          operation.onError(error);
          return;
      }
      operation.onSuccess(city);
  });

  operation.setCallbacks = function (onSuccess, onError) {
      operation.onSuccess = onSuccess;
      operation.onError = onError;
  }

  return operation;
}

function fetchCurrentCity4() {
    const operation = {
      successReactions: [],
      errorReactions: []
    };

    getCurrentCity(function (error, city) {
        if(error) {
            operation.errorReactions.forEach( r => r(error));
            return;
        }
        operation.successReactions.forEach( r => r(city))
    });

    const noop = () => {};

    operation.onCompletion = function setCallbacks(onSuccess, onError) {
        operation.successReactions.push(onSuccess || noop);
        operation.errorReactions.push(onError || noop);
    }

    operation.onFailure = function onFailure(onError) {
        operation.onCompletion(null, onError);
    }

    return operation;
}

function fetchWeather(city) {

  const operation = new Operation();

    getWeather(city, operation.nodeCallback);

    return operation;
}

function Operation() {
    const operation = {
        successReactions: [],
        errorReactions: []
    };

    const noop = () => {};

    operation.onCompletion = function setCallbacks(onSuccess, onError) {
        operation.successReactions.push(onSuccess || noop);
        operation.errorReactions.push(onError || noop);
    }

    operation.onFailure = function onFailure(onError) {
        operation.onCompletion(null, onError);
    }

    operation.fail = function fail(error) {
        operation.errorReactions.forEach( r => r(error));
    }

    operation.succeed = function succeed(result) {
        operation.successReactions.forEach( r => r(result));
    };

    operation.nodeCallback = function nodeCallback(error, result) {
        if(error) {
            operation.fail(error);
            return;
        }
        operation.succeed(result);
    }

    return operation;
}

test("fetchCurrentCity1 with separate success and error callbacks", function (done) {

  function onSuccess(result) {
      console.log(result);
      expect(result).toBe("New York, NY");
      done();
  }

  function onError(error) {
      console.log(error);
  }

  fetchCurrentCity1(onSuccess, onError);
});

test("fetchCurrentCity2 pass the callbacks later on", function (done) {
    const operation = fetchCurrentCity2();
    operation.setCallbacks(
        result => { console.log(result); done();},
        error => { console.log(error); done(error)});
});

test("register only error handler, ignore success handler", function (done) {
    const operation = fetchCurrentCity4();

    operation.onFailure(error => { console.log(error); done(error)});

    operation.onCompletion(result => { console.log(result); done();});
});

test("register only success handler, ignore error handler", function (done) {
    const operation = fetchCurrentCity4();

    operation.onCompletion(result => { console.log(result); done();});
    operation.onFailure(error => { console.log(error); done(error)});
});

test("noop if success handler passed", function (done) {
  const operation = fetchWeather("NY");
  operation.onFailure(error => done(error));
  operation.onCompletion(result => done());
});

test("noop if error handler passed", function (done) {
    const operation = fetchWeather();

    operation.onCompletion(result => done(new Error("shouldn't succeed")))
    operation.onFailure(error => done());
});

test("get weather after get city", function (done) {
    const currentCity = fetchCurrentCity4();
    
    currentCity.onCompletion(function (city) {
        
    })
})

