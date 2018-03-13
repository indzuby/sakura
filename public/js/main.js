

$("#reservedSubmit").click(function(){
  var device = $("input[name=device]:checked").val();
	var phone = $("input[name=phone]").val();
	var phoneCheck = /^[0-9]*$/;

	if(phone.length<=0) {
    popOpen("cell_missing");
    return false;
	}else if(phone.length<7 || phone.length>8 || !phoneCheck.test(phone)) {
    popOpen("cell_error");
    return false;
	}else if(!$("input[name=agree]").prop("checked")){
    // popOpen("agree_pop");
    return false;
	} else {
    $.post('/book', {
      'phoneNumber': "010"+phone,
      'platform': device
    }, function(res) {
      if (res.result) {
        //test
        fbq('track', 'CompleteRegistration');
        popOpen("regist_done");
      } else {
        if (res.code == '1' || res.code == '3') { //error
      		$("#confirmModal #content").html("잠시 후 다시 시도해주세요.");
      		$("#confirmModal").show();
        } else if (res.code == '2') {
           popOpen("cell_done");
        }
      }
    });
  } 
});
