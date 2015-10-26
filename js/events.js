$(document).on("ready", function() {
    populate($("#events-wrapper").get(0));

    $(".event-btn").click(function() {
        if ($(this).parent().attr("data-open") != 1) {
            $(this).addClass("rotate");
            $(this).parent().children(".event-ext-desc").addClass("show");
            $(this).parent().attr("data-open", 1);
        } else {
            $(this).removeClass("rotate");
            $(this).parent().children(".event-ext-desc").removeClass("show");
            $(this).parent().attr("data-open", 0);
        }
    });
});

var events = [{"thumb": "img/danika%20image.jpg", "title": "Test Event", "desc": "A test event.", "ext_desc": "<li>Where: VC Dubtrack room</li>"},
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
        
        desc.innerHTML = o.desc;
        desc.className = "event-description";

        ext_desc.innerHTML = o.ext_desc;
        ext_desc.className = "event-ext-desc";
        
        btn.className = "event-btn";

        i.className = "fa fa-long-arrow-right";

        btn.appendChild(i);
        
        div.className = "event";
        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(desc);
        div.appendChild(btn);
        div.appendChild(ext_desc);
        
        parent.appendChild(div);
    });
}