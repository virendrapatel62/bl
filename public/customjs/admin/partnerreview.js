$(document).ready(function() {

})

function confirmPartner(id, elem) {
    jQuery.get('/admin/partnerreview/confirm/' + id, function(result) {
        $('#decline').hide(200);
        $(elem).text('Partner Confirmed..')
    }).fail(function() {
        alert('somthinf went wring on the server...')
    })
}


function declinePartner(id, elem) {
    jQuery.get('/admin/partnerreview/decline/' + id, function(result) {
        $('#confirm').hide(200);
        $(elem).text('Partner Declined....')
    }).fail(function() {
        alert('somthinf went wring on the server...')
    })
}