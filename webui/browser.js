navigator.sayswho = function()
{
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/([\.\d]+)/i))!== null) M[2]= tem[1];
    return M;
};

navigator.browserValid = function()
{    
    if (navigator.sayswho()[0] == "Chrome" && parseFloat(navigator.sayswho()[1]) >= 32)     return true;
    if (navigator.sayswho()[0] == "Firefox" && parseFloat(navigator.sayswho()[1]) >= 27)    return true;
    if (navigator.sayswho()[0] == "Safari" && parseFloat(navigator.sayswho()[3]) >= 7)      return true;
    if (navigator.sayswho()[0] == "MSIE" && parseFloat(navigator.sayswho()[1]) >= 11)       return true;
    return false;
};

if(!navigator.browserValid())
{
    location.href="/browser_not_supported.html";
}