angular.module("edunav.services").service("StorageService", storageService)

storageService.$inject = []

function storageService() {
    this.getFromStorage = function(key) {
        return angular.fromJson(window.localStorage[key])
    }

    this.saveToStorage = function(key, value) {
        window.localStorage[key] = angular.toJson(value)
    }

    return this
}