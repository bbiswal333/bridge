//<<singleton>> This class prepares the Data for the chart
function DataHandler() {
    this.dataHandler = null;


    //Singleton
    var getDataHandler = function () {
        if (!this.dataHandler) {
            //Create singleton
            this.dataHandler = createInstance();
        }
        return this.dataHandler;

    }

    // build Methods
    var createInstance = function () {
        return {
            charts: [],


            createNewChart: function (chartId) {
                this.charts[chartId] = new Object();
                newChart = this.charts[chartId];
                newChart.keys = [];
                newChart.stringMappingXAxis = [];
                newChart.stringMappingYAxis = [];
                //Attributes
                newChart.type = "lineChart";
                newChart.dataTypeXAxis = "";
                newChart.showXAxisLine = "true";
                newChart.colorXAxisLine = "black";
                newChart.showXAxisText = "true";
                newChart.colorXAxisText = "black";
                newChart.xAxisLabel = "";
                newChart.showYAxisLine = "true";
                newChart.colorYAxisLine = "black";
                newChart.showYAxisText = "true";
                newChart.colorYAxisText = "black";
                newChart.dataTypeYAxis = "";
                newChart.yAxisLabel = "";
                newChart.yAxisAlign = "left";
                newChart.showCaption = "true";
                newChart.showLegend = "true";
                newChart.showGrid = "true";
                //                newChart.colorXAxis = "black";
                //                newChart.colorYAxis = "black";
                newChart.transitionDuration = "500";
                newChart.interactiveGuideLine = "true";
                newChart.dashedKeys = [];
                newChart.legendIcons = [];
                newChart.reversedAxis = "false";
                newChart.axisAreReversed = false;
                newChart.nvD3Chart = null;
                newChart.chartId = chartId;
                //Data
                newChart.data = new Object();
            },




            //Find String if exists an return position
            getIndexOfString: function (chartId, string, axis) {
                if (axis == "x") {
                    for (var i = 0; i < this.charts[chartId].stringMappingXAxis.length; i++) {
                        if (this.charts[chartId].stringMappingXAxis[i].string == string) {
                            return i;
                        }
                    }
                } else {
                    for (var i = 0; i < this.charts[chartId].stringMappingYAxis.length; i++) {
                        if (this.charts[chartId].stringMappingYAxis[i].string == string) {
                            return i;
                        }
                    }
                }

                return -1;
            },

            //Find out the DataType of X-Axis
            analyseXAxisDataType: function (chartId) {
                var value = this.charts[chartId].data[0].values[0].x;
                switch (typeof value) {
                    case "string":
                        if (Date.parse(value)) {
                            this.charts[chartId].dataTypeXAxis = "date";
                            break;
                        }
                        this.charts[chartId].dataTypeXAxis = "string";
                        break;

                    default:
                        this.charts[chartId].dataTypeXAxis = "numerical";

                }
            },

            //Find out the DataType od Y-Axis
            analyseYAxisDataType: function (chartId) {
                var value = this.charts[chartId].data[0].values[0].y;
                switch (typeof value) {

                    case "string":

                        if (Date.parse(value)) {
                            this.charts[chartId].dataTypeYAxis = "date";
                            break;
                        }

                        this.charts[chartId].dataTypeYAxis = "string";
                        break;

                    default:
                        this.charts[chartId].dataTypeYAxis = "numerical";

                }
            },
            //Converts the Strings to Date-Objects
            parseDateString: function (chartId, oldValues, axis) {

                var chart = this.getChartDescription(chartId);
                for (var i = 0; i < oldValues.length; i++) {

                    if (axis == "x") {

                        oldValues[i].x = Date.parse(oldValues[i].x);

                    } else {
                        oldValues[i].y = Date.parse(oldValues[i].y);
                    }


                }

                return oldValues;

            },


            //Replaces String with Integer beacsue of nvd3 needs values
            replaceStringValues: function (chartId, oldValues, axis) {
                var chart = this.getChartDescription(chartId);
                for (var i = 0; i < oldValues.length; i++) {

                    if (axis == "x") {

                        var index = chart.stringMappingXAxis.length;

                        var indexOfExistingString = this.getIndexOfString(chartId, oldValues[i].x, axis);
                        if (indexOfExistingString == -1) {
                            chart.stringMappingXAxis.push({
                                string: oldValues[i].x,
                                value: index
                            });
                            oldValues[i].x = index;
                        } else {
                            oldValues[i].x = indexOfExistingString;
                        }


                    } else {

                        var index = chart.stringMappingYAxis.length;

                        var indexOfExistingString = this.getIndexOfString(chartId, oldValues[i].y, axis);
                        if (indexOfExistingString == -1) {
                            chart.stringMappingYAxis.push({
                                string: oldValues[i].y,
                                value: index
                            });
                            oldValues[i].y = index;
                        } else {
                            oldValues[i].y = indexOfExistingString;
                        }
                    }


                }

                return oldValues;

            },

            //Sets the Data
            setData: function (chartId, data) {
                if (!this.charts[chartId]) {
                    this.createNewChart(chartId);
                }
                this.charts[chartId].data = data;
            },

            //Gets the Data
            getData: function (chartId) {
                return this.charts[chartId].data;
            },

            //Gets the chartObject
            getChartDescription: function (chartId) {
                if (!this.charts[chartId]) {
                    this.createNewChart(chartId);
                }
                return this.charts[chartId];
            },

            // Reverses X- and Y-Axis
            reverseAxis: function (chartId) {

                this.reverseData(chartId);
                var chart = this.getChartDescription(chartId);
                //reverse labels of axis
                var tmp = chart.yAxisLabel;
                chart.yAxisLabel = chart.xAxisLabel;
                chart.xAxisLabel = tmp;

            },
            reverseData: function (chartId) {

                // revers data
                var chart = this.charts[chartId];
                var chartdata = this.getData(chartId);
                for (var i = 0; i < chartdata.length; i++) {

                    for (var j = 0; j < chartdata[i].values.length; j++) {
                        var tmp = chartdata[i].values[j].x;
                        chartdata[i].values[j].x = chartdata[i].values[j].y;
                        chartdata[i].values[j].y = tmp;
                    }

                }


            },


            // The function returns the values of the specific keys
            fillLineChart: function (chartId) {

                if (this.charts[chartId].reversedAxis == "true" && !this.charts[chartId].axisAreReversed) {
                    this.reverseAxis(chartId);
                    this.charts[chartId].axisAreReversed = true;
                }

                var keys = this.charts[chartId].keys;
                // Create the ChartData by keys
                var chartData = [];
                var stringsAreMappedX = false;
                var stringsAreMappedY = false;
                if (this.charts[chartId].stringMappingXAxis.length == 0) {
                    this.analyseXAxisDataType(chartId);

                } else {
                    stringsAreMappedX = true;
                }
                if (this.charts[chartId].stringMappingYAxis.length == 0) {
                    this.analyseYAxisDataType(chartId);

                } else {
                    stringsAreMappedY = true;
                }
                var data = this.charts[chartId].data;
                for (var i = 0; i < data.length; i++) {

                    for (var j = 0; j < keys.length; j++) {
                        //Find the right keys
                        if (data[i].key == keys[j][0] && keys[j][4] == "true") {
                            //add color to chartData
                            data[i].color = keys[j][1];
                            data[i].area = (keys[j][2] == "true");
                            if (this.charts[chartId].dataTypeXAxis == "string" && !stringsAreMappedX) {
                                this.replaceStringValues(chartId, data[i].values, "x");
                            }
                            if (this.charts[chartId].dataTypeYAxis == "string" && !stringsAreMappedY) {
                                this.replaceStringValues(chartId, data[i].values, "y");
                            }
                            if (this.charts[chartId].dataTypeXAxis == "date") {
                                this.parseDateString(chartId, data[i].values, "x");
                            }
                            if (this.charts[chartId].dataTypeYAxis == "date") {
                                this.parseDateString(chartId, data[i].values, "y");
                            }

                            chartData.push(data[i]);
                            break;
                        }
                    }
                }

                return chartData;

            }

        }


    }

    return getDataHandler();
}