angular.module('edunav.controllers').controller('SearchCtrl', searchController)

searchController.$inject = ["$scope", "BackendService", "$timeout"];

function searchController($scope, BackendService, $timeout) {
    $scope.rooms = []
    $scope.searchInput = ""
    this.searchPromise = null
    
    $scope.searchChange = function(input) {
        console.log(this.searchPromise)
        $timeout.cancel(this.searchPromise)
        console.log(this.searchPromise)
        if (input === "") {
            $scope.rooms = []
            return
        }
        this.searchPromise = BackendService.getRoomsForTerm(input).then(function(response) {
            $scope.rooms = response.data
        })
    }
}
