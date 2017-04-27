angular
    .module("edunav.controllers")
    .controller("RoomsMapCtrl", roomsMapController)

roomsMapController.$inject = [
    "$scope",
    "BackendService",
    "$ionicLoading",
    "$stateParams",
    "StorageService",
    "CanvasService",
]

function roomsMapController(
    $scope,
    BackendService,
    $ionicLoading,
    $stateParams,
    StorageService,
    CanvasService
) {
    $scope.isFavorite = false
    var image = new Image()

    $ionicLoading.show({
        template: "<ion-spinner></ion-spinner>",
    })
    $scope.$on("$ionicView.loaded", function() {
        BackendService.getMap($stateParams.map).then(response => {
            $scope.map = response.data
            image.src = $scope.map.imageLocation
            CanvasService.renderMap(
                "room-map-canvas",
                image
            ).then(canvasInfo => {
                $ionicLoading.hide()
                BackendService.getRoom($stateParams.room).then(response => {
                    CanvasService.drawCircle(
                        canvasInfo,
                        response.data.x,
                        response.data.y
                    )
                })
            })
        })
    })

    var favorites = StorageService.getFromStorage("favorites")
    if (typeof favorites === "undefined") {
        StorageService.saveToStorage("favorites", [])
        favorites = StorageService.getFromStorage("favorites")
    }
    if (favorites.indexOf($stateParams.room) >= 0) {
        $scope.isFavorite = true
    }

    $scope.toggleFavorite = function() {
        $scope.isFavorite = !$scope.isFavorite
        if ($scope.isFavorite) {
            favorites.push($stateParams.room)
        } else {
            favorites = _.without(favorites, $stateParams.room)
            console.log(favorites)
        }
        StorageService.saveToStorage("favorites", favorites)
    }
}
