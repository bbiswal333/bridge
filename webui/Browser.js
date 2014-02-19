navigator.sayswho = function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    return M;
};

if (navigator.sayswho()[0] != "Chrome" && navigator.sayswho()[0] != "Firefox" && navigator.sayswho()[0] != "Safari" && navigator.sayswho()[0] == "MSIE" && parseFloat(navigator.sayswho()[1]) < 10)
{
	location.href="/browser_not_supported.html"
};
