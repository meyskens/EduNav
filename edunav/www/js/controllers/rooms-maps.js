angular
    .module("edunav.controllers")
    .controller("RoomsMapsCtrl", roomsMapsController)

roomsMapsController.$inject = ["$scope", "BackendService", "$ionicLoading"]

function roomsMapsController($scope, BackendService, $ionicLoading) {
    $scope.maps = []

    $ionicLoading.show({
        template: "<ion-spinner></ion-spinner>",
    })
    BackendService.getMaps().then(response => {
        $scope.maps = response.data
        $ionicLoading.hide()
        $scope.$apply()
    })
}
