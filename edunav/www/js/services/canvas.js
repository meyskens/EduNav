angular.module("edunav.services").service("CanvasService", canvasService)

canvasService.$inject = []

function canvasService() {
    this.renderMap = function(canvasId, image) {
        var canvasInfo = {}

        canvasInfo.canvas = document.getElementById(canvasId)
        canvasInfo.canvas.width = document.documentElement.clientWidth
        canvasInfo.canvas.height = document.documentElement.clientHeight - 50 // minus top bar + make unscrollable
        canvasInfo.ctx = canvasInfo.canvas.getContext("2d")

        return new Promise(resolve => {
            image.onload = function() {
                canvasInfo.imageAspectRatio = image.width / image.height
                canvasInfo.canvasAspectRatio =
                    canvasInfo.canvas.width / canvasInfo.canvas.height

                canvasInfo.imageWidth = canvasInfo.canvas.height
                canvasInfo.imageHeight = canvasInfo.canvas.width
                canvasInfo.xStart = 0
                canvasInfo.yStart = 0

                if (
                    canvasInfo.imageAspectRatio < canvasInfo.canvasAspectRatio
                ) {
                    // fit on height
                    canvasInfo.imageHeight = canvasInfo.canvas.height
                    canvasInfo.imageWidth =
                        image.width * (canvasInfo.imageHeight / image.height)
                    canvasInfo.xStart =
                        (canvasInfo.canvas.width - canvasInfo.imageWidth) / 2
                    canvasInfo.yStart = 0
                }

                if (
                    canvasInfo.imageAspectRatio > canvasInfo.canvasAspectRatio
                ) {
                    // fit on height
                    canvasInfo.imageWidth = canvasInfo.canvas.width
                    canvasInfo.imageHeight =
                        image.height * (canvasInfo.imageWidth / image.width)
                    canvasInfo.xStart = 0
                    canvasInfo.yStart =
                        (canvasInfo.canvas.height - canvasInfo.imageHeight) / 2
                }
                canvasInfo.ctx.drawImage(
                    image,
                    canvasInfo.xStart,
                    canvasInfo.yStart,
                    canvasInfo.imageWidth,
                    canvasInfo.imageHeight
                )
                resolve(canvasInfo)
            }
        })
    }

    this.drawCircle = function(canvasInfo, x, y) {
        canvasInfo.ctx.beginPath()
        canvasInfo.ctx.arc(
            x * canvasInfo.imageWidth + canvasInfo.xStart,
            y * canvasInfo.imageHeight + canvasInfo.yStart,
            10,
            0,
            2 * Math.PI
        )
        canvasInfo.ctx.stroke()
    }
    return this
}
