/*jslint sloppy: true */
/*global angular, window, console */

function getCurrent($scope, fbURL, angularFire) {
    console.log(fbURL);
//    angularFire(fbURL + $id, $scope, 'remote', {}).
//        then(function () {
//            $scope.device = angular.copy($scope.remote);
//            $scope.device.$id = $routeParams.deviceId;
//            $scope.isClean = function () {
//                return angular.equals($scope.remote, $scope.device);
//            };
//            $scope.send = function () {
//                $scope.remote = angular.copy($scope.device);
//            };
//        });
}

function ListCtrl($scope, stocks, time, angularFire, fbURL) {
    $scope.stocks = stocks;
    window.stocks = stocks;
    $scope.time = time;
    $scope.angularFire = angularFire;
    $scope.fbURL = fbURL;
//    angular.forEach(stocks, function (element) {
//        element.lockPhrase = '';
//    }, $scope.stocks);
//    _.forEach(stocks, function (element, index, list) {
//        console.log(index);
//    });
    $scope.send = function (id) {
        $scope.angularFire($scope.fbURL + '/stock/' + id, $scope, 'remote', {}).
            then(function () {
                $scope.project = angular.copy($scope.remote);
                $scope.project.$id = id;
                var current = _.filter($scope.stocks, function (device) {
                    return device.$id === id;
                });
                if ($scope.remote.$id === current[0].$id && $scope.remote.lockPhrase === $scope.confirmLockPhrase) {
                    console.log('saving');
                }
            });
//        $scope.remote = angular.copy($scope.device);
    };
}

angular.module('device', ['ui.bootstrap', 'firebase']).
    value('fbURL', 'https://device-checker.firebaseio.com/').
    factory('stocks', function (angularFireCollection, fbURL) {
        return angularFireCollection(fbURL + 'stock');
    }).
    factory('time', function () {
        var time = {};
        (function tick() {
            time.now = new Date();
//            $timeout(tick, 1000);
        }());
        return time;
    }).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {controller: ListCtrl, templateUrl: '../../tabs.html'}).
            otherwise({redirectTo: '/'});
    }]);
