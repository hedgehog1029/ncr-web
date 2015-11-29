var tracks = [
    { "name": "Landslide", "artist": "Oh Wonder", "src": "sound/track1.mp3" },
    { "name": "Tokyo (Subranger Remix)", "artist": "Ark Patrol", "src": "sound/track2.mp3" },
    { "name": "Koto", "artist": "CloZee", "src": "sound/track3.mp3" }
]; // Array of tracks to randomly select from on page load

var pageData = {
    "store": localStorage
}; // Global data store

$(document).ready(function() {
    notifier.obj = $(".notifier"); // initialize notifier object

    var playerr = $("#player").get(0);

    playerr.onended = function() {
        playerControl.pause();

        $("#forward").click();
    }
    
    $("#play").on("click", function(e) {
        if (playerr.paused) {
            playerControl.play();
        } else {
            playerControl.pause();
        }
    });

    var volState = 2;
    
    $("#mute").on("click", function(e) {
        if (volState == 2) {
            playerControl.vol.set(.5);

            volState = 1;
        } else if (volState == 1) {
            playerControl.vol.set(0);

            volState = 0;
        } else if (volState == 0) {
            playerControl.vol.set(1);

            volState = 2;
        } else {
            volState = 2;
        }
    });

    $("#back").on("click", function(e) {
        if (pageData.nowplaying == 0) {
            pageData.nowplaying = tracks.length;
        }

        pageData.nowplaying = pageData.nowplaying - 1;

        playerControl.load(pageData.nowplaying);
        playerControl.play();
    });

    $("#forward").on("click", function(e) {
        if (pageData.nowplaying == tracks.length - 1) {
            pageData.nowplaying = -1;
        }

        pageData.nowplaying = pageData.nowplaying + 1;

        playerControl.load(pageData.nowplaying);
        playerControl.play();
    });

    // Nav cursor hover thingy
    $(".nav li a").hover(function() {
        var width = $(this).parent().width();
        var loc = $(this).offset().left;

        $(".cursor").attr("style", "left: " + loc + "px; width: " + width + "px;");
    }, function() {
        $(".cursor").attr("style", "left: -10px; width: 0;");
    });

    $(".cursor").hover(function() {
        var width = $(this).width();
        var loc = $(this).offset().left;

        $(".cursor").attr("style", "left: " + loc + "px; width: " + width + "px;");
    }, function() {
        $(".cursor").css("left", "-10px");
        $(".cursor").css("width", "0");
    });

    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();

        // Parallax
        var height = $(document).height() - $(window).height();
        var percent = (scrollTop / height) * 100;

        if (percent > 100) percent = 100;

        var hPercent = (scrollTop / $(window).height()) * 100;

        $("#u1").css("background-position", "0% " + hPercent + "%");
        $(".links").css("background-position", "0% " + percent + "%");
        $(".universe:nth-child(4)").css("background-position", "0% " + percent + "%");

        // Back to top button
        if (scrollTop >= $(".universe:nth-child(2)").offset().top) {
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

    $("#events").click(function() {
        $("html, body").animate({
            scrollTop: $(".universe:nth-child(3)").offset().top
        }, 1100);
    });

    $("#gaming").click(function() {
        $("html, body").animate({
            scrollTop: $(".universe:nth-child(4)").offset().top
        }, 1200);
    });

    // Nav login/register
    $("#register").click(function() {
        pageData.sso_mode = "register";

        $("#sso-mode").html("Register: ");
        $("body .user").addClass("show");
    });

    $("#login").click(function() {
        pageData.sso_mode = "login";

        $("#sso-mode").html("Login: ");
        $("body .user").addClass("show");
    });

    $("#user").click(function() {
        $("body .user-menu").addClass("show");
    });

    $("body .user-menu a").click(function() {
        $("body .user-menu").removeClass("show");
    });

    $(".page").click(function() {
        $("body .user").removeClass("show");
        $("body .user-menu").removeClass("show");
    });

    // Login / register buttons
    $(".submit").click(login);

    $("#logout").click(logout);

    // Back to top
    $(".btt").click(function() {
        $(".btt").removeClass("shown");

        $("html, body").animate({
            scrollTop: 0
        }, 1000);
    });

    // Audio autoplay question

    $("#audio-yes").click(function() {
        $(".audio-question").slideUp();

        pageData.store.setItem("ncr-autoplay", "yes");

        playerControl.play();
    });

    $("#audio-no").click(function() {
        $(".audio-question").slideUp();

        pageData.store.setItem("ncr-autoplay", "no");
    });

    // Sekrit volume control keypress
    $(document).keypress(function(e) {
        if (e.target.nodeName == "INPUT")
            if (e.which == 13) {
                e.preventDefault();

                login();
            } else return;

        if (e.which == 105) {
            e.preventDefault();

            playerControl.vol.up();
        } else if (e.which == 107) {
            e.preventDefault();

            playerControl.vol.down();
        }
    });

    $(".loader h3").html("Loading cool things...");
});

var BASE_URL = "https://platypus.ag-n.net:443";

function login() {
    var user = $("#username").val(),
        password = $("#password").val();

    $(".submit i").attr("class", "fa fa-cog fa-spin");

    var pass = md5(password);

    if (pageData.sso_mode == "login") {
        var url = BASE_URL + "/login";

        $.get(url, { username: user, password: pass }, function(data) {
            if (data.success) {
                pageData.user = data.user;

                $("body .user").removeClass("show");
                $(".nouser").addClass("inactive");
                $(".signedin").removeClass("inactive");

                $("#user").html(data.user);

                notifier.notify("sign-in", 4, "Logged in as " + data.user + ".", "login-notif", 2000);

                pageData.store.setItem("session", data.sid);
            } else {
                notifier.notify("times", 4, data.info, "login-notif", 2000);
            }

            $(".submit i").attr("class", "fa fa-chevron-right");

            $("#password").val("");
        }).fail(function() {
            notifier.notify("times", 4, "Error signing in. Try again?", "login-notif", 2000);

            $(".submit i").attr("class", "fa fa-chevron-right");
        });
    } else if (pageData.sso_mode == "register") {
        var url = BASE_URL + "/register";

        $.get(url, { username: user, password: pass }, function(data) {
            if (data.success) {
                pageData.user = user;

                $("body .user").removeClass("show");
                $(".nouser").addClass("inactive");
                $(".signedin").removeClass("inactive");

                $("#user").html(user);

                notifier.notify("sign-in", 4, "Registered " + user + ".", "login-notif", 2000);

                pageData.store.setItem("session", data.sid);
            } else {
                notifier.notify("times", 4, data.info, "login-notif", 2000);
            }

            $(".submit i").attr("class", "fa fa-chevron-right");

            $("#password").val("");
        }).fail(function() {
            notifier.notify("times", 4, "Error signing up. Try again?", "login-notif", 2000);

            $(".submit i").attr("class", "fa fa-chevron-right");
        });
    }
}

function logout() {
    $.get(BASE_URL + "/logout", { sid: pageData.store.session }, function(data) {
        if (data.success) {
            pageData.user = null;

            $(".nouser").removeClass("inactive");
            $(".signedin").addClass("inactive");

            $("#user").html("");

            pageData.store.removeItem("session");

            notifier.notify("sign-out", 4, "Logged out.", "logout-notif", 2000);
        } else {
            notifier.notify("times", 4, data.info, "login-notif", 2000);
        }
    }).fail(function() {
        notifier.notify("times", 4, "Error logging out. Try again?", "logout-notif", 2000);
    });
}

$(window).load(function() {
    var track = Math.floor(Math.random() * tracks.length);

    pageData.nowplaying = track;
    playerControl.load(track);

    if (!pageData.store.getItem("ncr-autoplay"))
        $(".audio-question").slideDown();
    else if (pageData.store.getItem("ncr-autoplay") == "yes")
        playerControl.play();

    $(".game").each(function(i) {
        $(this).css("background-image", $(this).attr("data-background"));

        var url = $(this).attr("data-server");
        var self = $(this);

        if (url != null) {
            $.get(url, function(data) {
                self.find(".status").html(data.players + "/" + data.maxplayers + " players");
            }).fail(function() {
                self.find(".status").html("Server down :(");
            });
        }
    });

    if (pageData.store.getItem("session")) {
        $(".loader h3").html("Logging you in...");

        $.get(BASE_URL + "/session", { sid: pageData.store.getItem("session") }, function(data) {
            if (data.success) {
                $("body .user").removeClass("show");
                $(".nouser").addClass("inactive");
                $(".signedin").removeClass("inactive");

                $("#user").html(data.user);

                $(".loader h3").html("Logged in as " + data.user + ".");
            } else {
                pageData.store.removeItem("session");

                notifier.notify("times", 4, data.info, "login-notif", 2500);
            }
        }).fail(function() {
            $(".loader h3").html("Login server is offline :(");

            notifier.notify("times", 4, "Login server appears to be offline.", "login-notif", 2500);
        });
    }

    $(".loader").fadeOut(1000);
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
    },
    "load": function(index) {
        var playerr = $("#player").get(0);
        var track = tracks[index];

        playerr.src = track.src;
        playerr.load();

        $("#nowplaying").html(track.name + " - " + track.artist);
        $("#nowplaying").slideDown();
    },
    "vol": {
        "down": function() {
            var playerr = $("#player").get(0);

            if (playerr.volume < .1) {
                return;
            } else {
                playerr.volume -= .1;
            }

            if (playerr.volume < .6 && playerr.volume >= .1) {
                $("#mute").addClass("fa-volume-down");
                $("#mute").removeClass("fa-volume-off");
                $("#mute").removeClass("fa-volume-up");
            } else if (playerr.volume < .1) {
                $("#mute").addClass("fa-volume-off");
                $("#mute").removeClass("fa-volume-up");
                $("#mute").removeClass("fa-volume-down");
            }

            notifier.notify("volume-up", "4", "Volume now " + Math.floor(playerr.volume * 100) + "%.", "vol_notif", 1500);
        },
        "up": function() {
            var playerr = $("#player").get(0);

            if (playerr.volume == 1) {
                return;
            } else {
                playerr.volume += .1;
            }

            if (playerr.volume > .5) {
                $("#mute").addClass("fa-volume-up");
                $("#mute").removeClass("fa-volume-off");
                $("#mute").removeClass("fa-volume-down");
            } else if (playerr.volume >= .1) {
                $("#mute").addClass("fa-volume-down");
                $("#mute").removeClass("fa-volume-off");
                $("#mute").removeClass("fa-volume-up");
            }

            notifier.notify("volume-up", "4", "Volume now " + Math.floor(playerr.volume * 100) + "%.", "vol_notif", 1500);
        },
        "set": function(num) {
            var playerr = $("#player").get(0);

            if (num > 1 || num < 0)
                return;

            playerr.volume = num;

            if (playerr.volume > .5) {
                $("#mute").addClass("fa-volume-up");
                $("#mute").removeClass("fa-volume-off");
                $("#mute").removeClass("fa-volume-down");

                notifier.notify("volume-up", "4", "Volume now " + Math.floor(playerr.volume * 100) + "%.", "vol_notif", 1500);
            } else if (playerr.volume < .6 && playerr.volume > 0) {
                $("#mute").addClass("fa-volume-down");
                $("#mute").removeClass("fa-volume-off");
                $("#mute").removeClass("fa-volume-up");

                notifier.notify("volume-down", "4", "Volume now " + Math.floor(playerr.volume * 100) + "%.", "vol_notif", 1500);
            } else if (Math.floor(playerr.volume) == 0) {
                $("#mute").addClass("fa-volume-off");
                $("#mute").removeClass("fa-volume-up");
                $("#mute").removeClass("fa-volume-down");

                notifier.notify("volume-off", "4", "Volume now " + Math.floor(playerr.volume * 100) + "%.", "vol_notif", 1500);
            }
        }
    }
};

var notifier = {
    "obj": null,
    "timeout": 0,
    "notify": function(icon, icon_size, msg, id, timeout) {
        var i = notifier.util.createIcon(icon, icon_size),
            t = notifier.util.createText(msg, id);

        notifier.obj.html("");

        notifier.obj.get(0).appendChild(i);
        notifier.obj.get(0).appendChild(t);

        notifier.obj.fadeIn(250);

        clearTimeout(notifier.timeout);

        notifier.timeout = setTimeout(function() {
            notifier.obj.fadeOut(500);
        }, timeout);
    },
    "util": {
        "createIcon": function(icon, size) {
            var i = document.createElement("i");

            i.className = "fa fa-" + icon + " fa-" + size + "x";

            return i;
        },
        "createText": function(text, id) {
            var t = document.createElement("p");

            t.id = id;
            t.innerHTML = text;

            return t;
        }
    }
};