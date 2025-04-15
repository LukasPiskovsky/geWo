$(function(){
    $(".logo").animate({
        opacity: 1
    }, 1000)
    $(".from-left").animate({
        marginLeft : "40%"
    }, 1000)
    
})

$(function(){
    $("#arrow").click(function(){
        $("#settings").toggle(150)
    })
});

$(function(){
    $("#arrow").click(function(){
        $(".main-section").toggleClass("blur")
    })
});
