angular.module("app.cats.allocationBar.core.control", ["app.cats.allocationBar.core.block"]).factory("app.cats.allocationBar.core.control", [
    "app.cats.allocationBar.utils.colorUtils",
    "app.cats.allocationBar.core.block",
    function(colorUtils, BarBlock) {
        // blocks_ar: [{desc: "Project A", value: 50, data: {}}, {desc: "Project B", value: 25, data: {}}, {desc: "Project X", value: 25, data: {}}]
        var StackedBarInput = function(svg_o, x_i, y_i, width_i, height_i, snapRange_i, padding_i, callbackOnChange_fn, callbackOnAdd_fn, callbackOnRemove_fn, getValueToDisplay_fn) {
            var self = this;
            var colorOffset = "#aaaaaa";
            var PADDING = (padding_i || 5);
            var s = svg_o;
            var x = x_i;
            var y = y_i + PADDING;
            var width = width_i;
            var height = height_i - 2 * PADDING; //Because of expanding dragger on hovering

            this.blocks = [];
            this.blocks.last = function() {
                if (this.length == 0) {
                    return undefined;
                }

                return this[this.length - 1];
            };
            this.PADDING = PADDING;
            this.snapRange = snapRange_i;
            this.minWidth = 2 * snapRange_i;

            this.getValueToDisplay = getValueToDisplay_fn;

            //Draw background (with add functionality)
            var bgPnl = s.foreignObject(width, height).move(x, y).fill("#DDDDDD").on("click", function () {
                callbackOnAdd_fn(self.getSizeUnallocated());
            }).attr("class", "allocation-bar-background-panel");

            bgPnl.appendChild("div", {
                style: "width: " + width + "px; height: " + height + "px;",
                class: "allocation-bar-background-panel-div"
            });


            this.construct = function(blocks_ar) {
                var len = this.blocks.length;
                for (var i = 0; i < len; i++) {
                    this.blocks[0].remove();
                }

                //Reset color generation service, so the same colors as before will be generated in the same order
                colorUtils.resetColorGenerator();

                for (var i = 0; i < blocks_ar.length; i++) {
                    this.addBlock(blocks_ar[i], (i == blocks_ar.length - 1));
                }
            };

            this.addBlock = function(block_o, fireChange) {
                var block_width = Math.floor((block_o.value / 100.0) * (width - 2 * PADDING));

                //Check if there is space for another block
                if ((this.blocks.length >= 1 && this.blocks.last().getCoords().x2 + block_width > x + width - PADDING) || block_width > x + width - 2 * PADDING) {
                    return false;
                }

                var offset = PADDING;
                if (this.blocks.length > 0) {
                    offset = this.blocks.last().getCoords().x2;
                }

                this.blocks.push(new BarBlock(s, self, block_o.desc, block_o.data, block_width, (height - 2 * PADDING), offset, y + PADDING, colorUtils.getNextColor(0.0)));

                offset += block_width;

                if (fireChange) self.fireAllocChanged();

                return true;
            };

            this.removeBlock = function(block_o) {
                var len = this.blocks.length
                for (var i = 0; i < this.blocks.length; i++) {
                    if (this.blocks[i] == block_o) {
                        callbackOnRemove_fn(block_o);   
                        this.blocks.splice(i, 1);
                        this.glueBlocks();
                        return true;
                    }
                }
                return false;
            };

            this.handleResize = function() {

            };

            this.getSizeAllocated = function() {
                var sizeAllocated = 0;
                forEach(this.blocks, function(block) {
                    sizeAllocated += block.getCurrentValueRaw();
                });

                return sizeAllocated;
            };

            this.getSizeUnallocated = function() {
                return 100 - this.getSizeAllocated();
            };

            this.isInBounds = function(x_i, x2_i) {
                return (x_i >= PADDING && x2_i <= (x + width - PADDING));
            };

            this.glueBlocks = function() {
                if (this.blocks.length > 0) {
                    this.blocks[0].move(PADDING, null);
                }
                for (var i = 1; i < this.blocks.length; i++) {
                    this.blocks[i].move(this.blocks[i - 1].getCoords().x + this.blocks[i - 1].getWidth(), null);
                }
            };

            function forEach(array_ar, function_fn) {
                for (var i = 0; i < array_ar.length; i++) {
                    var res = function_fn(array_ar[i], i);
                    if (typeof res != "undefined" && res != null) {
                        array_ar[i] = res;
                    }
                }
            }

            this.allInsideBounds = function() {
                return (this.blocks[0].getCoords().x >= PADDING && this.blocks[this.blocks.length - 1].getCoords().x2 < width - PADDING);
            };

            this.getMaximumX = function() {
                return x + width - PADDING;
            }

            this.fireAllocChanged = function() {
                //Build array to return (structured like the input array)
                var res = [];

                for (var i = 0; i < this.blocks.length; i++) {
                    var block = this.blocks[i];
                    var newBlock = {
                        desc: block.desc,
                        value: (block.getWidth() / (width - 2 * PADDING)) * 100,
                        data: block.data
                    };

                    res.push(newBlock);
                }

                callbackOnChange_fn(res);
            };

            this.getWidth = function() {
                return width - 2 * PADDING;
            };
        }

        return StackedBarInput;
    }
]);
