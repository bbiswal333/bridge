angular.module("app.cats.allocationBar.utils", ["app.cats.utilsModule"])
.service("app.cats.allocationBar.utils.colorUtils",
["app.cats.catsUtils",
function (catsUtils) {
    this.colorCounter = 0;

    this.basicBlue = [
      "#418AC9",
      "#8EB9DF"
    ];

    this.colorful = [
      "#418AC9",
      "#8EB9DF",
      "#FCB517",
      "#FCD274",
      "#8561C5",
      "#C2B0E2",
      "#E76F24",
      "#F0A470",
      "#4EA175",
      "#A7D0BA",
      "#D53F26",
      "#DD6551",
      "#707070",
      "#8A8A8A"
    ];

    this.blockColors = {};
    this.colors = this.basicBlue;

    this.setColorScheme = function(scheme) {
        if (scheme === 'colorful') {
            this.colors = this.colorful;
        } else {
            this.colors = this.basicBlue;
        }
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
