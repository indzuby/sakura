$(document).ready(function(){
	var winH = $(window).height();
	$("#main").find(".con_in").css("height", winH);
	$("#event").find(".con_in").css("height", winH);
	$(".flower_main").addClass("over").delay(1000).queue(function(next){
	    $(".main_copy").addClass("start");

	    next();
	});
	var flowerTimer = setTimeout(function () {
		$("#main").snowfall({image :"./images/flower_10.png" ,minSize: 10, maxSize:42});
	}, 1000);
});
//popup
function lock_touch(e){
	e.preventDefault();
}
function popOpen(id){
	var _this = $('#' + id);
	_this.stop(true, false).fadeIn(150);
	_this.addClass('open');
	console.log(_this)
	
	var popCon = _this.find('.pop_layer');
	var winH = $(window).height();
	var popW = popCon.width();
	var popH = popCon.height() + 200;

	if(winH < popH){
		popCon.stop(true, false).css({'top': 50, 'marginTop': 0});
	} else {
		document.addEventListener('touchmove', lock_touch);
		popCon.stop(true, false).css({'marginTop': -(popH/2) + 50});
	}
	var popinChk = _this.hasClass('inpopup');
	if ( !popinChk ){
		$('html').addClass('pop_open');
		$('<span class="bg_pop"></span>').appendTo('body');
	}
}
function popClose(id){
	var _this = $('#' + id);
	_this.removeClass('open').hide();

	var popCon = _this.find('.pop_layer');
	popCon.css({'top': '50%', 'marginTop': '50px'});

	document.removeEventListener('touchmove', lock_touch);

	var popinChk = _this.hasClass('inpopup');
	if ( !popinChk ){
		$('.bg_pop').remove();
		$('html').removeClass('pop_open');
	}
}
var popResize = function(){
	if( $('.pop_layer').hasClass('open') ){
		var winH = $(window).height();
		var popCon = $('.pop_layer.open').find('.pop_layer');
		var popConH = popCon.height() + 200;

		var popinChk = $('.pop_layer.open').hasClass('inpopup');
		if ( !popinChk ){
			if ( winH < popConH ){
				document.removeEventListener('touchmove', lock_touch);
				popCon.stop(true, false).css({'top': 50, 'marginTop': 0});
			} else {
				document.addEventListener('touchmove', lock_touch);
				popCon.stop(true, false).css({'top': '50%', 'marginTop': -(popConH/2) + 50});
			}
		}
	}
}


$(window).on('resize', function(){
     popResize();
     var winH = $(window).height();
     var mainH = $("#main").height();
     if($("#main").hasClass("on")){
     	$("#main").find(".con_in").css("height", winH);
     	$("#event").find(".con_in").css("height","");
     }else{
     	$("#event").find(".con_in").css("height", winH+150);
     	$("#main").find(".con_in").css("height","");
     }
     
});
//menu
function menuG(value,e){
	var _this = $('#' + value);
	var winH =$(window).height();
	if(value=="event"){
		$(".gnb a").removeClass("this");
		$(e).addClass("this");
		_this.find(".con_in").css("height", winH+150);
		$("#main").find(".con_in").css("height", '');
		$(".anchor").removeClass("on").addClass('prev');
		_this.addClass("on").removeClass('prev'); 
		$(".flower_event").delay(600).addClass("over").queue(function(next){
		    $(".event_copy").addClass("start");
		    next();
		});
		$("#main .flower_main").removeClass('over');
        $("#main .main_copy").removeClass('start');
        $("#main").snowfall('clear');
	}else if(value=="main"){
		$(".gnb a").removeClass("this");
		$(e).addClass("this");
		_this.find(".con_in").css("height", winH);
		$("#event").find(".con_in").css("height", '');
		$(".anchor").removeClass("on").addClass('next');
		_this.addClass("on").removeClass('prev'); 
		$(".flower_main").addClass("over").delay(600).queue(function(next){
		    $(".main_copy").addClass("start");
		    next();
		});
		var flowerTimer = setTimeout(function () {
			$("#main").snowfall({image :"./images/flower_10.png" ,minSize: 10, maxSize:42});
		}, 1000);
        $("#event .flower_event").removeClass('over');
        $("#event .event_copy").removeClass('start');
	}else if(value=="event_page"){
		$(".gnb a").removeClass("this");
		$(".gnb a").eq(-1).addClass("this");
		$("#event").find(".con_in").css("height", winH+150);
		$("#main").find(".con_in").css("height", '');
		$(".anchor").removeClass("on").addClass('prev');
		$("#event").addClass("on").removeClass('prev'); 
		$(".flower_event").delay(600).addClass("over").queue(function(next){
		    $(".event_copy").addClass("start");
		    next();
		});
		$("#main .flower_main").removeClass('over');
        $("#main .main_copy").removeClass('start');
        $("#main").snowfall('clear');
	}
}