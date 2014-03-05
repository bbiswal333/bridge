angular.module("app.cats.allocationbar.utils", []).factory("app.cats.allocationbar.utils.colorUtils", function() {
    var colorCounter = 0;
    var gradient = new SVG.Color('#0080C0').morph('#FFDB53');

    function hex2Dec(hex_s) {
        var sum = 0;
        for (var i = 0; i < hex_s.length; i++) {
            sum += valOfChar(hex_s.charAt(i)) * Math.pow(16, hex_s.length - 1 - i);
        }

        function valOfChar(c) {
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

    function dec2Hex(dec_i) {
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

        function getSignForValue(i) {
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

    function getNextColor(offset_f) {
        offset_f = (offset_f || 0);

        //var generated = gradient.at(offset_f + ((0.618033988749895 * colorCounter) % 1)).toHex();
        var mult = 0.1;
        if (colorCounter % 2 == 0 || colorCounter == 0) {
          mult = 0.9;
        }
        var generated = gradient.at((offset_f + colorCounter * mult) % 1.0).toHex(); //Genrates 10 unique colors

        colorCounter++;

        return generated;
    }

    function getRandomColor(offset_s) {
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

    return {
        setUpGradient: function(start_s, end_s) {
            gradient = new SVG.Color(start_s).morph(end_s);
        },
        getNextColor: getNextColor,
        resetColorGenerator: function() {
            colorCounter = 0;
        },
        getRandomColor: getRandomColor
    };
});
