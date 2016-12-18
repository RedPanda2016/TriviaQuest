// require the challenge model
var Promise = require('bluebird');
var Challenge = Promise.promisifyAll(require('./models/challenge'));
var TestResult = require('./models/testResult');
var UserProfile = require('./models/userProfile');

// Gets all challenges from the database
exports.getChallenges = function(request, response) {
  Challenge.find({}).then(function (challenges) {
    response.json(challenges);
  });
};

// Saves a test result into the database.
exports.saveTestResult = function(request, response) {
  if (request.body.secret !== 'cats') {
    response.json({status: 'wrong secret'});
  }
  var testResultData = {
    branch: request.body.branch,
    failures: request.body.failures
  };
  TestResult.findOneAndUpdate({branch: request.body.branch}, testResultData, {upsert:true}, function (err, doc) {
    return response.json({status: 'done'});
  });
};

exports.getTestResult = function(request, response) {
  var branch = request.query.branch;
  if (!branch) {
    return response.json({error: 'no branch supplied'});
  }
  TestResult.findOne({branch: branch})
  .then(function (testResult) {
     if (testResult) {
       return response.json(testResult)[0];
     } else {
       return response.json({status: 'tests not yet triggered'});
     }
   })
  .catch(function (err) {
    console.log(err);
  });
};

exports.addUserStatus = function(request, response) {
  if (request.body.secret !== 'cats') {
    return response.json({status: 'wrong secret'});
  } else {
    UserProfile.findOneOrCreate({userId: request.body.userId}, request.body, function(err, user) {
      if (err) {response.json({status: 'error'})};
    });
    UserProfile.update({userId: request.body.userId}, request.body, function(err, user) {
      response.json({status: 'done'});
    });
  }
}

exports.getUserStatus= function(request, response) {
  if (request.query.secret !== 'cats') {
    return response.json({status: 'wrong secret'});
  } else {
    UserProfile.find(request.query.userId).then(function(users) {
      response.json(users);
    });
  }
}

exports.deleteAllUsers = function(request, response) {
  if (request.body.secret !== 'cats') {
    return response.json({status: 'wrong secret'});
  } else {
    UserProfile.remove(response.body).then(function(err, data) {
      response.json({status: 'done'});
    });
  }
}











