angular.module("edunav.services").service("BackendService", backendService);

backendService.$inject = ["$http"];

function backendService($http) {

    this.getContributors = function() {
        return $http.get("https://edunav.eyskens.me/contributors");
    }

    this.getMaps = function() {
        return $http.get("https://edunav.eyskens.me/maps");
    }

    this.getMap = function(id) {
        return $http.get("https://edunav.eyskens.me/maps/" + id);
    }

    this.getRoom = function(id) {
        return $http.get("https://edunav.eyskens.me/rooms/" + id);
    }

    this.getRoomsForMap = function(mapID) {
        return $http.get("https://edunav.eyskens.me/rooms/map/" + mapID);
    }

    this.getAPsForMap = function(mapID) {
        return $http.get("https://edunav.eyskens.me/basestations/map/" + mapID);
    }

    this.addRoom = function(mapID, x, y, name, comment) {
        var keysURL = "keys.json"
        if(ionic.Platform.isAndroid()){
            keysURL = "/android_asset/www/" + keysURL
        }
        return $http.get(keysURL).success(function(keys){
            $http.post("https://edunav.eyskens.me/rooms/" + keys.api + "/add", {
                mapID: mapID,
                x: parseFloat(x),
                y: parseFloat(y),
                name: name,
                comment: comment
            });
        });
    }

    this.addAPToMap = function(bssid, mapID, x, y) {
        var keysURL = "keys.json"
        if(ionic.Platform.isAndroid()){
            keysURL = "/android_asset/www/" + keysURL
        }
        return $http.get(keysURL).success(function(keys){
            $http.post("https://edunav.eyskens.me/basestations/" + keys.api + "/add", {
                mapID: mapID,
                x: parseFloat(x),
                y: parseFloat(y),
                bssid: bssid
            });
        });
        
    }

    return this
}