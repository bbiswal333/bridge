(function(){
var canvas = {},
    centerX = 0,
    centerY = 0,
    color = '',
    rectColor = '',
    containers = document.getElementsByClassName('button')
    context = {},
    element = {},
    radius = 0,

    requestAnimFrame = function () {
      return (
        window.requestAnimationFrame       || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    } (),
      
    init = function () {
      containers = Array.prototype.slice.call(containers);
      console.log(" lulkjfd");
      for (var i = 0; i < containers.length; i += 1) {
        canvas = document.createElement('canvas');
        canvas.addEventListener('click', press, false);
        containers[i].appendChild(canvas);
        canvas.style.width ='100%';
        canvas.style.height='100%';
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    },
      
    press = function (event) {
      color = event.toElement.parentElement.dataset.color;
      if (color == 'light'){
        rectColor = '#fff';
      }
      else if (color == 'dark'){
        rectColor = '#000';
      }
      else if (color == 'disabled'){
        rectColor = '#e1e1e1';
      }
      else {
        rectColor = '#999';
      }
      element = event.toElement;
      context = element.getContext('2d');
      radius = 0;
      centerX = event.offsetX;
      centerY = event.offsetY;
      draw();
      context.clearRect(0, 0, element.width, element.height);
      
    },
      
    draw = function () {
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = rectColor;
      context.fill();
      radius += 10;
      if (radius < element.width) {
        resetFade();
        requestAnimFrame(draw);
      }
      if (radius >= element.width){
        
        $('canvas').addClass('fadeOut');
        setTimeout(
          function() 
          {
             context.clearRect(0, 0, element.width, element.height);
          }, 50);
       
      }
    };
    resetFade = function(){
      $('canvas').removeClass('fadeOut');
    };

init();
})();