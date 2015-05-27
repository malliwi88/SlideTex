// Global singleton of the SlideTex application
var SlideTex = {

    idGenerator: function (length){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    id: null
};

$(function() {
    // check if a hash is given
    var cleanHash = window.location.hash.replace("#", "");
    if (cleanHash.length < 7) {
        var id = SlideTex.idGenerator(7);
        window.location.hash = "#" + id;
        SlideTex.id = id;
    }else{
        SlideTex.id = cleanHash;
    }

    // retrieve current state
    $.ajax({
        url: '/state',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name: SlideTex.id
        })
    }).done(function(data, textStatus, jqXHR) {

            // inject latex code
            $('#editor').html(data.latex);

            // initializes the components
            $( document ).ready(function() {
                SlideTex.Tracking.init();
                SlideTex.Writer.init();
                SlideTex.Layout.init();
                SlideTex.Viewer.init(data.pdf);
                SlideTex.Upload.init(data.images);
            });
        });

});
