angular.module("app.cats.allocationBar.utils", ["app.cats.utilsModule"])
.service("app.cats.allocationBar.utils.colorUtils",
["app.cats.catsUtils",
function (catsUtils) {
    this.colorCounter = 0;

    this.colorful = [
      "#418AC9", // blue
      "#FCB517", // yellow
      "#8561C5", // purple
      "#E76F24", // orange
      "#4EA175", // green
      "#707070", // grey
      "#D53F26", // red
      "#8EB9DF", // light blue
      "#C2b0E2", // light purple
      "#F0A470", // light orange
      "#A7D0BA", // light green
      "#A6A6A6", // light grey
      "#FCD274", // light yellow
      "#E68C7D"  // light red
    ];

    this.blockColors = {};
    this.colors = this.colorful;

    this.setColorScheme = function() {
        this.colors = this.colorful;
    };

    this.getColorForBlock = function(block){
        var len = this.colors.length;

        if (!block){
            return null;
        }
        var blockId = catsUtils.getTaskID(block.task);

        if (!this.blockColors[blockId]) {
            this.blockColors[blockId] = this.colors[this.colorCounter % len];
            this.colorCounter++;
        }
        return this.blockColors[blockId];
    };

    this.resetColorCounter = function () {
        this.blockColors = {};
        this.colorCounter = 0;
    };
}])

.service("app.cats.allocationBar.utils.blockCalculations", function () {
    this.getWidthFromValue = function (value, totalWidth, totalValue) {
        var calcValue = value * parseInt(totalWidth, 10) / parseInt(totalValue, 10);
        calcValue = Math.round(calcValue * 1000) / 1000;
        return calcValue;
    };

    this.getValueFromWidth = function(width, totalWidth, totalValue) {
        // round to full percentage points
        width = Math.round(width / totalWidth * 100) / 100 * totalWidth;
        return width / parseInt(totalWidth, 10) * parseInt(totalValue, 10);
    };

    this.calculateBlockMetrics = function(offset, originalBlockWidth, totalWidth, currentValue, remainingValue, totalValue, fixed) {
        var newWidth = originalBlockWidth;
        if(!fixed) {
            newWidth = originalBlockWidth + offset;
        }

        // calculate potential new Value from the new width
        var newValue = this.getValueFromWidth(newWidth, totalWidth, totalValue);

        // check boundaries of the new value
        var valueDiff = newValue - currentValue;

        if (newValue < 0.01) {
            newValue = 0.01;
        } else if (valueDiff > remainingValue) {
            newValue = currentValue + remainingValue; // == maxValue
        }

        // calculate actual new width from the new value
        newWidth = this.getWidthFromValue(newValue, totalWidth, totalValue);

        return {
            newWidth: newWidth,
            newValue: newValue
        };
    };
});
