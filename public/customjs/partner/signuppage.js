var username, email, password, repassword, address, state, city, lat, lng, idproof, contact;
var error;
$(document).ready(function() {
    initAll();
    formvalidation();
    addressAutocomplete();
    setTempValues();

})

function setTempValues() {
    $('input[name="username"]').val('Mohan kumar');
    $('input[name="email"]').val('mohan@gmail.com');
    $('input[name="password"]').val('password');
    $('input[name="repassword"]').val('password');
    $('input[name="address"]').val('My Address');
    $('input[name="contact"]').val('9144460897');
}


function initAll() {
    error = $('#errorMessage');
    username = $('input[name="username"]');
    email = $('input[name="email"]');
    password = $('input[name="password"]');
    repassword = $('input[name="repassword"]');
    address = $('input[name="address"]');
    city = $('select[name="city"]');
    state = $('select[name="state"]');
    contact = $('input[name="contact"]');
}


var validform = false;

function formvalidation() {
    $('form').submit(function(event) {
        if (validform) {
            // if valid submit form 
            return;
        }

        $('input[name="lat"]').val(lat)
        $('input[name="lng"]').val(lng)
        if (!(lat && lng)) {
            $(error).removeAttr('hidden')
            $(error).text('select Address From seggetions....');
            event.preventDefault();
            return;
        }

        if (state.val() == 0) {
            $(error).removeAttr('hidden')
            $(error).text('Select State...');
            event.preventDefault();
            return;
        }
        if (city.val() == 0) {
            $(error).removeAttr('hidden')
            $(error).text('Select City...');
            event.preventDefault();
            return;
        }
        $(error).attr('hidden', true)

        var data = new Object();

        data.name = $(username).val();
        data.email = $(email).val()
        data.password = $(password).val()
        data.address = $(address).val()
        data.state = $(state).val()
        data.city = $(city).val()
        data.contact = $(contact).val()


        jQuery.post("/signup/partner/validate",
            data,
            function(result) {
                console.log(result);
                $(error).attr('hidden', true)
                console.log('okkk singup noww...');
                // if every thing is okk 
                // submit form 
                validform = true;
                $('#partnerform').submit();
            }).fail(function(err) {
            event.preventDefault();
            $(error).removeAttr('hidden')
            $(error).text(err.responseText);
        })
        event.preventDefault();


    })
}

function addressAutocomplete() {

    $('#address').one('focus', getLocation)

    $("#address").autocomplete({
        
        source: function(request, response) {
            
            var text = $("#address").val();
            $.ajax({
                url: "/signup/getaddresses/" + text,
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function(data) {
                    // console.log(data.results);
                    var results = data.results
                    console.log("helo dtat");
                    
                    for (i in results) {
                        results[i].value = results[i].formatted_address;
                    }
                    response(results);
                },
            });
        },
        minLength: 2,
        select: function(event, ui) {
            lat = ui.item.lat;
            lng = ui.item.lng;
            var address = ui.item.formatted_address;
        }
    });
}

function getLocation() {
    var geoSuccess = function(position) {

        // Do magic with location
        startPos = position;
        lat = startPos.coords.latitude;
        lng = startPos.coords.longitude;
        // alert(lat)
        // alert(lng)
    };

    navigator.geolocation.getCurrentPosition(geoSuccess);
}