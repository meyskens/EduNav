angular.module('edunav.controllers').controller('ScanCtrl', scanController)

scanController.$inject = ["$scope", "$ionicPlatform","$rootScope", "$cordovaBatteryStatus"];

function scanController($scope, $ionicPlatform, $rootScope, $cordovaBatteryStatus) {
    var ONE_SECOND = 1000; //TO DO: lookup ES6 compatibility of const
    $scope.baseStations = [];

    var scanInterval = null;
    var scanIntervalTime = 1000;

    var scanWifi = function () {
        WifiWizard.startScan(function () { })
        WifiWizard.getScanResults(handleResults, function(error) { 
            console.log("error" + error)
        })
    }

    var handleResults = function (data) {
        data = data.filter(function (a) {
            return a.SSID === "eduroam" // This is why the name is EduNav
        })
        data.sort(function (a, b) {
            return Math.abs(parseInt(a.level, 10)) - Math.abs(parseInt(b.level, 10))
        })
        $scope.baseStations = angular.copy(data)
        $scope.$apply()
    }

    $ionicPlatform.ready(function () {
        if (typeof WifiWizard === "undefined") {
            return $scope.error = "Platform not compatible"
        }
        $rootScope.$on('$cordovaBatteryStatus:status', function (result) {
            console.log(result)
            if (result.level <= 20 && !result.isPlugged) {
                // enable low battery mode
                if (scanIntervalTime < 10 * ONE_SECOND) {
                    scanIntervalTime = 10 * ONE_SECOND
                    clearInterval(scanInterval)
                    scanInterval = setInterval(scanWifi, scanIntervalTime)
                }
            } else {
                if (scanIntervalTime > ONE_SECOND) {
                    scanIntervalTime = ONE_SECOND
                    clearInterval(scanInterval)
                    scanInterval = setInterval(scanWifi, scanIntervalTime)
                }
            }
        })
        scanWifi()
        scanInterval = setInterval(scanWifi, scanIntervalTime)
    })
}