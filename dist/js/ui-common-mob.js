'use strict';

/**
 * UI Functions
 * @returns {Object}
 */
var UI = (function(window, document, $) {
	var lastFocused = null;
	var $window = $(window);
	var $html = $('html');

	var dropdown = function() {
		$('.dropdown').off('click').on('click', '.btn-open', function(e) {
			var $this = $(this);
			var $content = $this.parents('.dropdown').find('.content');

			$this.toggleClass('on');
			$content.toggleClass('on');

			$content.is(':visible') ? $content.slideUp(100) : $content.slideDown(100);

			e.preventDefault();
		});
	}

	var datePicker = function() {
		if($('.date-picker').length === 0) return false;

		var $tg = $('.date-picker');

		$tg.datepicker({
			showMonthAfterYear: true,
			dateFormat : 'yy-mm-dd',
			monthNames : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
			dayNamesMin: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
			showOtherMonths: true,
			ignoreReadonly: true,

			beforeShow: function() {
				$('body').append($('<div class="common-dim"></div>'));
				$('html').addClass('scroll-fixed');
			},
			onClose: function() {
				$('.common-dim').remove();
				$('html').removeClass('scroll-fixed');
			}
		});
		$tg.datepicker('setDate','today');
	}

	/* 아코디언 목록 */
	var accordionList = function(selector) {
		var $accordion = $(selector || '.accordion-list');

		$accordion.find('.item.on > .content').css('display', 'block');

		$accordion.off('click').on('click', '.title a', function(e) {
			if(!$(this).hasClass('btn')) {
				e.preventDefault();

				var $tg = $(this);
				var $tgTitle = $tg.parents('.title');
				var $tgContent = $tgTitle.next();
				var $tgItem = $tg.parents('.item');
				var isActive = $tgContent.is(':visible');

				if(isActive) {
					$tgContent.slideUp(200);
					$tgItem.removeClass('on');
				} else {
					$tgContent.slideDown(200);
					$tgItem.addClass('on');
				}
			}
		});
	};

	var visiblePwd = function() {
		var $inputPwdVisible = $('.input-visible-pwd');

		$inputPwdVisible.off('click').on('click', '.btn-view', function() {
			var $btn = $(this);
			var $input = $btn.parents('.input-visible-pwd').find('.text');
			var inputType = $input.attr('type');

			$btn.toggleClass('is-visible');

			if(inputType === 'password') {
				$input[0].type = 'text';
			} else {
				$input[0].type = 'password';
			}
		});
	}

	var clearInput = function() {
		if($('.js-text-clear').length === 0)  return false;

		var clear = function(el) {
			var $text = el.find('input[type=text]');
			var $btn = el.find('.btn-clear');

			if($text[0].value) {
				el.addClass('is-active');
			} else {
				el.removeClass('is-active');
			}

			$text.on('input change', function(e) {
				if(e.target.value) {
					el.addClass('is-active');
				} else {
					el.removeClass('is-active');
				}
			});

			$btn.on('click', function() {
				$text.val('');
				el.removeClass('is-active');
				$text.focus();

				return false;
			});
		}

		$('.js-text-clear').each(function() {
			clear($(this));
		});
	}


	// var topNaviInit = function(screenWidth) {
	// 	var $topNavi = $('.common-header .top-navi');
	// 	var $topNaviCont = $topNavi.find('ul');
	// 	var isDown = false;
    // var firstDrag = false;
    // var startMouseX, startMouseY, dragDistanceX, dragDistanceY, clickX, dragPosition;
		

	// 	function removeDocumentMoveEvent(e){
	// 		e.preventDefault();
	// 	}
		
	// 	$topNaviCont.on('touchstart', function(e) {
	// 		if($(this).data("scrollMode")){
	// 			console.log("touchstart");
	// 			var event = e.originalEvent;
	// 			isDown = true;
	// 			firstDrag = false;

	// 			dragDistanceX = 0;
	// 			dragDistanceY = 0;

	// 			clickX = $(this).data('transx');

	// 			startMouseX = event.touches[0].clientX;
	// 			startMouseY = event.touches[0].clientY;
	// 		}
	// 	});

	// 	$topNaviCont.on('touchmove', function(e) {
	// 		console.log(isDown);

	// 		if (isDown){
	// 			var event = e.originalEvent;

	// 			dragDistanceX = startMouseX - event.touches[0].clientX;
	// 			dragDistanceY = startMouseY - event.touches[0].clientY;
				 
	// 			if (!firstDrag){
	// 					firstDrag = true;

	// 					if (Math.abs(dragDistanceX) > Math.abs(dragDistanceY)){
	// 							document.addEventListener('touchmove', removeDocumentMoveEvent, {passive: false});
	// 					} else{
	// 							$(this).trigger('touchend');
	// 					}
	// 			} else{
	// 					var contleft = $(this).parent().offset().left;
	// 					var contwidth = $(this).outerWidth(true);
	// 					var initdistance = contleft - (contwidth - (screenWidth-contleft*2))
	// 					dragPosition = clickX - dragDistanceX;
	// 					if(dragPosition > 0) dragPosition = 0;
	// 					if(dragPosition < initdistance) dragPosition = initdistance;
	// 					$(this).data('transx', dragPosition);
	// 					TweenMax.to($(this), .5, {x:dragPosition, ease:Power3.easeOut, overwrite:1});

	// 			}
	// 		}
	// 	});

	// 	$topNaviCont.on('touchend', function(e) {
	// 		if(isDown) {
	// 			isDown = false;
	// 			document.removeEventListener('touchmove', removeDocumentMoveEvent);
	// 		};
	// 	});


	// 	if($('.common-header .wrap.main').length > 0) {
	// 		var navleft = $topNavi.offset().left;
	// 		var navwidth = $topNavi.outerWidth(true);


	// 		if(navleft + navwidth > screenWidth){
	// 			$topNaviCont.data("scrollMode", true);
	// 			$topNavi.removeClass('not-scroll');
	// 		} else{
	// 			$topNaviCont.data("scrollMode", false);
	// 			$topNavi.addClass('not-scroll');
	// 		}
			
	// 		$topNaviCont.data("transx", 0);
	// 		TweenMax.set($topNaviCont, {x:0});

	// 		$('.top-navi ul li').each(function() {
	// 			if($(this).hasClass('on')) {
	// 				var curIdx = $(this).index();
	// 				var currentnavi = $('.top-navi ul li').eq(curIdx);

	// 				if(currentnavi.offset().left + currentnavi.width() < 0){
	// 					$('.top-navi ul').data('transx', 0);
	// 					TweenMax.to($(".top-navi ul"), .5, {x:0, ease:Power3.easeOut, overwrite:1});
	// 				} else if(currentnavi.offset().left + currentnavi.width() > screenWidth){
	// 					var contleft = $('.top-navi').offset().left;
	// 					var contwidth = $('.top-navi ul').outerWidth(true);
	// 					var initdistance = contleft - (contwidth - (screenWidth-contleft*2));
	// 					console.log(initdistance)
	// 					$('.top-navi ul').data('transx', initdistance);
	// 					TweenMax.to($(".top-navi ul"), .5, {x:initdistance, ease:Power3.easeInOut, overwrite:1});
	// 				}

	// 			} else {
	// 				$topNaviCont.data("transx", 0);
	// 				TweenMax.set($topNaviCont, {x:0});
	// 			}
	// 		});

	// 	}
		
	// }

	var header = function() {
		var didScroll;
		var delta = 5;
		var lastScrollTop = 0;
		var $CommonHeader = $('.common-header');
		var $PageHeader = $('.page-header');
		var $window = $(window);
		var $notiBar = $('.noti-bar');

		$(window).scroll(function(){
			if($CommonHeader.find('.wrap.main').length > 0) {
				didScroll = true;
			}
		});

		setInterval(function() {
			if (didScroll) {
				scrollCheck();
				didScroll = false;
			}
		}, 250);

		function scrollCheck() {
			var st = $window.scrollTop();
			var conT = 70;

			if(Math.abs(lastScrollTop - st) <= delta)
				return;

				if (st > lastScrollTop && st > conT) {
					// Scroll Down
					$CommonHeader.addClass('is-fixed');
				} else {
					// Scroll Up
					if(st + $(window).height() < $(document).height()) {
						$CommonHeader.removeClass('is-fixed')

						if( $notiBar.css('display') == 'none'){
							$CommonHeader.css('top','0');
						};
					}
				}

				if(st <= conT) { 
					$CommonHeader.removeClass('is-fixed');
				}

				lastScrollTop = st;
		}
	}

	/**
	 * 레이어팝업 로드
	 *
	 * @param {String|Object} popElment 외부팝업 아닌 페이지 안에서 팝업 추가 할 때 팝업 엘리먼트
	 * @param {String|Object} options 팝업 경로 String 또는 옵션 Object (jQuery ajax settings)
	 * @param {String} qs 쿼리스트링
	 * @param {Element} openerEl 팝업닫기시 되돌아갈 엘리먼트(필요할때만 전달)
	 * @returns {Object} jqXHR
	 */
	 var showLayerPop = function(popElment, options, qs, openerEl) {
		var defaults = {
			url: options,
			data: qs ? qs : '',
			type: 'get',
			cache: false,
			openerEl: openerEl
		};

		if(popElment !== '') {
			var $pop = $(popElment);

			$pop.addClass('is-layer').show();
			$pop.addClass('page-in');
			
			$pop.height($(window).innerHeight());

			// 모션 사용하는 팝업 구분
			if($pop.data('motion-in')) {
				setTimeout(function() {
					// 모션 초기화 클래스 추가
					$pop.addClass('init');

					setTimeout(function () {
						// 모션 끝나면 focus
						$pop.find('.common-popup-inner').attr('tabindex','0').focus();
					}, $pop.data('motion-in') || 0);
				}, 10);
			} else {
				// focus
				$pop.find('.common-popup-inner').attr('tabindex','0').focus();
			}
		} else {
			var opts = typeof options === 'object' ? $.extend({}, defaults, options) : defaults;

			return $.ajax(opts).done(function(data) {
				var $con = $(data.split('<body>')[1].split('</body>')[0]); // body 내용만 추려서 파싱함
				// var $pop;

				// 중첩 레이어 처리 : openerEl 이 레이어 팝업 내부가 아니면
				if($(opts.openerEl).closest('.common-popup').length === 0) {
					// 기존 레이어 팝업 제거
					$('.common-popup.is-layer').parent().remove();
				}

				$($con).each(function() {
					if(this.className && this.className.indexOf('common-popup') > -1) {
						$pop = $(this);
					}
				});

				// is-layer 클래스 추가
				$pop.addClass('is-layer');

				// 되돌아갈 엘리먼트 지정
				$pop.data('opener', opts.openerEl || lastFocused);

				// 팝업 포커스 loop
				$('<a href="#" style="position: absolute;"></a>')
					.on('focusin', function() { $(this).prev().focus(); })
					.appendTo($pop);
				
				// 스크롤 차단
				$pop.on('touchmove', function(e) {
					if(!$(e.target).closest('.common-popup-inner').length) { e.preventDefault(); }
				});

				var scrollTop = $(window).scrollTop();

				$('html')
					.data('scrollTop', scrollTop)
					.css({ 'margin-top': -scrollTop, 'height': document.body.scrollHeight })
					.addClass('scroll-fixed');

				// body에 append
				$('body').append($('<div class="common-popup-container"></div>').append($con));

				// 모션 사용하는 팝업 구분
				if($pop.data('motion-in')) {
					setTimeout(function() {
						// 모션 초기화 클래스 추가
						$pop.addClass('init');

						setTimeout(function () {
							// 모션 끝나면 focus
							$pop.find('.common-popup-inner').attr('tabindex','0').focus();
						}, $pop.data('motion-in') || 0);
					}, 10);
				} else {
					// focus
					$pop.find('.common-popup-inner').attr('tabindex','0').focus();
				}

				// append 레이어팝업시 UI accordionList
				UI.init();
			});
		}

		var scrollTop = $window.scrollTop();
			$html
			.data('scrollTop', scrollTop)
			.css({ 'margin-top': -scrollTop, 'height': document.body.scrollHeight })
			.addClass('scroll-fixed');
	};

	/**
	 * 레이어팝업 닫기(제거)
	 *
	 * @param {String} selector 특정 팝업 CSS셀렉터
	 * @returns {Boolean}
	 */
	var closeLayerPop = function(selector) {
		var $html = $('html');
		var $pop = $(selector || '.common-pop.is-layer');
		var $popWrap = $pop.parent();
		var last = $pop.data('opener');

		var closeFunc = function() {
			// 마지막 포커스 엘리먼트로 이동
			if(last) {
				last.focus();
			}

			// 스크롤 차단 해제
			$pop.off('touchmove');
			$html.removeClass('scroll-fixed').css({
				'margin-top': '',
				'height': '',
			});
			$(window).scrollTop($html.data('scrollTop'));

			// 셀렉터가 없을땐 모두 지움
			if($pop.hasClass('page-in')) {
				$pop.removeClass('is-layer').hide();
				$pop.removeClass('page-in');
			} else {
				$popWrap.remove();
			}
		};

		// 모션 사용하는 팝업 구분
		if($pop.data('motion-out')) {
			// 모션 초기화 클래스 제거
			$pop.removeClass('init');
			setTimeout(closeFunc, $pop.data('motion-out') || 0);

		} else {
			closeFunc();
		}

		return false;
	};

	var editorInit = function(selector) {
		var $editor = $(selector || '.editor-cont');

		if($editor.length === 0) return false;

		$editor.keyup(function(){
			var content = $(this).val();
			$(this).next().children().html(content.length); //에디터가 여러개 일때 현재 입력하는 값만 체크
			// $('.character .num').html(content.length);
		});
	}


	var tabInit = function() {
		var el;
		el = $('.tab-group-wrap');

		if(el.length <= 0){
			return false;
		}
		el.each(function(idx, obj){
			var activeIdx;

			$(obj).find('.tab').each(function(index, element) {
				if($(element).hasClass('is-active')) activeIdx = index;
			});

			$(obj).find('> .tab-content').hide().eq(activeIdx).show();

			tabEvent(obj);
		});

		function tabEvent(obj){
			var $this = $(obj);
			console.log($this.attr('class'))

			$this.find('.tab-menu-box > .tab').on('click', function(e){
				e.preventDefault();

				console.log(e.target)
				var index = $(this).closest('.tab').index();
				if($this.find('> .tab-content').eq(index).length <= 0){
					return;
				}
				$this.find('.tab-menu-box > .tab').removeClass('is-active').eq(index).addClass('is-active');
				$this.find('> .tab-content').hide().eq(index).show();
			});
		}

	}

	var gnbInit = function() {
		var $btnOpen = $('.btn-gnb-menu');
		var $btnClose = $('.btn-menu-close');
		var $menu = $('.common-menu-wrap');
		var $dim = $('.common-menu-dim');

		if(!$menu.length) { return false; }

		$btnOpen.on('click', function(e) {
			$(this).addClass('is-open');
			var scrollTop = $window.scrollTop();
			$html
			.data('scrollTop', scrollTop)
			.css({ 'margin-top': -scrollTop, 'height': document.body.scrollHeight })
			.addClass('scroll-fixed');

			$('body').addClass('menu-open');
		});

		var menuClose = function() {
			$btnOpen.removeClass('is-open');
			$html.removeClass('scroll-fixed').css({
				'margin-top': '',
				'height': ''
			});
			$window.scrollTop($html.data('scrollTop'));
			$('body').removeClass('menu-open');
		}

		$btnClose.on('click', menuClose);
		$dim.on('click touchend', menuClose);	
	}

	var searchInit = function() {
		var $btnOpen = $('.icon-btn.search');
		var $btnClose = $('.common-search-wrap .btn-close');
		var $searchWarp = $('.common-search-wrap');
		var $dim = $('.common-menu-dim');

		if(!$searchWarp.length) { return false; }

		$btnOpen.on('click', function(e) {
			$(this).addClass('is-open');
			var scrollTop = $window.scrollTop();
			$html
			.data('scrollTop', scrollTop)
			.css({ 'margin-top': -scrollTop, 'height': document.body.scrollHeight })
			.addClass('scroll-fixed');

			$('body').addClass('search-open');
		});

		var serchClose = function() {
			$btnOpen.removeClass('is-open');
			$html.removeClass('scroll-fixed').css({
				'margin-top': '',
				'height': ''
			});
			$window.scrollTop($html.data('scrollTop'));
			$('body').removeClass('search-open');
		}

		$btnClose.on('click', serchClose);
		$dim.on('click touchend', serchClose);	

	}

	var tabScroll = function() {
		var $tg = $('.js-scroll-tab');

		$tg.each(function(i, el) {
			var $el = $(el);
			
			if($el.data('swiper') !== undefined) { return false; }

			$el.children().addClass('swiper-wrapper').children().addClass('swiper-slide');
			$el.data('swiper', new Swiper(el, {
				slidesPerView: 'auto',
				freeMode: true,
				initialSlide: $el.find('.is-active').index() || 0
			}));
		});

		// 폰트 로딩 타이밍 문제로 load callback 에서 사이즈 업데이트
		$window.on('load', function() {
			$tg.each(function(i, el) {
				$(el).data('swiper').update();
			});
		});
	}

	var botNavInit = function() {
		var $botNav = $('.bottom-nav-wrap');
		var $promoBtn = $('.bottom-nav-wrap .btn-promo');
		// var $openPromoBtn = $('.bottom-nav-wrap .btn01');
		var $promoPop = $('.bot-banner-wrap');
		var $html = $('html');
		
		

		$promoBtn.on('click', function() {
			var scrollTop = $(window).scrollTop();
			console.log(scrollTop);
			$(this).toggleClass('is-open is-hide');
			$promoPop.toggleClass('is-open');
			$html
				.data('scrollTop', scrollTop)
				.css({ 'margin-top': -scrollTop, 'height': document.body.scrollHeight })
				.addClass('scroll-fixed');
				
				if($(this).hasClass('is-hide')) {
					console.log(scrollTop);
					$promoPop.removeClass('is-open');
					$html.removeClass('scroll-fixed').css({
						'margin-top': '',
						'height': ''
					});
					// $(window).scrollTop($html.data('scrollTop'));			
				}
		});
	
	}

	var botNavShowHide = function () {
		var $botNav = $('.bottom-nav-wrap');
		var $html = $('html');
		var didScroll;
		var delta = 5;
		var lastScrollTop = 0;
		var $window = $(window);

		if($botNav.length == 0) { return false; }

		$(window).scroll(function(){
			if($botNav.length > 0) {
				didScroll = true;
			}
		});
		setInterval(function() {
			if (didScroll) {
				scrollCheck();
				didScroll = false;
			}
		}, 250);

		function scrollCheck() {
			var st = $window.scrollTop();
			var conT = 70;

			if(Math.abs(lastScrollTop - st) <= delta)
				return;

				if (st > lastScrollTop && st > conT) {
					// Scroll Down
					$botNav.addClass('is-hidden');
				} else {
					// Scroll Up
					if(st + $(window).height() < $(document).height()) {
						$botNav.removeClass('is-hidden');
					}
				}

				if(st <= conT) { 
					$botNav.removeClass('is-hidden');
				}

				lastScrollTop = st;
		}
	}

	var floatingMenu = function () {
		var $btnTop = $('.floating-menu .btn-icon.top');

		$btnTop.on('click', function() {
			window.scrollTo(0,0);
		});
		
	}

	var notiBar = function() {
		var $header;
		var $notiBar;

		if($('.common-header').length) {
			$header = $('.common-header');
		} else if ($('.page-header').length) {
			$header = $('.page-header');
		}

		$notiBar = $header.find('.noti-bar');

		$notiBar.on('click', function() {
			if($notiBar.is(':visible')) {
				$header.addClass('is-noti');
			} else {
				$header.removeClass('is-noti');
			}
		})

		if($notiBar.is(':visible')) {
			$header.addClass('is-noti');
		} else {
			$header.removeClass('is-noti');
		}
	}

	var mainScrollCheck = function() {
		var $window = $(window);
		var $target = $('.scroll-check');

		function scrollHandle() {
			var winHeight = $window.height();
			var scrollTop = $window.scrollTop();

			$target.each(function() {
				var $this = $(this);
				var ratio = 1 - (Number($this.data('ratio')) || 110) / 100;
				var isViewportIn = scrollTop > ($this.offset().top - winHeight) + (winHeight * ratio);

				$this.toggleClass('in', isViewportIn);
			});
		}

		$target.addClass('ready');
		$window.on('resize scroll', scrollHandle);
		scrollHandle();
	}

	var mainCommonAni = function() {
		gsap.registerPlugin(ScrollTrigger);

		var secTitle = $('.sec-title');

		gsap.utils.toArray(secTitle).forEach(function (item) {
			gsap.registerPlugin(ScrollTrigger);

			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1, 
					// markers: true
				},
					y: 70,
					ease: ease
				}
			);
		});
	}

	var mainIntroVisual = function() {
		$('.intro-visual .banner .list li').each(function(index, element) {
			var num = index + 1;
			$(this).addClass('item-bg' + num );
		});
	}

	var mainBestAni = function() {
		gsap.registerPlugin(ScrollTrigger);

		var bestProduct = $('.best-seller .best-product');
		var bestExplain = $('.best-seller .explain');

		gsap.utils.toArray(bestProduct).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1, 
					// markers: true
				},
					y: 70,
					ease: ease
				}
			);
		});

		gsap.utils.toArray(bestExplain).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1, 
					// markers: true
				},
					y: 70,
					ease: ease
				}
			);
		});
	}

	var mainPickAni = function() {
		gsap.registerPlugin(ScrollTrigger);

		var pickItem = $('.pick-product .item');

		gsap.utils.toArray(pickItem).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1, 
					// markers: true
				},
					y: 70,
					ease: ease
				}
			);
		});
	}

	var mainEventAni = function() {
		gsap.registerPlugin(ScrollTrigger);

		var eventCarousel = $('.event .event-carousel');

		gsap.utils.toArray(eventCarousel).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1, 
					// markers: true
				},
					y: 70,
					ease: ease
				}
			);
		});

		console.log('ds')
	}

	var mainDeliveryAni = function() {
		gsap.registerPlugin(ScrollTrigger);

		var deliveryCarousel = $('.delivery-service .delivery-carousel');

		gsap.utils.toArray(deliveryCarousel).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1, 
					// markers: true
				},
					y: 70,
					ease: ease
				}
			);
		});
	}

	var mainCustomerAni = function() {
		gsap.registerPlugin(ScrollTrigger);

		var customerReview = $('.customer-review .review-wrap');

		gsap.utils.toArray(customerReview).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1, 
					// markers: true
				},
					y: 70,
					ease: ease
				}
			);
		});
	}

	// public
	return {
		accordionList: accordionList,
		datePicker: datePicker,
		dropdown: dropdown,
		visiblePwd: visiblePwd,
		clearInput: clearInput,
		// topNaviInit: topNaviInit,
		header: header,
		showLayerPop: showLayerPop,
		closeLayerPop: closeLayerPop,
		editorInit: editorInit,
		tabInit: tabInit,
		gnbInit: gnbInit,
		searchInit: searchInit,
		tabScroll: tabScroll,
		botNavInit: botNavInit,
		botNavShowHide: botNavShowHide,
		floatingMenu: floatingMenu,
		notiBar: notiBar,

		// 메인페이지 액션
		mainScrollCheck: mainScrollCheck,
		mainCommonAni: mainCommonAni,
		mainIntroVisual: mainIntroVisual,
		mainBestAni: mainBestAni,
		mainPickAni: mainPickAni,
		mainEventAni: mainEventAni,
		mainDeliveryAni: mainDeliveryAni,
		mainCustomerAni: mainCustomerAni,

		/**
		 * UI 초기화
		 */
		init: function() {
			accordionList();
			datePicker();
			dropdown();
			visiblePwd();
			clearInput();
			header();
			editorInit();
			tabInit();
			gnbInit();
			searchInit();
			tabScroll();
			botNavInit();
			floatingMenu();
			notiBar();

			var width = $(window).outerWidth();
			// topNaviInit(width);

			var width = $(window).outerWidth();
			$(window).resize(function(){
				var width = $(window).outerWidth();
				// topNaviInit(width);
			});
			
			// 레이어 팝업 닫기 버튼
			$("body").on('click', '.js-pop-close', function(e) {
				closeLayerPop($(e.target).closest('.common-popup'));
				e.preventDefault();
			});

			// 셀렉트박스 옵션선택 후 포커스아웃
			$('select').on('change', function(e) {
				$(e.target).blur();
			});

			function viewportSize() {
				let vh = window.innerHeight * 0.01;
				let vw = (window.innerWidth - ($(window).outerWidth() - $(window).innerWidth())) * 0.01; // scroll바 대응
				document.documentElement.style.setProperty("--vh", `${vh}px`);
				document.documentElement.style.setProperty("--vw", `${vw}px`);
			}
			window.addEventListener("resize", viewportSize);
			window.addEventListener("load", viewportSize);

			$('body').addClass('init');
			if(!$('html').hasClass('scroll-fixed')) {
				botNavShowHide();
			}
			
		}
	};

})(window, document, jQuery);

// dom ready init
$(UI.init);