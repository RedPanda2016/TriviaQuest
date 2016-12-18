/**
 * Created by charleen on 12/17/16.
 */
$( function() {
    $( "#draggable" ).draggable().css({'height':60, 'width':80, 'top': 45, 'left' : 20});
    $( "#jukebox" ).droppable({
        drop: function() {
            $("#draggable").css({'height':80, 'width':80}).hide("drop", {direction: "down"}, "slow", function(){
                $(this).css({'height':60, 'width':80, 'top': 45, 'left' : 20}).fadeIn()
            });
        }
    })
} );