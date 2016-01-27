$(function() {

    $(document).ready(function() {
        // Resizing and smooth movement.
        var windowSize = $(window).height();
        $('.page').height($(window).height());
        
        $(window).resize(function(){
            windowSize = $(window).height();
            // $('.page').height($(window).height());
        });

        $('#get-started').click(function () {
           $("html, body").animate({ scrollTop: windowSize });
        });
        
        $('#submit_image_button').click(function () {
           $("html, body").animate({ scrollTop: windowSize*2 });
        });
        
        $('#finished').click(function () {
           $("html, body").animate({ scrollTop: windowSize });
        });
    });

    // Helper Variables
    var requestCounter = 0;

    // Variable for socket information.
    var socket = io();

    // Buttons
    var $submitButton = $('#submit_image_buttom');

    // Input Fields
    var $urlInputField = $('#image_url');

    // Results List
    var $resultsList = $('.tag_list')

    function getListFromNumber(number) {
        return {headListItem: $('.tag_list > li#requestNumber-'+number+''), loadingImage: $('.tag_list > li#requestNumber-'+number+' > .content > ul > img'), placeToAdd: $('.tag_list > li#requestNumber-'+number+' > .content > ul'), tagArea: $('.tag_list > li#requestNumber-'+number+' > .tagImages')};
    }

    $submitButton.click(function() {
        var url = $urlInputField.val().trim();

        if (url.length < 5 || url.indexOf(" ") > -1 || (!url.indexOf(".jpg") > -1 && url.indexOf(".jpeg") > -1 && url.indexOf(".png") > -1)) {
            return;
        }
        
        var tags = "<li id='requestNumber-"+requestCounter+"'><div class='tagImages'><img src=" + url + " /></div><div class='content'><ul><img src='pictures/ajax-loader.gif'/></ul></div></li>"
        $resultsList.append(tags);

        socket.emit('FindPhotoTags', {'url':url, 'requestCount':requestCounter});

        requestCounter++;

    });

    socket.on('FindPhotoTagResults', function(data) {

        var listTarget = getListFromNumber(data.requestCount);

        if (data.result == "Failure") {
            // Remove the list item.
            listTarget.headListItem.remove();
            return;
        }
        
        listTarget.loadingImage.remove();

        var count = 0;

        for (var iframe in data.results.iframes) {
            if (count <= 5) {
                listTarget.placeToAdd.append("<li>" + data.results.iframes[iframe].iframe + "</li>");
            }
            count += 1;
        }

        var tags = "";

        for (var tag in data.results.tags) {
            tags += data.results.tags[tag].class + " ";
        }

        listTarget.tagArea.append("<p>" + tags + "</p>");

    });

    socket.on('disconnect', function() {
        $submitButton.prop('disabled', true);
        console.log("Disconnected from the server.");
    });

    socket.on('reconnect', function() {
        $submitButton.prop('disabled', false);
        console.log("Reconnected to the server.");
    });

});