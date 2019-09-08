$(document).ready(function(){
    $('.sideBarLinks').find('li').click(function(){
        const url = $(this).attr('url')
        if(url){
            $('iframe').attr('src' , url);
        }
    })
})
