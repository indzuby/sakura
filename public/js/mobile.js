$(document).ready(function(){
	$("#main").addClass("start");
	$(document).on("scroll", onScroll);
	$('.gnb li [href*=#]').click(function(event){
		event.preventDefault();
		var delta = 0;
		$('.gnb li').each(function () {
			$(this)
				.removeClass('on');
		});
		$(this)
			.parent()
			.addClass('on');

		var target = event.currentTarget.hash;
		$target = $(target);
		$(".section").removeClass("start");
		$target.addClass("start");
		$('html, body')
			.stop()
			.animate({
				'scrollTop': $target.offset().top-55
			}, 500, 'swing', function () {
				window.location.hash = target;
				$(document).on("scroll", onScroll);
			}
		);
	});
});
//메뉴스크롤
function onScroll() {
	var _scrollPos = $(document).scrollTop();
	var currbox =$('.gnb li.on a').attr("rel");
	
	$('.gnb li [href*=#]').each(function() {
		var currLink = $(this);
		var refElement = $(currLink.attr("href"));

		if ( refElement.position().top-200 <= _scrollPos && refElement.position().top-200 + refElement.height() > _scrollPos ) {
			$('.gnb li')
				.removeClass("on");
			currLink
				.parent()
				.addClass("on");
			$(".section").removeClass("start")
			
			$(refElement).addClass("start")
		} else {
			currLink
				.parent()
				.removeClass("on");
				//$(".section").removeClass("start")
		}
	});
}
function eventgo(ele){
	
	$('html, body')
			.stop()
			.animate({
				'scrollTop': $("#event").offset().top-55
			}, 500, 'swing');
}


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


$(window).resize(popResize);