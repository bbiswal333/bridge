angular.module("app.cats.allocationBar.utils", []).service("app.cats.allocationBar.utils.colorUtils", function () {
    var colorCounter = 0;

    var colors = [
        "#428BCA",
        "#6cb9e3",
        "#a4d8f9",
        "#c4e8ff",
        "#dff5ff",
        "#Fff7e1",
        "#ffe9b8",
        "#ffd07e",
        "#ffb541",
        "#ffa317"
    ];

    this.getNextColor = function(blockIndex) {
        var generated = null;
        var len = colors.length;

        if (blockIndex != undefined) {
            colorCounter = blockIndex;
        };

        if (Math.floor(colorCounter / len) % 2 == 0) {
            generated = colors[colorCounter % len];
        }
        else {
            generated = colors[len - 1 - (colorCounter % len)];
        }

        colorCounter++;

        return generated;
    }

    this.resetColorCounter = function () {
       colorCounter = 0;
    }
})

.service("app.cats.allocationBar.utils.blockCalculations", function () {
    this.getWidthFromValue = function (value, totalWidth, totalValue) {
        var calcValue = value * parseInt(totalWidth, 10) / parseInt(totalValue, 10);
        calcValue = Math.round(calcValue * 1000) / 1000;
        return calcValue;
    }

    this.getValueFromWidth = function(width, totalWidth, totalValue) {
        // round to full percentage points
        width = Math.round(width / totalWidth * 100) / 100 * totalWidth;
        return width / parseInt(totalWidth, 10) * parseInt(totalValue, 10);
    }

    this.calculateBlockMetrics = function(offset, originalBlockWidth, totalWidth, currentValue, remainingValue, totalValue) {
        var newWidth = originalBlockWidth + offset;

        // calculate potential new Value from the new width
        var newValue = this.getValueFromWidth(newWidth, totalWidth, totalValue);

        // check boundaries of the new value
        var valueDiff = newValue - currentValue;

        if (newValue < 0) {
            newValue = 0;
        } else if (valueDiff > remainingValue) {
            newValue = currentValue + remainingValue; // == maxValue
        }

        // calculate actual new width from the new value
        newWidth = this.getWidthFromValue(newValue, totalWidth, totalValue);

        return {
            newWidth: newWidth,
            newValue: newValue,
        }
    }
});
