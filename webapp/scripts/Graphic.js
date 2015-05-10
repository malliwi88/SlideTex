$(function()
{

    var $uploadInput = $('input[type=file]#graphicUpload');
    var $imagesList = $('.ui-images-list');
    var $imagesContainer = $('.ui-images-container');

    // Add events


    $uploadInput.on('change', function(){

        var imageThumbDom = $('<div class="col-sm-6 col-md-4"> <div class="thumbnail"><img src="output/myImage.png" data-dismiss="modal"><div class="caption">' +
            '<p>myImage.png</p></div></div></div>');

        $imagesContainer.append(imageThumbDom);
        $imagesList.slideDown();

        imageThumbDom.click(function() {

            var imageFigureSkeleton = '\\begin{figure}\n' +
                ' \\includegraphics{myImage.png}\n' +
                ' \\caption{Die Abbildung zeigt ein Beispielbild}\n' +
                '\\end{figure}\n' ;

            SlideTex.Writer.editor.insert(imageFigureSkeleton);
        });
    });
});