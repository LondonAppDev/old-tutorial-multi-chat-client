// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('MainCtrl', function($scope, $document) {
    console.log('MainCtrl Loaded.');

    var SERVER_URL = 'ws://localhost:7007';
    var ws;

    $scope.showNameInput = true;
    $scope.showChatScreen = false;
    $scope.messageLog = '';
    $scope.userName = '';

    /** Toggles between the name and message input screens. */
    function toggleScreens() {
        $scope.showNameInput = !$scope.showNameInput;
        $scope.showChatScreen = !$scope.showChatScreen;
    }

    /** Connect to the WebSocket Server. */
    function connect() {
        ws = new WebSocket(SERVER_URL, []);
        ws.onmessage = handleMessageReceived;
        ws.onopen = handleConnected;
        ws.onerror = handleError;
    }

    function handleMessageReceived(data) {
        logMessage(data.data);
    }

    function handleConnected(data) {
        var logMsg = 'Connected to server: ' + data.target.url;
        logMessage(logMsg)
    }

    function handleError(err) {
        console.log("Error: ", err);
    }

    /** Adds a new line to the message log. */
    function logMessage(msg) {
        $scope.$apply(function() {
            $scope.messageLog = $scope.messageLog + msg + "\n";
            updateScrolling();
        });
    }

    /** Updates the scrolling so the latest message is visible. */
    function updateScrolling() {
        // NOTE: This is not really best practice... In your rela app, you
        // would have this logic in the directive.
        var msgLogId = '#messageLog';
        var msgLog = $document[0].querySelector(msgLogId);
        msgLog.scrollTop = msgLog.scrollHeight;
    }

    /** Submit the users name. */
    $scope.submitName = function submitName(name) {
        if (!name) {
            return;
        }
        $scope.userName = name;
        connect();
        toggleScreens();
    }

    $scope.sendMessage = function sendMessage(msg) {
        ws.send($scope.userName + ": " + msg);
    }
})
