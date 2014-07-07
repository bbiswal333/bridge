angular.module("app.cats.allocationBar.utils", []).service("app.cats.allocationBar.utils.colorUtils", function () {
    this.colorCounter = 0;

    this.colors = [
    
            "#1f435b",
            "#3a79b0",
            "#3e5a73",
            "#4694d7",
            "#57718d",
            "#3380ba",
            "#467aa4",
            "#36536a",
            "#03a0e5",
            "#47627c",
            "#428bca",
            "#67809f",
            "#3498db",
            "#2574a9",

           // "#2574A9",
           // "#5C97BF",
           // // "#6BB9F0",
           // "#52B3D9",
           // "#22A7F0",
           // "#3498db",
           // // "#4b77be",
           // "#89c4f4",
           // // "#3a539b",
           // "#67809f",
           // "#18334a",
           // "#2d5f8a",
           // "#428bca",
           // "#3a79b0",
           // "#4694d7",

    ];
    this.blockColors = {};

    this.getColorForBlock = function(block){
        var generated = null;
        var len = this.colors.length;

        if (!block)
            return null;

        var blockId = block.task.ZCPR_OBJGEXTID || block.task.TASKTYPE;

        if (!this.blockColors[blockId]) {
            this.blockColors[blockId] = this.colors[this.colorCounter % len];
            this.colorCounter++;
        };
        return this.blockColors[blockId]; 
    }

    this.resetColorCounter = function () {
        this.blockColors = {};
        this.colorCounter = 0;
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

    this.calculateBlockMetrics = function(offset, originalBlockWidth, totalWidth, currentValue, remainingValue, totalValue, fixed) {
        if(!fixed) {
            var newWidth = originalBlockWidth + offset;
        } else {
            var newWidth = originalBlockWidth;
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
            newValue: newValue,
        }
    }
});
