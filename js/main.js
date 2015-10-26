var tracks = [
    { "name": "Landslide", "artist": "Oh Wonder", "src": "sound/track1.mp3" },
    { "name": "Tokyo (Subranger Remix)", "artist": "Ark Patrol", "src": "sound/track2.mp3" }
]; // Array of tracks to randomly select from on page load

$(document).ready(function() {
    var playerr = $("#player").get(0);

    playerr.onended = function() {
        playerControl.pause();
    }
    
    $("#play").on("click", function(e) {
        if (playerr.paused) {
            playerControl.play();
        } else {
            playerControl.pause();
        }
    });
    
    $("#mute").on("click", function(e) {
        if (playerr.muted) {
            playerr.muted = false;
            $("#mute").addClass("fa-volume-up");
            $("#mute").removeClass("fa-volume-off");
        } else {
            playerr.muted = true;
            $("#mute").addClass("fa-volume-off");
            $("#mute").removeClass("fa-volume-up");
        }
    });

    // Nav cursor hover thingy
    $(".nav li a").hover(function() {
        var width = $(this).parent().width();
        var loc = $(this).offset().left;

        $(".cursor").attr("style", "left: " + loc + "px; width: " + width + "px;");
    }, function() {
        $(".cursor").attr("style", "left: -10px; width: 0;");
    });

    $(window).scroll(function() {
        // Parallax
        var height = $(document).height() - $(window).height();
        var percent = ($(window).scrollTop() / height) * 100;

        if (percent > 100) percent = 100;

        $("#u1").css("background-position", "0% " + percent + "%");
        $(".links").css("background-position", "0% " + percent + "%");

        // Back to top button
        if ($(window).scrollTop() >= $(".universe:nth-child(2)").offset().top) {
            $(".btt").addClass("shown");
        } else {
            $(".btt").removeClass("shown");
        }
    });

    // Nav scrolls
    $("#about").click(function() {
        $("html, body").animate({
            scrollTop: $(".universe:nth-child(2)").offset().top
        }, 1000);
    });

    // Back to top
    $(".btt").click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, 1000);
    });
});

$(window).load(function() {
    var track = tracks[Math.floor(Math.random() * tracks.length)];
    var playerr = $("#player").get(0);

    playerr.src = track.src;
    playerr.load();

    playerControl.play();

    $("#nowplaying").html(track.name + " - " + track.artist);
    $("#nowplaying").slideDown();
});

var playerControl = {
    "play": function() {
        $("#player").get(0).play();
        $("#play").removeClass("fa-play");
        $("#play").addClass("fa-pause");
    },
    "pause": function() {
        $("#player").get(0).pause();
        $("#play").addClass("fa-play");
        $("#play").removeClass("fa-pause");
    }
};