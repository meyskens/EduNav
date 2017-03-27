angular.module('edunav.controllers').controller('RoomsRoomsCtrl', roomsRoomsController)

roomsRoomsController.$inject = ["$scope", "BackendService", "$ionicLoading", "$stateParams"];

function roomsRoomsController($scope, BackendService, $ionicLoading, $stateParams) {
    $scope.rooms = []
    $scope.mapId = $stateParams.map
    
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    })
    BackendService.getRoomsForMap($stateParams.map).then((response) => {
        $scope.rooms = response.data;
        $ionicLoading.hide()
        $scope.$apply()
    })
}
