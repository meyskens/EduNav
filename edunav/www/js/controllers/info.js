angular.module("edunav.controllers").controller("InfoCtrl", infoController)

infoController.$inject = ["$scope", "$ionicPlatform", "BackendService", "StorageService", "$ionicPopup", "$rootScope"]

function infoController($scope, $ionicPlatform, BackendService, StorageService, $ionicPopup, $rootScope) {
    $scope.appVersion = "unknown"
    $scope.contributors = []
    $scope.loadingContributors = true
    
    var versionTaps = 0

    setInterval(function() {
        versionTaps = 0
    }, 2000)

    $ionicPlatform.ready(function() {
        if (typeof cordova !== "undefined") {
            cordova.getAppVersion(function(version) {
                $scope.appVersion = version
            })
        }
    })

    BackendService.getContributors().then(function(response) {
        $scope.contributors = response.data
        $scope.loadingContributors = false
    })

    $scope.versionTap = function() {
        versionTaps++
        if (versionTaps == 5) {
            StorageService.saveToStorage("debug", { enabled: true })
            console.log($rootScope)
            $rootScope.enableDebug()
            $ionicPopup.alert({
                title: "Debug mode",
                template: "Debug mode is enabled"
            })
        }
    }
    $scope.deviceInformation =  ionic.Platform.device()
    $scope.currentPlatform =  ionic.Platform.platform()
    $scope.currentPlatformVersion =  ionic.Platform.version()
}
