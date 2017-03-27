angular.module('edunav.controllers').controller('AppCtrl', appController)

appController.$inject = ["$scope", "StorageService", "$rootScope"]

function appController($scope, StorageService, $rootScope) {
    $scope.debug = (StorageService.getFromStorage("debug") || {}).enabled
    $rootScope.enableDebug = function() {
        $scope.debug = true
    }
}

