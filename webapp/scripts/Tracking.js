
$(function() {

    function gaEvent(cat, action, label, value) {

        if(!cat || !action) {
            var msg = "Needed parameters for a ga event are not given!";
            if(typeof console.error != 'undefined'){
                console.error(msg);
            }else if(typeof console.log != 'undefined') {
                console.log(msg);
            }
            return;
        }

        var event = {
            'hitType': 'event',
            'eventCategory': cat,
            'eventAction': action
        };

        if(label) {
            event.eventLabel = label;
        }

        if(value) {
            event.eventValue = value;
        }


        if(document.location.hostname === 'slidetex.net') {
            ga('send', event);
        }else{
            console.log(event);
        }
    }

    function applyEventListeners() {
        var $infoModal = $("#infoModal");
        $infoModal.on('show.bs.modal', function(e){
            SlideTex.Tracking.event('info', 'openModal');
        });

        $infoModal.on('hide.bs.modal', function(e){
            SlideTex.Tracking.event('info', 'closeModal');
        });
    }


    if(typeof window.SlideTex == 'undefined') {
        window.SlideTex = {};
    }

    SlideTex.Tracking = {
        init: function(images) {
            applyEventListeners();
        },
        event: gaEvent
    };
});