angular
    .module("edunav.controllers")
    .controller("LocationCtrl", locationController)

locationController.$inject = [
    "$scope",
    "$ionicPlatform",
    "$rootScope",
    "$cordovaBatteryStatus",
    "$ionicLoading",
    "BackendService",
    "$q",
    "CanvasService",
]

function locationController(
    $scope,
    $ionicPlatform,
    $rootScope,
    $cordovaBatteryStatus,
    $ionicLoading,
    BackendService,
    $q,
    CanvasService
) {
    // importing an NPM module we browserified
    var Circle = window.lateration.Circle
    var Vector = window.lateration.Vector
    var laterate = window.lateration.laterate

    var ONE_SECOND = 1000 //TO DO: lookup ES6 compatibility of const
    $scope.baseStations = []
    var infoForBSSID = {} // caches the info
    var foundAPs = []
    var firstTime = true

    var myPosition = {}

    var image = new Image()

    var scanInterval = null
    var scanIntervalTime = 1000

    var currentMap = ""
    var canvasInfo = null

    var scanWifi = function() {
        if (firstTime) {
            $ionicLoading.show({
                template: "Scanning wifi",
            })
        }
        WifiWizard.startScan(function() {})
        WifiWizard.getScanResults(handleResults, function(error) {
            $ionicLoading.hide()
            console.log("error" + error)
        })
    }

    var handleResults = function(data) {
        $ionicLoading.hide()
        if (firstTime) {
            $ionicLoading.show({
                template: "Looking up",
            })
        }

        data = angular.copy(data)

        // The following data is dummy data used to test outside of the campus
        /*
        data = [
            { SSID: "eduroam", BSSID: "b8:be:bf:ff:83:6f", level: "-66" },
            { SSID: "eduroam", BSSID: "b8:be:bf:ef:26:40", level: "-46" },
            { SSID: "eduroam", BSSID: "b8:be:bf:ff:80:d0", level: "-59" },
            { SSID: "eduroam", BSSID: "b8:be:bf:ff:8a:70", level: "-70" },
        ]*/

        data = data.filter(function(a) {
            return a.SSID === "eduroam" // This is why the name is EduNav
        })
        data.sort(function(a, b) {
            return (
                Math.abs(parseInt(a.level, 10)) -
                Math.abs(parseInt(b.level, 10))
            )
        })

        var promises = []

        for (var baseStations of data) {
            promises.push(getInfoForBasestation(baseStations))
        }

        $q.all(promises).then(() => {
            firstTime = false
            $ionicLoading.hide()
            lookupLocation(data)
        })
    }

    var getInfoForBasestation = function(basestation) {
        return new Promise(resolve => {
            if (typeof infoForBSSID[basestation.BSSID] !== "undefined") {
                return resolve(infoForBSSID[basestation.BSSID])
            }
            BackendService.getAPForBSSID(basestation.BSSID).then(
                response => {
                    resolve(response.data)
                },
                () => {
                    resolve({})
                }
            )
        }).then(data => {
            infoForBSSID[basestation.BSSID] = data
        })
    }

    var lookupLocation = function(data) {
        data = _.filter(data, function(d) {
            return Object.keys(infoForBSSID[d.BSSID] || {}).length > 0
        })

        if (data.length < 3) {
            $scope.error = "Not enough APs to find location"
            return
        }
        $scope.error = "" // clear error
        foundAPs = data

        var votedMaps = {}
        for (var ap of data) {
            if (!votedMaps[infoForBSSID[ap.BSSID].mapID]) {
                votedMaps[infoForBSSID[ap.BSSID].mapID] = 0
            }
            votedMaps[infoForBSSID[ap.BSSID].mapID]++
        }

        var highestVotedMap = ""
        var highestVoteCount = 0
        for (var map in votedMaps) {
            if (votedMaps[map] > highestVoteCount) {
                highestVotedMap = map
                highestVoteCount = votedMaps[map]
            }
        }
        if (currentMap !== highestVotedMap) {
            currentMap = highestVotedMap
            loadMap().then(() => {
                findLocation()
            })
        } else {
            findLocation()
        }
    }

    var loadMap = function() {
        return new Promise(resolve => {
            $ionicLoading.show({
                template: "Loading map",
            })
            BackendService.getMap(currentMap).then(response => {
                $scope.map = response.data
                image.src = $scope.map.imageLocation
                CanvasService.renderMap("map-canvas", image).then(info => {
                    $ionicLoading.hide()
                    canvasInfo = info
                    resolve()
                })
            })
        })
    }

    var findLocation = function() {
        var beacons = []
        for (var ap of foundAPs) {
            beacons.push(
                new Circle(
                    new Vector(
                        infoForBSSID[ap.BSSID].x,
                        infoForBSSID[ap.BSSID].y
                    ),
                    Math.abs(parseInt(ap.level) / 100)
                )
            )
        }

        console.log(beacons)
        
        var position = laterate(beacons)
        if (JSON.stringify(position) !== JSON.stringify(myPosition)) {
            myPosition = position
            drawMeOnMap()
        }
        console.log(myPosition)    
    }

    function drawMeOnMap() {
        CanvasService.drawCircle(canvasInfo, myPosition.x, myPosition.y)
    }

    $ionicPlatform.ready(function() {
        if (typeof WifiWizard === "undefined") {
            return ($scope.error = "Platform not compatible")
        }
        $rootScope.$on("$cordovaBatteryStatus:status", function(result) {
            console.log(result)
            if (result.level <= 20 && !result.isPlugged) {
                // enable low battery mode
                if (scanIntervalTime < 10 * ONE_SECOND) {
                    scanIntervalTime = 10 * ONE_SECOND
                    clearInterval(scanInterval)
                    scanInterval = setInterval(scanWifi, scanIntervalTime)
                }
            } else {
                if (scanIntervalTime > ONE_SECOND) {
                    scanIntervalTime = ONE_SECOND
                    clearInterval(scanInterval)
                    scanInterval = setInterval(scanWifi, scanIntervalTime)
                }
            }
        })
        scanWifi()
        scanInterval = setInterval(scanWifi, scanIntervalTime)
    })
}
