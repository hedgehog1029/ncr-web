var userData = {
    "signed_in": false
}; //again, temporary

$(document).on("ready", function() {
    populate($("#events-wrapper").get(0));

    $(".event").attr("data-select", 0);

    $(".event-btn").click(function() {
        if ($(this).parent().attr("data-select") == 0) {
            if (!userData.signed_in) {
                notifier.notify("times", "4", "Not signed in!", "nosignin_notifier", 3000);
                return;
            }

            $(this).get(0).className = "check";
            $(this).children("i").get(0).className = "fa fa-check-circle fa-2x"
            $(this).parent().attr("data-select", 1);

            notifier.notify("check", "4", "You're now going to this event!", "going_notif", 3000); // temporary; wait until server roundtrip
        } else if ($(this).parent().attr("data-select") == 1) {
            $(this).get(0).className = "cross";
            $(this).children("i").get(0).className = "fa fa-times-circle fa-2x"
            $(this).parent().attr("data-select", 2);
        } else {
            $(this).get(0).className = "";
            $(this).children("i").get(0).className = "fa fa-question-circle fa-2x"
            $(this).parent().attr("data-select", 0);
        }
    });
});

var events = [{"thumb": "img/danika%20image.jpg", "title": "Test Event", "desc": "A test event, where people do the stuff and the things.",
"ext_desc": "<li>Where: NCR Dubtrack room</li><li>When: 1st November 2015</li>"},
             {"thumb": "img/danika%20image.jpg", "title": "Test Event 2", "desc": "Another test event.", "ext_desc": "Extended description."}]; // temporary test variable

function populate(parent) {
    events.forEach(function(o, i) {
        var div = document.createElement("div"),
        img = document.createElement("img"),
        title = document.createElement("p"),
        desc = document.createElement("p"),
        ext_desc = document.createElement("p"),
        btn = document.createElement("a"),
        i = document.createElement("i");
    
        img.src = o.thumb;
        img.className = "event-thumb";
        
        title.innerHTML = o.title;
        title.className = "event-title";
        
        desc.innerHTML = o.desc.substring(0, 300);
        desc.className = "event-description";

        ext_desc.innerHTML = o.ext_desc;
        ext_desc.className = "event-ext-desc";
        
        btn.className = "event-btn";

        i.className = "fa fa-question-circle fa-2x";

        btn.appendChild(i);
        
        div.className = "event";
        div["data-select"] = 0;
        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(desc);
        div.appendChild(btn);
        div.appendChild(ext_desc);
        
        parent.appendChild(div);
    });
}