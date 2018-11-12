
(function($){
  $(function(){
    
    $('.sidenav').sidenav();
    
  }); // end of document ready
})(jQuery); // end of jQuery name space

$(document).ready(function () {
  $('.collapsible').collapsible();
});

$(document).ready(function () {
  $('.modal').modal();
  $('.dropdown-trigger').dropdown();
});

$(document).ready(function () {
  $('.modal').modal();
});

$(document).ready(function () {
  $('.carousel').carousel();
});

$(function () { $('.carousel.carousel-slider').carousel({ full_width: true }); });

$('.carousel').carousel({
  padding: 200
});

autoplay();
function autoplay() {
  $('.carousel').carousel('next');
  setTimeout(autoplay, 4500);
}

$(document).ready(function () {
  $('.tabs').tabs();
});

$(document).ready(function () {
  $('.tooltipped').tooltip();
});

$(document).ready(function () {
  $('select').formSelect();
});

$(document).ready(function () {
  $('.parallax').parallax();
});

$(document).ready(function () {
  $('.tabs').tabs();
});