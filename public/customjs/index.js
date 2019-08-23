$(document).ready(function(){
    $('#usermodal').modal('show');

	$("#loginform").on('submit',function(){
        event.preventDefault();
        const formdata = new FormData(this);
        var data = {};
        for (let tm of formdata.entries()){
            data[tm[0]] = tm[1];
        }
        $.ajax({
            method : 'post',
            url : '/login',
            data : data,
            statusCode: {
                401 : function() {
                    alert("either email or password is wrong");
                },
              },
            success : function(data){
               location.href = "user";
            }
        });
    });
});