$(document).ready(function () {
    console.clear()
    
    
    $('.sideBarLinks').find('li').click(function () {

        const url = $(this).attr('url')
        if (url) {
            $('#pageLoader').attr('src', url)
            console.log($('iframe'));
        }
    })
})
