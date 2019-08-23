let lat , lng  , name , email  , contact , password ,repassword , city , state , address ; 

$(document).ready(function () {
    
    addressAutocomplete();
    formsubmisssion();
    
})

function formsubmisssion(){
    $('form').submit(function(event){
        name = $('input[name="name"]').val()
        email = $('input[name="email"]').val()
        password = $('input[name="password"]').val()
        repassword = $('input[name="repassword"]').val()
        address = $('input[name="address"]').val()
        state = $('select[name="state"]').val()
        city = $('select[name="city"]').val()
        contact  = $('input[name="contact"]').val()
        
        let temp =[name , email , password , repassword , state , city , address , lat , lng  , contact]
        console.log(temp);
       
        // signup request
        if(password != repassword){
            alert('password must be same ')
            event.preventDefault()
            return ;
            
        } 
        if(state == 0){
            alert('Select State')
            event.preventDefault()
            return ;
        }
        if(city == 0){
            alert('Select City')
            event.preventDefault()
            return ;
        }
            


        let data = {
            name : name , 
            email : email , 
            address : address , 
            password : password , 
            state : state , 
            city : city , 
            lat : lat , 
            lng : lng , 
            contact : contact 
        }

        jQuery.post("/signup" , data ,function(result){
            // alert('success')
            window.location = '/'
        }).fail(function(err){
            alert(err.responseText)
            console.log(err);
            
        })

        event.preventDefault();
    })
}



function addressAutocomplete(){
    $("#address").autocomplete({
        source: function (request, response) {
            var text = $("#address").val();
            $.ajax({

                url: "/signup/getaddresses/"+text,
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function (data) {
                    console.log(data.results);
                    var results = data.results 
                    for (i in results) {
                        results[i].value = results[i].formatted_address;
                    }
                    response(results);
                },
            });
        },
        minLength: 2,
        select: function (event, ui) {
            lat = ui.item.lat;
            lng = ui.item.lng;
            var address = ui.item.formatted_address;
        }
    });
}