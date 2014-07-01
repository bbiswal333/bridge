describe("Test calculation Methods for the allocation Bar", function () {
    var blockCalculations;

    beforeEach(function () {
        module("app.cats.allocationBar.utils");

        inject(["$rootScope", "app.cats.allocationBar.utils.blockCalculations", function (rootScope, _blockCalculations) {
            blockCalculations = _blockCalculations;
            $rootScope = rootScope;
        }]);
    });

    it("should calculate new width depending on the current value", function () {
        var newWidth = blockCalculations.getWidthFromValue(1, 50, 10);

        expect(newWidth).toBe(5);
    });

    it("should calculate new value depending on the current width", function () {
        var newValue = blockCalculations.getValueFromWidth(25, 50, 8);

        expect(newValue).toBe(4); 
    });

    // calculateBlockMetrics Signature: offset, originalBlockWidth, totalWidth, currentValue, remainingValue, totalValue
    it("should calculate the new block metrics if the block is moved by 'offset' pixels", function () {
        // we increas a block that has currently a 100px width by 10px. 100px corresponds to a value of 5. max width is 200px, max value 10, remaining value 5 -> not interesting for this test
        var newBlockMetrics = blockCalculations.calculateBlockMetrics(10, 100, 200, 5, 5, 10);

        expect(newBlockMetrics.newWidth).toBe(110);
        expect(newBlockMetrics.newValue).toBe(5.5);
    });

    it("block should not be increasable if there is no remaining space", function () {
        var newBlockMetrics = blockCalculations.calculateBlockMetrics(20, 200, 200, 10, 0, 10);

        expect(newBlockMetrics.newWidth).toBe(200);
        expect(newBlockMetrics.newValue).toBe(10);
    });

    it("block should not be decreasable if it is already 0px width", function () {
        var newBlockMetrics = blockCalculations.calculateBlockMetrics(-5, 0, 200, 0, 10, 10);

        expect(newBlockMetrics.newWidth).toBe(0.2);
        expect(newBlockMetrics.newValue).toBe(0.01);
    });

});

describe("Test the color utils for the allocation bar", function () {
    var colorUtils;

    beforeEach(function () {
        module("app.cats.allocationBar.utils");

        inject(["$rootScope", "app.cats.allocationBar.utils.colorUtils", function (rootScope, _colorUtils) {
            colorUtils = _colorUtils;
            $rootScope = rootScope;
        }]);
    });

    it("should return new color for new block", function(){
        var newBlock = {'task':{'ZCPR_OBJGEXTID':1}};

        expect(colorUtils.getColorForBlock(newBlock)).toBeDefined();
    })

    it("should return different colors for different blocks", function(){
        var block1 = {'task':{'ZCPR_OBJGEXTID':1}};
        var block2 = {'task':{'ZCPR_OBJGEXTID':2}};

        expect(colorUtils.getColorForBlock(block1)).not.toBe(colorUtils.getColorForBlock(block2));
    })

    it("should return same color for same block", function(){
        var block1 = {'task':{'ZCPR_OBJGEXTID':1}};
        var block2 = block1;

        expect(colorUtils.getColorForBlock(block1)).toBe(colorUtils.getColorForBlock(block2));
    })

    it("should return color for a block without ZCPR_OBJGEXTID but with TASKTYPE", function(){
        var block1 = {'task':{'TASKTYPE':'ABC'}};

        expect(colorUtils.getColorForBlock(block1)).toBeDefined();
    })

    it("should return different colors for blocks with differn tasktypes", function(){
        var block1 = {'task':{'TASKTYPE':'ABC'}};
        var block2 = {'task':{'TASKTYPE':'DEF'}};

        expect(colorUtils.getColorForBlock(block1)).not.toBe(colorUtils.getColorForBlock(block2));
    })

    it("should start to return same colors if there are more tasks then colors", function(){
        colorUtils.colors = ['onlyOneColorCode'];
        var block1 = {'task':{'TASKTYPE':'ABC'}};
        var block2 = {'task':{'TASKTYPE':'DEF'}};

        expect(colorUtils.getColorForBlock(block1)).toBe(colorUtils.getColorForBlock(block2));
    })

    it("should reset both colorCounter AND remebered colors on reset function", function(){
        var block1 = {'task':{'TASKTYPE':'ABC'}};
        
        colorUtils.getColorForBlock(block1);

        expect(colorUtils.blockColors['ABC']).toBeDefined();  
        expect(colorUtils.colorCounter).toBe(1);

        colorUtils.resetColorCounter();  
        expect(colorUtils.blockColors['ABC']).toBeUndefined();  
        expect(colorUtils.colorCounter).toBe(0);

    })
});