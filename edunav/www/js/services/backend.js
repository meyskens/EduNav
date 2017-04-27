angular.module("edunav.services").service("BackendService", backendService)

backendService.$inject = ["$http"]

function backendService($http) {
    this.getContributors = function() {
        return $http.get("https://api.edunav.me/contributors")
    }

    this.getMaps = function() {
        return $http.get("https://api.edunav.me/maps")
    }

    this.getMap = function(id) {
        return $http.get("https://api.edunav.me/maps/" + id)
    }

    this.getRoom = function(id) {
        return $http.get("https://api.edunav.me/rooms/" + id)
    }

    this.getRoomsForTerm = function(term) {
        return $http.get("https://api.edunav.me/rooms/search", {
            params: { term: term },
        })
    }

    this.getRoomsForMap = function(mapID) {
        return $http.get("https://api.edunav.me/rooms/map/" + mapID)
    }

    this.getAPsForMap = function(mapID) {
        return $http.get("https://api.edunav.me/basestations/map/" + mapID)
    }

    this.getAPForBSSID = function(bssid) {
        return $http.get("https://api.edunav.me/basestation/bssid/" + bssid)
    }

    return this
}
