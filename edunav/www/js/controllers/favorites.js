angular
    .module("edunav.controllers")
    .controller("FavoritesCtrl", favoritesController)

favoritesController.$inject = [
    "$scope",
    "BackendService",
    "StorageService",
    "$q",
    "$ionicLoading",
]

function favoritesController(
    $scope,
    BackendService,
    StorageService,
    $q,
    $ionicLoading
) {
    $scope.favorites = []
    var loadFavorites = function() {
        var favorites = StorageService.getFromStorage("favorites")
        console.log(favorites)
        var promises = []
        for (var favorite of favorites) {
            console.log(favorite)
            promises.push(
                BackendService.getRoom(favorite).then(response => {
                    console.log(response.data)
                    $scope.favorites.push(response.data)
                })
            )
        }
        $q.all(promises).then(() => $ionicLoading.hide())
    }

    $scope.$on("$ionicView.loaded", function() {
        $ionicLoading.show({
            template: "<ion-spinner></ion-spinner>",
        })
        loadFavorites()
    })
}
