
$(function() {

    // Variable to store your files
    var files;

    var $uploadInput = $('input[type=file]#graphicUpload');
    var $imagesList = $('.ui-images-list');
    var $imagesContainer = $('.ui-images-container');
    var $imagesModal = $('#addImageModal');


    function getImageFigureCode(fileName) {
        return '\\begin{figure}\n' +
            ' \\includegraphics[width=\\textwidth,height=\\textheight,keepaspectratio]{'+ fileName +'}\n' +
            ' \\caption{Die Abbildung zeigt ein Beispielbild}\n' +
            '\\end{figure}\n' ;
    }

    function addImage(fileName, webPathName) {
        var imageThumbDom = $('<div class="col-sm-6 col-md-4"> <div class="thumbnail"><img src="'+webPathName+'" data-dismiss="modal"><div class="caption">' +
            '<p>'+fileName+'</p></div></div></div>');

        $imagesContainer.append(imageThumbDom);
        $imagesList.slideDown();
        imageThumbDom.click(function() {
            SlideTex.Writer.editor.insert(getImageFigureCode(fileName));
        });
    }

    function showImage(fileName, webPathName) {
        addImage(fileName, webPathName);
        SlideTex.Writer.editor.insert(getImageFigureCode(fileName));
        $imagesModal.modal('hide');
    }


    // Grab the files and set them to our variable
    function prepareUpload(event) {
        files = event.target.files;
        var data = new FormData();
        $.each(files, function(key, value)
        {
            data.append(key, value);
        });

        $.ajax({
            url: 'upload/' + SlideTex.id,
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR) {
                $uploadInput.replaceWith( $uploadInput = $uploadInput.clone( true ) );
                $uploadInput.show();
                for(var i=0; i< data.length; i++) {
                    showImage(data[i].name, data[i].webPathName);
                }
            },
            beforeSend: function( xhr ) {
                $uploadInput.hide();
            }
        });
    }

    SlideTex.Upload = {
        init: function(images) {
            $uploadInput.on('change', prepareUpload);

            if(images) {
                for(var i=0; i<images.length; i++) {
                    var image = images[i];
                    addImage(image.name, image.webPathName);
                }
            }
        }
    };
});