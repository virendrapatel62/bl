function login(){
    $('.modal').modal('hide')
    $('#loginModal').modal('show')
}
function partnerLogin(){
    $('.modal').modal('hide')
    $('#partnerLoginModal').modal('show')
}
$(document).ready(function(){
    // $('#loginModalError').alert('close');
})

function loginFromModal(event){
    event.preventDefault();
    var email = $('#login_modal_email').val();
    var password = $('#login_modal_password').val();
    jQuery.post(
        '/login/' , 
        {
            email : email , 
            password : password
        }, 
        function(result){
            $('#loginModal').modal('hide')
        }
    ).fail(function(err){
        console.log(err);
        $('#loginModalError').removeAttr('hidden')
        $('#loginModalError').alert()
    }).done(function(result){
        
    })
}

function partnerLoginFromModal(event){
    event.preventDefault();
    var email = $('#partner_login_modal_email').val();
    var password = $('#partner_login_modal_password').val();
    jQuery.post(
        '/partnerlogin/' , 
        {
            email : email , 
            password : password
        }, 
        function(result){
            $('.modal').modal('hide')
            location.reload();
        }
    ).fail(function(err){
        console.log(err);
        $('#loginModalError').removeAttr('hidden')
        $('#loginModalError').alert()
    }).done(function(result){
        
    })
}
