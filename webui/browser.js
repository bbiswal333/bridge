navigator.sayswho = function()
{
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident|iceweasel(?=\/))\/?\s*([\d\.]+)/i) || [];
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
    if (navigator.sayswho()[0] == "Firefox" && parseFloat(navigator.sayswho()[1]) >= 17)    return true;
    if (navigator.sayswho()[0] == "Safari" && parseFloat(navigator.sayswho()[2]) >= 7)      return true;
    if (navigator.sayswho()[0] == "Safari" && parseFloat(navigator.sayswho()[3]) >= 7)      return true;
    if (navigator.sayswho()[0] == "Iceweasel" && parseFloat(navigator.sayswho()[1]) >= 2)   return true;    
    if (navigator.sayswho() == "IE 11.0")                                                   return true;
    return false;
};

if(!navigator.browserValid())
{
    location.href="/browser_not_supported.html";
}