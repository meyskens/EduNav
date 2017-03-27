angular.module('edunav.controllers').controller('DebugCtrl', debugController)

debugController.$inject = ["$scope", "$ionicPlatform"];

function debugController($scope, $ionicPlatform) {
    $scope.deviceInformation =  ionic.Platform.device();
    $scope.currentPlatform =  ionic.Platform.platform();
    $scope.currentPlatformVersion =  ionic.Platform.version();
}
