
$(document).ready(function(){

    $('.changefields').on('click',function(){
        event.preventDefault();
        $(`#${this.parentNode.id}`).find('input[disabled],  select[disabled], textarea[disabled]').attr('disabled',false);
        $(`#${this.parentNode.id}`).find('button[type="submit"]').show();
        $(this).hide();
    });
    
    $('#updateaddressform,#nameconform').on('submit',function(){
        event.preventDefault();
        const formdata = new FormData(this);
        var data = {};
        for (let tm of formdata.entries()){
            data[tm[0]] = tm[1];
        }
        // checking is land mark given or not
       if ('landmark' in data){
            if (data.landmark.trim().length===0){
                delete data.landmark;
            }
       }

        $.ajax({
            method : 'post',
            url : this.action,
            data : data,
            statusCode: {
                401 : function() {
                    location.reload();
                },
                406 : function(response){
                    alert(response.responseText);
                },
                500 :function(response){
                    alert(response.responseText);
                }
              },
            success : function(data){
                alert('Information updated successfully');
               location.reload();
            }
        });
        
    });

    $('#passwordupdateform').on('submit',function(){
        event.preventDefault();
        
        const formdata = new FormData(this);
        var data = {};
        for (let tm of formdata.entries()){
            data[tm[0]] = tm[1];
        }
      
        if($("input[name='newpassword']").val().trim()===$("input[name='confirmpassword']").val().trim()){
            if($("input[name='newpassword']").val().trim()===$("input[name='oldpassword']").val().trim()){
                alert("old password and new password can not be same.");
            }else{
                $.ajax({
                    method : 'post',
                    url : this.action,
                    data : data,
                    statusCode: {
                        404: function() {
                          alert( "page not found" );
                        },
                        406 : function(response){
                            alert(response.responseText);
                        },
                        203 : function(response){
                            alert(response.responseText);
                        },
                        401 : function(){
                            location.reload()
                        },
                        500 : function(response){
                            alert(response.responseText);
                        }
                      },
                    success : function (data){
                        var flag = confirm("Password is successfully changed. Dou you want to logout")
                        if (flag){
                            location.replace('/logout');
                        }
                    }
                });
            }
        }else{
            alert("new password and confirm password are not same");
        }
        
    });
    
    $("#states").change(function(){
        const stateid = $(this).val();
        $.get(location.origin+`/api/state/getcities/${stateid}`,function(result){
            let opt1 = $('#cityselection').children().get(0);
            $('#cityselection').html(opt1);
            for (obj of result){
                $('#cityselection').append($('<option>').val(obj._id).text(obj.name));
            }
        });
    });
});