angular.module("app.cats.allocationBar.core.block", []).factory("app.cats.allocationBar.core.block", function() {
    var BarBlock = function(svg_o, stackedBarInput_o, desc_s, data_o, width_i, height_i, x, y, color_s) {
        var self = this;
        this.p = stackedBarInput_o;
        this.block = null;
        this.dragger = null;
        //this.textField = {};
        this.desc = desc_s;
        this.group = null;
        this.data = data_o;
        this.bin = null;
        var inDragMode = false;
        var hoverReseted = false;
        var binFadedIn = false; //Prevent reseting of in-progress animation

        this.initBlock = function() {
            var s = svg_o.group();
            this.group = s;
            this.block = s.foreignObject(width_i, height_i).move(x, y).on("dblclick", function() {
                self.remove();
                self.p.fireAllocChanged();
            }).attr("class", "allocation-bar-block");
            this.block.appendChild("div", {
                "style": "height: " + height_i + "px; width: 100%; background: " + color_s + ";",
                "class": "allocation-bar-block-div"
            });
            var divJQuery = $(this.block.getChild(0));

            divJQuery.append($("<div>").addClass('allocation-bar-block-name-div').text(desc_s).attr("title", desc_s));
            divJQuery.append($("<div>").addClass('allocation-bar-block-value-div'));
            divJQuery.append($("<div>").addClass('allocation-bar-block-bin-div').hide().html('<span class="glyphicon glyphicon-trash"></span>').click(function () {
                self.remove();
                self.p.fireAllocChanged();
            }));
            divJQuery.hover(function () {
                if (!binFadedIn) $(this).children(".allocation-bar-block-bin-div").fadeIn();
                binFadedIn = true;
                console.log("In");
            }, function () {
                $(this).children(".allocation-bar-block-bin-div").fadeOut(function () {
                    binFadedIn = false;
                });
                console.log("Out")
            });
            updateTextField();

            this.dragger = s.rect(5, height_i).move(x + width_i - 5, y).
            fill("#555").draggable(_dragRestrictor).attr("class", "allocation-bar-dragger");
            
            this.dragger.dragmove = _dragHandler;
            this.dragger.dragstart = function() {
                inDragMode = true;
            };
            this.dragger.dragend = function() {
                inDragMode = false;
                self.setHoverDragger(false);

                self.p.fireAllocChanged();
            };
            this.dragger.on("mouseenter", function(evt) {
                self.setHoverDragger(true);
            });
            this.dragger.on("mouseleave", function(evt) {
                if (!inDragMode) self.setHoverDragger(false);
            });
        };

        this.getCurrentValueRaw = function () {
            return self.getWidth() / self.p.getWidth() * 100;
        };

        this.getCurrentValue = function () {
            return self.p.getValueToDisplay(self.getCurrentValueRaw());
        }

        function updateTextField() {
            self.block.getChild(0).childNodes[1].innerText = self.getCurrentValue();
        }

        this.setHoverDragger = function(hover) {
            if (hover) {
                this.block.attr("class", "allocation-bar-block allocation-bar-block-active");
                this.dragger.attr("class", "allocation-bar-dragger allocation-bar-dragger-active");
                this.dragger.fill("#777"); //Gets overriden by CSS definitions
                this.dragger.animate(100).attr({
                    height: height_i + 4 * this.p.PADDING,
                    y: 0
                });
            } else if (!hoverReseted) {
                this.dragger.attr("class", "allocation-bar-block");
                this.dragger.attr("class", "allocation-bar-dragger");
                this.dragger.fill("#555");
                this.dragger.animate(100).attr({
                    height: height_i,
                    y: y
                });
            }
        };

        this.remove = function() {
            this.block.remove();
            this.dragger.remove();
            this.group.remove();

            this.p.removeBlock(this);
        };

        this.move = function(x, y) {
            if (x != null) {
                this.block.x(x);
                this.dragger.x(x + this.block.width() - 5);
            }
            if (y != null) {
                this.block.y(y);
                this.dragger.y(y);
            }

            updateTextField();
        };

        //Fot the purpose of unit testing
        this.tryToMove = function(x, y) {
            return _dragRestrictor(x, y, this.dragger);
        };

        this.getCoords = function() {
            return {
                x: this.block.x(),
                y: this.block.y(),
                x2: this.block.x() + this.block.width(),
                y2: this.block.y() + this.block.height()
            };
        };

        this.getWidth = function() {
            return this.block.width();
        };

        function _dragRestrictor(x, y, elem) {
            //No moving on y-axis
            var ret = {
                x: x,
                y: elem.y()
            }

            //Do some snapping  
            x = x - ((self.block.width() + x - elem.x()) % self.p.snapRange);

            //No moving that would reduce width below minwidth
            if (x + 5 < self.block.x() + self.p.minWidth) {
                return false;
            }

            var diff = x - elem.x();

            //No moving outside the box
            if (self.p.isInBounds(x, x + elem.width()) && (self.p.blocks.last() == self || self.p.isInBounds(self.p.blocks.last().getCoords().x + diff, self.p.blocks.last().getCoords().x2 + diff))) {
                ret.x = x;
            } else {
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
                } else {
                    return false;
                }
            }

            if (self.p.getSizeUnallocated == 0) {
                return false;
            }

            return ret;
        }

        function _dragHandler(delta) {
            self.block.width(5 + delta.coord.x - self.block.x()); //5 is length of dragger because the left egde of the dragger is taken into calculation
            self.p.glueBlocks();
        }

        this.initBlock();
    }

    return BarBlock;
});