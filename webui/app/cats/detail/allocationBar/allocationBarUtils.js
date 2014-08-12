angular.module("app.cats.allocationBar.utils", []).service("app.cats.allocationBar.utils.colorUtils", function () {
    this.colorCounter = 0;

    this.colors = [
      "#418AC9",
      "#8EB9DF"
    ];
    this.blockColors = {};

    this.getColorForBlock = function(block){
        var len = this.colors.length;

        if (!block){
            return null;
        }
        var blockId = "" + block.task.ZCPR_OBJGEXTID + block.task.TASKTYPE + block.task.RAUFNR + block.task.ZZSUBTYPE;

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
})

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
