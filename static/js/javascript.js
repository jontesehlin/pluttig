$(document).ready(function() {
  $('#requestURL').on('change', function() {
    $('#requestURLinput').toggle("slide");
  })
  $('#changeProtocol').on('click', function() {
    var protocol = $('#changeProtocol').html();
    $('#changeProtocol').html($('#protocol').html());
    $('#protocol').html(protocol);
  });
  $('.button').on('click', function() {
    $.ajax({
          type: 'POST',
          url: '/',
          data: JSON.stringify(
            {
              "plutti": {
                "url": $('#protocol').html()+'://'+$('#url').val(),
                "requested": $('#request').val()
              }
            }
          ),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(data){
            if(data.success) {
              $('.message').html($('#url').val()+' => '+data.success);
            }else if(data.error){
              $('.message').html(data.error);
            }
          },
          failure: function(errMsg) {
              alert(errMsg);
          }
      });
  });
});
