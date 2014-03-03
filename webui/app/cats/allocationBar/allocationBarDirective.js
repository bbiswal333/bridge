angular.module("app.cats.allocationbar", []).directive("app.cats.allocationbar", function () {
    var count = 0;

	var linkFn = function ($scope, elem) {
		$scope.$watch("blocks", function () {
			$scope.stackedBarInput.construct($scope.blocks);
		}, true);

		$scope.stackedBarInput = new StackedBarInput(SVG(elem[0]).size($scope.width, $scope.height), 0, 0, $scope.width, $scope.height, "#DDDDDD", 20, function (blocks) {
            $scope.$apply(function () {
                $scope.blocks = blocks;
                if (typeof $scope.onValChanged == "function") {
                    $scope.onValChanged({val: blocks});
                }
            });
        });
	};

	return {
		restrict: "E",
		scope: {
			onValChanged: "&onvalchanged",
			width: "@width",
            height: "@height",
			blocks: "=blocks"
		},
		replace: true,
		link: linkFn,
		templateUrl: "allocationBarDirective.tmpl.html"
	};
	
	// blocks_ar: [{desc: "Project A", value: 50}, {desc: "Project B", value: 25}, {desc: "Project X", value: 25}]
    function StackedBarInput (svg_o, x_i, y_i, width_i, height_i, background_s, snapRange_i, callbackOnChange_fn) {
        var self = this;
        var colorOffset = "#aaaaaa";
        var PADDING = 5;   
        var s = svg_o;
        var x = x_i;
        var y = y_i + PADDING;
        var width = width_i;
        var height = height_i - 10; //Because of expanding dragger on hovering
        var background = background_s;

        this.blocks = [];
        this.blocks.last = function () {
            if (this.length == 0) {
                return undefined;
            }

            return this[this.length - 1];
        };
        this.PADDING = PADDING;
        this.snapRange = snapRange_i;
        this.minWidth = 2 * snapRange_i; 

        s.rect(width, height).move(x, y).fill(background);

        this.construct = function (blocks_ar) {
            var len = this.blocks.length;
        	for (var i = 0; i < len; i++) {
        		this.blocks[0].remove();
        	}

            count = 0;

            for (var i = 0; i < blocks_ar.length; i++) {
                this.addBlock(blocks_ar[i]);
            }
        };

        this.addBlock = function (block_o) {
            var block_width = Math.floor((block_o.value / 100.0) * (width - 2 * PADDING));

            //Check if there is space for another block
            if ((this.blocks.length >= 1 && this.blocks.last().getCoords().x2 + block_width > x + width - PADDING) || block_width > x + width - 2 * PADDING) {
                return false;
            }

            var offset = PADDING;
            if (this.blocks.length > 0) {
                offset = this.blocks.last().getCoords().x2;
            }

            this.blocks.push(new BarBlock(s, self, block_o.desc, block_width, (height - 2 * PADDING), offset, y + PADDING, generateColor(1, 0)));
            
            offset += block_width;

            return true;
        };
    
        this.removeBlock = function (block_o) {
            var len = this.blocks.length
            for (var i = 0; i < this.blocks.length; i++) {
                if (this.blocks[i] == block_o) {
                    this.blocks.splice(0, 1);
                    this.glueBlocks();
                    return true;
                }
            }
            return false;
        };

        this.handleResize = function () {

        };

        this.getSizeAllocated = function () {
            var sizeAllocated = 0;
            forEach(this.blocks, function (block) {
                sizeAllocated += block.val;
            });

            return sizeAllocated;
        };

        this.getSizeUnallocated = function () {
            return 100 - this.getSizeAllocated();
        };

        this.isInBounds = function (x_i, x2_i) {
            return (x_i >= PADDING && x2_i <= (x + width - PADDING));
        };

        this.glueBlocks = function () {
            if (this.blocks.length > 0) {
                this.blocks[0].move(PADDING, null);
            }
            for (var i = 1; i < this.blocks.length; i++) {
                this.blocks[i].move(this.blocks[i-1].getCoords().x + this.blocks[i-1].getWidth(), null);
                //console.log("New X:" + this.blocks[i-1].getCoords().x + this.blocks[i-1].getWidth());
                //console.log(this.blocks[i-1].getCoords());
                //console.log(this.blocks[i-1].getWidth());
            }
        };

        function forEach (array_ar, function_fn) {
            for (var i = 0; i < array_ar.length; i++) {
                var res = function_fn(array_ar[i], i);
                if (typeof res != "undefined" && res != null) {
                    array_ar[i] = res;
                }
            }
        }

        this.allInsideBounds = function () {
            return (this.blocks[0].getCoords().x >= PADDING && this.blocks[this.blocks.length - 1].getCoords().x2 < width - PADDING);
        };

        this.getMaximumX = function () {
            return x + width - PADDING;
        }

        this.fireAllocChanged = function () {
            //Build array to return in style of the input array
            var res = [];

            for (var i = 0; i < this.blocks.length; i++) {
                var block = this.blocks[i];
                var newBlock = {
                    desc: block.desc,
                    value: (block.getWidth() / (width - 2 * PADDING)) * 100,
                    width: block.getWidth()
                };

                res.push(newBlock);
            }

            callbackOnChange_fn(res);
        };
    }

    function BarBlock (svg_o, stackedBarInput_o, desc_s, width_i, height_i, x, y, color_s) {
        var self = this;
        this.p = stackedBarInput_o;
        this.block = null;
        this.dragger = null;
        this.desc = desc_s;
        var inDragMode = false;
        var hoverReseted = false;

        this.initBlock = function () {
            var s = svg_o.group();
            this.block = s.rect(width_i, height_i).move(x, y).fill(color_s);
            this.dragger = s.rect(5, height_i).move(x + width_i - 5, y).fill("#555").draggable(_dragRestrictor);
            this.dragger.dragmove = _dragHandler;
            this.dragger.dragstart = function () {
                inDragMode = true;
            };
            this.dragger.dragend = function () {
                inDragMode = false;
                self.setHover(false);

                self.p.fireAllocChanged();
            };
            this.dragger.on("mouseenter", function (evt) {
                self.setHover(true);
            });
            this.dragger.on("mouseleave", function (evt) {
                if (!inDragMode) self.setHover(false);
            });
            this.block.on("dblclick", function () {
                self.remove();
            });
        };

        this.setHover = function (hover) {
            if (hover) {
                this.dragger.fill("#999");
                this.dragger.animate(100).attr({height: height_i + 4 * this.p.PADDING, y: 0});
            }
            else if (!hoverReseted) {
                this.dragger.fill("#555");
                this.dragger.animate(100).attr({height: height_i, y: y});
            }
        };

        this.remove = function () {
            this.block.remove();
            this.dragger.remove();

            this.p.removeBlock(this);
        };

        this.move = function (x, y) {
            if (x != null) {
                this.block.x(x);
                this.dragger.x(x + this.block.width() - 5);
            }
            if (y != null) {
                this.block.y(y);
                this.dragger.y(y);
            }
        };

        //Fot the purpose of unit testing
        this.tryToMove = function (x, y) {
            return _dragRestrictor(x, y, this.dragger);
        };

        this.getCoords = function () {
            return {x: this.block.x(), y: this.block.y(), x2: this.block.x() + this.block.width(), y2: this.block.y() + this.block.height()};
        };

        this.getWidth = function () {
            return this.block.width();
        };

        function _dragRestrictor (x, y, elem) {
            //No moving on y-axis
            var ret = {
                x: x,
                y: elem.y()
            }

            //Do some snapping  
            x = x - ((self.block.width() + x - elem.x()) % self.p.snapRange);

            //No moving that would reduce width below 10 (width of drager)
            if (x + 5 < self.block.x() + self.p.minWidth) {
                return false;
            }

            var diff = x - elem.x();

            //No moving outside the box
            if (self.p.isInBounds(x, x + elem.width()) && (self.p.blocks.last() == self || self.p.isInBounds(self.p.blocks.last().getCoords().x + diff, self.p.blocks.last().getCoords().x2 + diff))) { 
                ret.x = x;
            }
            else {
/*                //If only little space is left, propose using this
                if (self.p.isInBounds(elem.x(), elem.x() + elem.width()) || self.p.isInBounds(self.p.blocks.last().getCoords().x + (x - elem.x()), self.p.blocks.last().getCoords().x2 + (x - elem.x()) + 5)) {
                    console.log(self.p.getMaximumX() - 5);
                    ret.x += self.p.getMaximumX() - self.p.blocks.last().getCoords().x2 - 5;
                }
                else {
                    return false;                      
                }*/
                if (self.p.isInBounds(elem.x(), elem.x() + elem.width()) && (self.p.blocks.last() == self || self.p.isInBounds(self.p.blocks.last().getCoords().x, self.p.blocks.last().getCoords().x2))) {
                    ret.x = elem.x() + self.p.getMaximumX() - self.p.blocks.last().getCoords().x2;
                }
                else {
                    return false;                    
                }
            }

            if (self.p.getSizeUnallocated == 0) {
                return false;
            }

            return ret;
        }

        function _dragHandler (delta) {
            self.block.width(5 + delta.coord.x - self.block.x()); //5 is length of dragger because the left egde of the dragger is taken into calculation
            self.p.glueBlocks();
        }

        this.initBlock();
    }

     // offset should be hexadecimal color, e.g.: #ff99ff
    // Idea of lgorithm adapted from: http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/, visited on 25.02.2014
    function generateColor (strategy, offset) {
        if (strategy == 1) {
            var color = new SVG.Color('#0511B2').morph('#FFDB53');
            var generated = color.at(offset + ((0.618033988749895 * count) % 1)).toHex();
            count++;
            return generated;
        }
        else if (strategy == 2) {
            var r, g, b;
            r = hex2Dec(offset.substr(1, 2));
            g = hex2Dec(offset.substr(2, 2));
            b = hex2Dec(offset.substr(4, 2));

            r += Math.floor(Math.random() * 150);
            g += Math.floor(Math.random() * 150);
            b += Math.floor(Math.random() * 150);

            if (r > 255) r = 255;     
            if (g > 255) g = 255;
            if (b > 255) b = 255;

            return "#" + dec2Hex(r) + dec2Hex(g) + dec2Hex(b);
        }
    }

    function hex2Dec (hex_s) {
        var sum = 0;
        for (var i = 0; i < hex_s.length; i++) {
            sum += valOfChar(hex_s.charAt(i)) * Math.pow(16, hex_s.length - 1 - i);
        }

        function valOfChar (c) {
            c = c.toLowerCase();
            var i = parseInt(c);
            if (typeof i == "number" && i <= 9) return i;
            if (c == "a") return 10;
            else if (c == "b") return 11;
            else if (c == "c") return 12;
            else if (c == "d") return 13;
            else if (c == "e") return 14;
            else if (c == "f") return 15;
            else return null;
         }

         return sum;
    }

    function dec2Hex (dec_i) {
        var res = "";
        var a;

        while (true) {
            a = Math.floor(dec_i / 16);
            res = getSignForValue(Math.floor(dec_i % 16)) + res;
            dec_i = a;

            if (a < 16) {
                res = (a == 0) ? res : getSignForValue(a) + res;
                break;
            }
        }

        function getSignForValue (i) {
            if (i < 10) {
                return i;
            }
            if (i == 10) return "A";
            if (i == 11) return "B";
            if (i == 12) return "C";
            if (i == 13) return "D";
            if (i == 14) return "E";
            if (i == 15) return "F";            
        }

        return res;
    }
}).controller("myController", function ($scope) {
	$scope.blockdata = [{desc: "Project A", value: 50}, {desc: "Project B", value: 25}, {desc: "Project X", value: 25}];

	$scope.addBlock = function () {
		$scope.blockdata.push({name: "Project Blah!", value: 10});
	}

	$scope.myCallback = function (val) {
		$scope.value = val;
		console.log(val);
	};
});