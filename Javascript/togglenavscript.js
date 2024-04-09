$(document).ready(function () {
    $('.toggle-menu').click(function () {
        $('.navigation-menu').toggle();
    });


    $(window).resize(function () {
        if ($(window).width() > 768) {

            $('.navigation-menu').show();
        } else {

        }
    });
});
