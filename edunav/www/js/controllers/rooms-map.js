angular
    .module("edunav.controllers")
    .controller("RoomsMapCtrl", roomsMapController)

roomsMapController.$inject = [
    "$scope",
    "BackendService",
    "$ionicLoading",
    "$stateParams",
    "StorageService",
]

function roomsMapController(
    $scope,
    BackendService,
    $ionicLoading,
    $stateParams,
    StorageService
) {
    $scope.isFavorite = false
    var canvas = document.getElementById("room-map-canvas")
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight - 50 // minus top bar + make unscrollable
    var ctx = canvas.getContext("2d")
    var image = new Image()

    // image starting points
    var xStart
    var yStart
    var imageWidth
    var imageHeight

    var showOnCanvas = function() {
        var imageAspectRatio = image.width / image.height
        var canvasAspectRatio = canvas.width / canvas.height

        imageWidth = canvas.height
        imageHeight = canvas.width
        xStart = 0
        yStart = 0

        if (imageAspectRatio < canvasAspectRatio) {
            // fit on height
            imageHeight = canvas.height
            imageWidth = image.width * (imageHeight / image.height)
            xStart = (canvas.width - imageWidth) / 2
            yStart = 0
        }

        if (imageAspectRatio > canvasAspectRatio) {
            // fit on height
            imageWidth = canvas.width
            imageHeight = image.height * (imageWidth / image.width)
            xStart = 0
            yStart = (canvas.height - imageHeight) / 2
        }
        ctx.drawImage(image, xStart, yStart, imageWidth, imageHeight)
    }

    var drawCircle = function(x, y) {
        ctx.beginPath()
        ctx.arc(
            x * imageWidth + xStart,
            y * imageHeight + yStart,
            10,
            0,
            2 * Math.PI
        )
        ctx.stroke()
    }

    $ionicLoading.show({
        template: "<ion-spinner></ion-spinner>",
    })
    $scope.$on("$ionicView.loaded", function() {
        BackendService.getMap($stateParams.map).then(response => {
            $scope.map = response.data
            image.src = $scope.map.imageLocation
            image.onload = function() {
                showOnCanvas()
                BackendService.getRoom($stateParams.room).then(response => {
                    drawCircle(response.data.x, response.data.y)
                })
                $ionicLoading.hide()
            }
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
