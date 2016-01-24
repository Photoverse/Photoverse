$(document).ready(function () {
    var windowSize = $(window).height();
    $('.page').height($(window).height());

    $('#get-started').click(function () {
       $("html, body").animate({ scrollTop: windowSize });
    });
});