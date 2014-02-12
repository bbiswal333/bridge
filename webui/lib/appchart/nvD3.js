// The function will be called if the data changes
function reDraw(chart, data, chartDescription) {
    d3.select('#' + chartDescription.chartId + ' svg')
        .datum(data); //.call(chart);

}


//The function handles all styles for NVD3
function createLineChart(data, chartDescription) {
    nv.addGraph(function () {

        var chart = null;

        if (chartDescription.nvD3Chart == null) {

            switch (chartDescription.type) {

                case "barChart":
                    //----------is barChart----------------
                    chart = nv.models.multiBarChart();
                    chart.stacked(true);

                    if (data.length == 1) {
                        // for stacked or grouped
                        // (makes no sense if only one data-set)
                        chart.showControls(false);
                    }

                    break;

                default:
                    //----------is lineChart----------------
                    chart = nv.models.lineChart();
                    chart.useInteractiveGuideline(chartDescription.interactiveGuideLine == "true");

                    break;
            }


            styleXAxis(chart, chartDescription);
            styleYAxis(chart, chartDescription);
            styleChart(chart, chartDescription, data);

            chartDescription.nvD3Chart = chart;

        } else {
            //----------- is a redraw----------------
            chart = chartDescription.nvD3Chart;
            reDraw(chart, data, chartDescription);
        }

        //------ make lines dashed-----------------
        chart.update();
        handleDashedPaths(data, chartDescription);
        chart.update();


        return chart;
    });
}


//The function styles the X-Axis for NVD3 
function styleXAxis(chart, chartDescription) {

    //------------------XAxis-----------------------

    chart.showXAxis(true);

    //----------------text styles-------------------------------------------------------   
    if (chartDescription.showXAxisText == "true") {
        addStyle(".nv-x.nv-axis", 'fill:' + chartDescription.colorXAxisText + ';');
    } else {
        addStyle(".nv-x.nv-axis text", 'opacity: 0;');
        chart.xAxis.showMaxMin(false);
    }


    //----------------line styles------------------------------------------------------- 
    if (chartDescription.showXAxisLine == "true") {

        addStyle(".nvd3 .nv-axis.nv-x path.domain", 'stroke:' + chartDescription.colorXAxisLine + '; stroke-opacity: 1; stroke-width:2px');
    } else {
        addStyle(".nvd3 .nv-axis.nv-x path.domain", "stroke-opacity: 0;stroke-width:0px");
    }

    //----------------other styles for X-Axis-------------------------------------------
    chart.xAxis
        .showMaxMin(false)
        .orient("bootom");

    // Possibility for rotating Labels
    // chart.xAxis.rotateLabels(-45);



    //----------Format xAxis by DataType------------------------------------------------
    if (chartDescription.dataTypeXAxis == "string") {
        //DataType is String
        chart.xAxis.ticks(chartDescription.stringMappingXAxis.length - 1);
        chart.xAxis.tickFormat(function (d) {
            if (!d.toString().match(/^[+-]?[0-9]+$/)) {
                return;
            }
            return chartDescription.stringMappingXAxis[d].string;
        });
    }


    if (chartDescription.dataTypeXAxis == "date") {
        //DataType is Date
        chart.xAxis.tickFormat(function (d) {
            return d3.time.format('%b %y')(new Date(d));
        });
    }


    if (chartDescription.dataTypeXAxis == "numerical") {
        //DataType is a number
        chart.xAxis.tickFormat(d3.format(',r'));
    }
}



function styleYAxis(chart, chartDescription) {

    chart.showYAxis(true);

    //--------------------text styles-----------------------------------------------    
    if (chartDescription.showYAxisText == "true") {

        addStyle(".nv-y.nv-axis", 'fill:' + chartDescription.colorYAxisText + ';');
    } else {
        addStyle(".nv-y.nv-axis text", 'opacity: 0;');
        chart.yAxis.showMaxMin(false);
    }

    //--------------------line styles----------------------------------------------
    if (chartDescription.showYAxisLine == "true") {
        addStyle(".nvd3 .nv-axis.nv-y path.domain", 'stroke:' + chartDescription.colorYAxisLine + '; stroke-opacity: 1; stroke-width:2px');
    } else {
        addStyle(".nvd3 .nv-axis.nv-y path.domain", "stroke-opacity: 0;stroke-width:0px");
    }


    //--------------------other styles for Y-Axis---------------------------------

    chart.yAxis
        .showMaxMin(false);


    //----------------------Align------------------------------------------------

    chart.rightAlignYAxis(chartDescription.yAxisAlign == "right");

    if (chartDescription.yAxisAlign == "right") {
        chart.margin({
            right: 90
        });
    } else {
        chart.margin({
            left: 90
        });
    }



    //--------------------Format yAxis by DataType--------------------------------


    if (chartDescription.dataTypeYAxis == "string") {
        //DataType is String
        chart.yAxis.tickFormat(function (d) {
            if (!d.toString().match(/^[+-]?[0-9]+$/)) {
                return;
            }
            return chartDescription.stringMappingYAxis[d].string;
        });
    }


    if (chartDescription.dataTypeYAxis == "date") {
        //DataType is Date
        chart.yAxis.tickFormat(function (d) {

            return d3.time.format('%b %y')(new Date(d));
        });
    }


    if (chartDescription.dataTypeYAxis == "numerical") {
        //DataType is a number
        chart.yAxis.tickFormat(d3.format(',r'));
    }

}



function styleChart(chart, chartDescription, data) {

    //-----------------Tooltip------------------------
    /* 
    Possibility to configure the tooltip
    .tooltipContent(function (key, y, e, graph) {
    return '<h3>' + key + '</h3>' + '<p>' + e + '% at ' + y + '</p>'
    })
    */


    //------------------Legend--------------------------
    //should be always false, because we have our own legend
    chart.showLegend(false);


    //------------------Chart----------------------------
    d3.select('#' + chartDescription.chartId + ' svg')
        .datum(data)
        .call(chart);



    //------------------Resize-----------------------------
    nv.utils.windowResize(chart.update);



    //------------------Other Styles-----------------------

    //Grid
    if (chartDescription.showGrid == "false") {
        addStyle(".tick line:not(.zero)", "opacity: 0");
        addStyle(".tick major line:not(.zero)", "opacity: 0");
    }

}


// the function styles lines dashed
function handleDashedPaths(data, chartDescription) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < chartDescription.keys.length; j++) {

            if (chartDescription.keys[j][0] == data[i].key) {

                // This key will be shown
                if (chartDescription.keys[j][3] == "true") {
                    //will be dashed
                    document.getElementById(chartDescription.chartId).getElementsByClassName("nv-series-" + i)[0].setAttribute("style", "stroke-dasharray: 5, 5, 5");
                } else {
                    // will not be dashed
                    var series = document.getElementById(chartDescription.chartId).getElementsByClassName("nv-series-" + i)[0];
                    if (!series) {
                        continue;
                    }
                    series.setAttribute("style", "stroke-dasharray:");
                }
                break;
            }
        }

    }

}


//the function adds a style to the head
function addStyle(element, rule) {

    // create a new style sheet 
    var styleTag = document.createElement("style");
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(styleTag);

    var sheet = styleTag.sheet ? styleTag.sheet : styleTag.styleSheet;

    // add a new rule to the style sheet
    if (sheet.insertRule) {
        sheet.insertRule(element + " {" + rule + ";}", 0);
    } else {
        sheet.addRule(element, rule, 0);
    }

}