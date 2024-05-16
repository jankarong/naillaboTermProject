

// Wait for the web page to be fully ready, then  run the function.
$(document).ready(function () {
    //  When an element with the 'toggle-menu' class is clicked， run the function.
    $('.toggle-menu').click(function () {
        // Find elements with the 'navigation-menu' class and switch their visibility
        $('.navigation-menu').toggle();
    });

    //When the size of the browser window changes,then run the function.
    $(window).resize(function () {
        //If the window is wider than 768 px
        if ($(window).width() > 768) {
            //show elements with the 'navigation-menu' class
            $('.navigation-menu').show();
            //else do nothing
        } else {

        }
    });
});

