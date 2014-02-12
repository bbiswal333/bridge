angular.module('sapCharts', [])
    .directive('valueSeries', function () {

        return {
            restrict: 'E',
            scope: {
                valueSeriesElement: '@'
            },

            link: function (scope, iElement, iAttrs, ctrl) {
                // collect title and color to a dataSet
                var dataSet = [];
                dataSet[0] = iAttrs.title;
                dataSet[1] = iAttrs.color;
                dataSet[2] = iAttrs.area;
                dataSet[3] = iAttrs.dashed; // dashed
                dataSet[4] = "true"; //Toggle Legend

                if (!scope.$parent.legendIcons) {
                    scope.$parent.legendIcons = [];
                }

                // get DataHandler
                var dataHandler = new DataHandler();
                var chartId = iElement[0].parentElement.attributes["chartId"].value;

                // set legendIcon
                dataHandler.getChartDescription(chartId).legendIcons[iAttrs.title] = iAttrs.legendicon;

                //add the dataSet to the keys
                dataHandler.getChartDescription(chartId).keys.push(dataSet);

                /* watchIgnoreIndex is needed because this function is called for each value series
                 and the chart should not be drawn before all value series are added  */
                scope.$parent.watchIgnoreIndex = iElement[0].parentElement.children.length - 1;

                // watch for Data-Changes
                scope.$parent.$watchCollection('sourceData', function () {

                    // data has changed            
                    if (scope.$parent.watchIgnoreIndex != 0) {
                        scope.$parent.watchIgnoreIndex--;
                        return;
                    }

                    // copy and set the data
                    var sourceData = JSON.parse(JSON.stringify(scope.$parent.sourceData));
                    dataHandler.setData(chartId, sourceData);

                    // handle reversed axis
                    if (dataHandler.getChartDescription(chartId).reversedAxis == "true" && dataHandler.getChartDescription(chartId).axisAreReversed) {
                        //Reverse new Data
                        dataHandler.reverseData(chartId);
                    }

                    // get Data and call NVD3
                    var chartData = dataHandler.fillLineChart(chartId);
                    var chartDescription = dataHandler.getChartDescription(chartId);
                    createLineChart(chartData, chartDescription);
                })
            },

        };
    })

.directive('nvChart', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            valueSeriesElement: '@',
            chartData: '@'
        },

        link: function (scope, iElement, iAttrs, ctrl) {
            var chartId = iAttrs.chartid;

            //get the Chart with the ID 
            var dataHandler = new DataHandler();
            var chartDescription = dataHandler.getChartDescription(chartId);

            //-------------- set all Attributes------------------------------
            chartDescription.type = iAttrs.type;
            chartDescription.showXAxisLine = iAttrs.showxaxisline;
            chartDescription.colorXAxisLine = iAttrs.colorxaxisline;
            chartDescription.showXAxisText = iAttrs.showxaxistext;
            chartDescription.colorXAxisText = iAttrs.colorxaxistext;
            chartDescription.xAxisLabel = iAttrs.xaxislabel;

            chartDescription.showYAxisLine = iAttrs.showyaxisline;
            chartDescription.colorYAxisLine = iAttrs.coloryaxisline;
            chartDescription.showYAxisText = iAttrs.showyaxistext;
            chartDescription.colorYAxisText = iAttrs.coloryaxistext;
            chartDescription.yAxisLabel = iAttrs.yaxislabel;
            chartDescription.yAxisAlign = iAttrs.yaxisalign;

            chartDescription.showCaption = iAttrs.showcaption;
            chartDescription.showLegend = iAttrs.showlegend;
            chartDescription.showGrid = iAttrs.showgrid;

            chartDescription.transitionDuration = iAttrs.transitionduration;
            chartDescription.interactiveGuideLine = iAttrs.interactiveguideline;
            chartDescription.reversedAxis = iAttrs.reversedaxis;

            //--------------- call handlers-----------------------------------
            legendHandler(scope, iElement, iAttrs, chartId, $compile);
            headerHandler(scope, iElement, $compile, iAttrs.title, iAttrs.subtitle, iAttrs.xaxislabel, iAttrs.yaxislabel);

        }
    }
});


// the function creates the header
function headerHandler(scope, iElement, $compile, title, subTitle, xaxislabel, yaxislabel) {
    // set the axisLabels to the header 
    title = title.replace("[x]", xaxislabel);
    title = title.replace("[y]", yaxislabel);

    scope.title = title;
    scope.subTitle = subTitle;
    iElement[0].title = title;

    // new angular Binding for Title
    var headerHtml = "<h1>{{title}}</h1><h2>{{subTitle}}</h2>";
    var newElement = $compile(headerHtml)(scope);
    iElement.append(newElement);

}

function legendHandler(scope, iElement, iAttrs, chartId, $compile) {
    if (iAttrs.showlegend == "true") {
        //Element shown in Chart on/off
        scope.toggleLegend = function (element) {

            var button = element.srcElement;
            var key = button.innerText;

            // check what is clicked
            if (key == "") {
                //button clicked 
                key = element.srcElement.parentElement.innerText;
            } else {
                //span clicked
                button = element.srcElement;
            }

            //get description for chart
            var index = -1;
            var chart = dataHandler.getChartDescription(chartId);

            //get index of clicked series
            for (var i = 0; i < chart.keys.length; i++) {
                if (chart.keys[i][0] == key) {
                    index = i;
                }
            }
            if (index == -1) {
                return;
            }

            var keySelected = chart.keys[index];

            //toggle button
            if (keySelected[4] == "true") {
                keySelected[4] = "false";
                button.style.opacity = "0.25";
            } else {
                keySelected[4] = "true";
                button.style.opacity = "1";
            }

            // prepare Chart
            var chartData = dataHandler.fillLineChart(chartId);
            var chartDescription = dataHandler.getChartDescription(chartId);
            createLineChart(chartData, chartDescription);


        }

        //-----------------Build legend--------------------------------------------------------

        //get legendIcons
        var legendIcons = dataHandler.getChartDescription(chartId).legendIcons;

        //create a button for each data-set
        for (var i = 0; i < dataHandler.getChartDescription(chartId).keys.length; i++) {
            var actKey = dataHandler.getChartDescription(chartId).keys[i];
            var icon = "";

            if (legendIcons && legendIcons[actKey[0]]) {
                //legendicons exists
                icon = "background-image:url(" + legendIcons[actKey[0]] + "); background-size: 100%;  background-position: right; background-repeat: no-repeat;";
            }

            var htmlButton = "<span title=\"" + actKey[0] + "\" style=\"cursor: pointer; margin-right:15px;\" ng-click=\"toggleLegend($event)\"><button alt=\"" + actKey[0] + " \"style=\"margin-right:5px; background-color:" + actKey[1] + ";" + icon + " width: 30px; height: 20px;\"></button>" + actKey[0] + "</span>";

            var newElement = $compile(htmlButton)(scope);
            iElement.append(newElement);
        }
    }
}