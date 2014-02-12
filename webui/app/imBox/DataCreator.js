

function DataCreator() {

    this.generateData = function (range) {

        //Data Generator

        this.data = [];

        valueSeries1 = [];

        valueSeries2 = [];

        for (var i = 0; i < range; i++) {

            valueSeries1.push({ x: i, y: Math.sin(i / 10) });

            valueSeries2.push({ x: i, y:  Math.cos(i / 10) });

        }

        this.data.push({ values: valueSeries1, key: "sin"},

                   { values: valueSeries2, key: "cos"}

                   );

        return this.data;

    };



    this.generateDashedData = function (range) {

        //Data Generator

        this.data = [];

        valueSeries1 = [];

        valueSeries2 = [];

        for (var i = 0; i < range/2; i++) {

            valueSeries1.push({ x: i, y: Math.sin(i / 10) });          

        }

        for (var i = range / 2; i < range; i++) {

                   

            valueSeries2.push({ x: i, y: Math.sin(i / 10) });

        }

        this.data.push({ values: valueSeries1, key: "sin" },

                      { values: valueSeries2, key: "cos" }

                      );

        return this.data;

    };



    this.generateMonthData = function () {

        //Data Generator



        var addDays = function addDays(dateObj, numDays) {

            return new Date(dateObj.getTime() + (numDays * 24 * 60 * 60 * 1000));

        };



        this.data = [];

        valueSeries1 = [];

        valueSeries2 = [];



        valueSeries1.push({ x: "Jan 01", y: 10 });

        valueSeries2.push({ x: "Jan 01", y: 20 });



        valueSeries1.push({ x: "Feb 01", y: 30 });

        valueSeries2.push({ x: "Feb 01", y: 40 });



        valueSeries1.push({ x: "Dec 01", y: 50 });

        valueSeries2.push({ x: "Dec 01", y: 60 });



        valueSeries1.push({ x: "Jan 02", y: 70 });

        valueSeries2.push({ x: "Jan 02", y: 80 });







        var format = d3.time.format("%b %y");

        for (var i = 0; i < valueSeries1.length; i++) {



            valueSeries1[i].x = addDays(format.parse(valueSeries1[i].x), 15);

            valueSeries2[i].x = addDays(format.parse(valueSeries2[i].x), 15);



        }



        this.data.push({ values: valueSeries1, key: "sin" },

                   { values: valueSeries2, key: "cos" }

                   );



        return this.data;

    };



    //Generates theSAPUI5 sample Data for LineChart

     this.generateSapUI5Data = function () {

         

         //Data looks like

         /*

          [

                        { Country: "Canada", revenue: 410.87, profit: -141.25, population: 34789000 },

                        { Country: "China", revenue: 338.29, profit: 133.82, population: 1339724852 },

                        { Country: "France", revenue: 487.66, profit: 348.76, population: 65350000 },

                        { Country: "Germany", revenue: 470.23, profit: 217.29, population: 81799600 },

                        { Country: "India", revenue: 170.93, profit: 117.00, population: 1210193422 },

                        { Country: "United States", revenue: 905.08, profit: 609.16, population: 313490000 }

                ]

         */





         this.data = [];

         valueSeries1 = [];

         valueSeries2 = [];

         

         //Line 1

         valueSeries1.push({ x: "Canada", y: 410.87 });

         valueSeries1.push({ x: "China", y:  338.29 });

         valueSeries1.push({ x: "France", y: 487.66 });

         valueSeries1.push({ x: "Germany", y: 470.23 });

         valueSeries1.push({ x: "India", y: 170.93 });

         valueSeries1.push({ x: "United States", y: 905.08 });



         //Line 2

         valueSeries2.push({ x: "Canada", y: -141.25 });

         valueSeries2.push({ x: "China", y: 133.82 });

         valueSeries2.push({ x: "France", y: 348.76 });

         valueSeries2.push({ x: "Germany", y: 217.29 });

         valueSeries2.push({ x: "India", y: 117.00 });

         valueSeries2.push({ x: "United States", y: 609.16 });



         //add to data

         this.data.push({ values: valueSeries1, key: "Profit" },

                   { values: valueSeries2, key: "Revenue" }

                   );







            







         return this.data;

    };

    











    // The function changes the values of the data-Attribute

    this.changeData = function () {

        rand = Math.floor((Math.random() * 100) + 1);

        return this.generateData(rand);

    };

}

   

