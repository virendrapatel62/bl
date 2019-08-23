// function load(url){
//     $(this).toggleClass('selected')
//     $('iframe').attr('src' , 'http://localhost:3000'+url);
// }
// var host = 'https://bldvtest.herokuapp.com';
// var host = 'http://localhost:3000';
$(document).ready(function()
{
    $('.sideBarLinks').find('li').click(function(){
        var url = $(this).attr('url');
        $('.sideBarLinks').find('li').removeClass('selected')
        $(this).addClass('selected');
        $('iframe').attr('src' ,url);
    })
})