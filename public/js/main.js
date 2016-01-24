$(document).ready(function () {
    var windowSize = $(window).height();
    $('.page').height($(window).height());
    
    $(window).resize(function(){
        windowSize = $(window).height();
        // $('.page').height($(window).height());
    });

    $('#get-started').click(function () {
       $("html, body").animate({ scrollTop: windowSize });
    });
    
    $('#submit').click(function () {
       $("html, body").animate({ scrollTop: windowSize*2 });
    });
    
    $('#finished').click(function () {
       $("html, body").animate({ scrollTop: windowSize });
    });
});