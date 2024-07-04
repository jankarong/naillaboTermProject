
$(document).ready(function () {
    // When the hamburger menu is clicked
    $('.toggle-menu').click(function () {
        $('.navigation-menu').toggleClass('active');
        if ($('.navigation-menu').hasClass('active')) {
            $('.navigation-menu').css('left', '0');
        } else {
            $('.navigation-menu').css('left', '-100%');
        }
    });

    // When the close button is clicked
    $('.close-menu').click(function () {
        $('.navigation-menu').removeClass('active');
        $('.navigation-menu').css('left', '-100%');
    });

    // When the window is resized
    $(window).resize(function () {
        if ($(window).width() > 431) {
            $('.navigation-menu').removeClass('active');
            $('.navigation-menu').css('left', '0');
            $('.navigation-menu').show();
        } else {
            if (!$('.navigation-menu').hasClass('active')) {
                $('.navigation-menu').css('left', '-100%');
            }
        }
    });
});
