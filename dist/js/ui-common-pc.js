'use strict';

/**
 * UI Functions
 * @returns {Object}
 */
var UI = (function(window, document, $) {
	var lastFocused = null;
	
	function gnbInit() {
		var $header = $('.common-header');
		var $navMenu = $('.nav > li');
		var $navAnchor = $('.nav > li > a');
		var $navAllAnchor = $('.nav a');
		var $utilBtns = $header.find('.util-menu button');
		var $notiBar = $header.find('.noti-bar');

		if($notiBar.is(':visible')) $header.addClass('is-noti');

		$('body').on('click', function(e) {
			if(!$(e.target).parents('.common-header').length) {
				$header.removeClass('is-active');
				$header.removeClass('is-hover');

				$header.removeClass('open-search');
				$header.removeClass('open-menu');

				$utilBtns.removeClass('on');

				$navMenu.each(function(index) {
					$header.removeClass('open-nav' + (index + 1));
				});
			}
		});

		$header.on('mouseenter',function() {
			$(this).addClass('is-hover');
		});

		$header.on('mouseleave',function() {
			var $this = $(this);

			if($this.hasClass('open-search')) return false;

			$this.removeClass('is-active');
			$this.removeClass('is-hover');

			$header.removeClass('open-search');
			$header.removeClass('open-menu');

			$utilBtns.removeClass('on');

			$navMenu.each(function(index) {
				$header.removeClass('open-nav' + (index + 1));
			});
		});

		$navAnchor.on('mouseenter',function() {
			$header.removeClass('open-search');
			$header.removeClass('open-menu');

			$utilBtns.removeClass('on');

			$navMenu.each(function(index) {
				$header.removeClass('open-nav' + (index + 1));
			});

			$header.addClass('is-active');

			$header.addClass('open-nav' + ($navMenu.index($(this).parents('li')) + 1));
		});

		$navAllAnchor.on('focus', function() {
			$header.removeClass('open-search');
			$header.removeClass('open-menu');

			$utilBtns.removeClass('on');

			$header.addClass('is-active');

			$navMenu.each(function(index) {
				$header.removeClass('open-nav' + (index + 1));
			});

			$header.addClass('open-nav' + ($navMenu.index($(this).parents('li')[$(this).parents('li').length - 1]) + 1));
		});

		$navAllAnchor.on('blur', function() {
			if($(this).text() !== $($navAllAnchor[$navAllAnchor.length - 1]).text()) return false;

			$header.removeClass('is-active');

			$header.removeClass('open-search');
			$header.removeClass('open-menu');

			$utilBtns.removeClass('on');

			$navMenu.each(function(index) {
				$header.removeClass('open-nav' + (index + 1));
			});
		});
	}

	function floatingMunu() {
		var $window = $(window);
		var $floatingMenu = $('.floating-menu');
		var scrollY = $window.scrollTop();
		var scrollX = $window.scrollLeft();

		$window.on('scroll resize', function() {

			scrollY = $window.scrollTop();
			scrollX = $window.scrollLeft();

			if(scrollY >= $window.height()) {
				$floatingMenu.find('.top').addClass('on');
			} else {
				if($('.common-header').hasClass('is-fixed') && $('html').hasClass('scroll-fixed')) return false;
				$floatingMenu.find('.top').removeClass('on');
			}

			// fixed상태 좌우 스크롤
			if(scrollX > 0) $floatingMenu.css('margin-left', -scrollX);
		});

		$floatingMenu.on('click', '.top', function() {
			$('html, body').animate({ scrollTop: 0 }, 300);
		});
	}

	function fixedHeader() {
		var $window = $(window);
		var scrollTop = $window.scrollTop();
		var scrollX = $window.scrollLeft();
		var scrollY = $window.scrollTop();

		$window.on('scroll resize', function() {
			var $header = $('.common-header');
			var $headerInner = $header.find('.inner');
			var $notiBar = $header.find('.noti-bar');
			scrollTop = $window.scrollTop();
			scrollX = $window.scrollLeft();
			scrollY = $window.scrollTop();

			// fixed상태 좌우 스크롤
			if(scrollY > 0 && $header.hasClass('is-fixed')) {
				$headerInner.css('left', -scrollX);
				$notiBar.find('.wrap').css('margin-left', -scrollX);
				$notiBar.find('.btn-area').css('margin-left', -scrollX);
			}

			// fixed 시점
			if(scrollTop > 0) {
				$header.addClass('is-fixed');
			} else {
				if($('.common-header').hasClass('is-fixed') && $('html').hasClass('scroll-fixed')) return false;
				$header.removeClass('is-fixed');
			}
		});
	}

	function utilMenu() {
		var $header = $('.common-header');
		var $utilMenu = $header.find('.util-menu');
		var $navMenu = $('.nav > li');

		$utilMenu.on('click', 'button', function() {
			var $this = $(this);

			// GNB메뉴 닫기
			if($header.hasClass('is-active')) {
				$navMenu.each(function(index) {
					$header.removeClass('open-nav' + (index + 1));
				});
			}

			if($this.hasClass('btn-search')) {
				$this.toggleClass('on');
				$utilMenu.find('.btn-menu').removeClass('on');

				if(!$header.hasClass('open-search')) {
					$header.removeClass('open-menu');
					$header.addClass('is-active open-search');
				} else {
					$header.removeClass('open-search');
					$header.removeClass('is-active');
				}
			}

			if($this.hasClass('btn-menu')) {
				$this.toggleClass('on');
				$utilMenu.find('.btn-search').removeClass('on');

				if(!$header.hasClass('open-menu')) {
					$header.removeClass('open-search');
					$header.addClass('is-active open-menu');
				} else {
					$header.removeClass('open-menu');
					$header.removeClass('is-active');
				}
			}
		});
	}

	var breadcrumb = function() {
		$('.breadcrumb').off('click').on('click', '.list > li > a', function(e) {
			var $this = $(this);

			if(!$this.parents('.sub').length && !$this.parents('.home').length && $this.parents('li').find('.sub').length) {
				e.preventDefault();

				if($this.parents('li').find('.list').is(':visible')) {
					$this.parents('li').removeClass('on');
					$this.parents('li').find('.list').slideUp(100);
				} else {
					$this.parents('li').addClass('on');
					$this.parents('li').find('.list').slideDown(100);
				}
			}
		});
	}

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
		});
		$tg.datepicker('setDate','today');
	}

	var accordionList = function(selector) {
		var $accordion = $(selector || '.accordion-list');

		$accordion.find('.item.on .content').css('display', 'block');

		$accordion.off('click').on('click', '.title a', function(e) {
			e.preventDefault();

			var $tg = $(this);
			var $tgTitle = $tg.parents('.title');
			var $tgContent = $tgTitle.next();
			var $tgItem = $tg.parents('.item');
			var isActive = $tgContent.is(':visible');

			if($tgContent.children().length === 0 && $tgContent.text() === 0) return false;

			if(isActive) {
				$tgContent.slideUp(200);
				$tgItem.removeClass('on');
			} else {
				$tgContent.slideDown(200);
				$tgItem.addClass('on');
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

			var scrollTop = $(window).scrollTop();

			$('html')
				.data('scrollTop', scrollTop)
				.css({ 'margin-top': -scrollTop, 'height': document.body.scrollHeight })
				.addClass('scroll-fixed');

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
			});
		}

		
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
				// if(!$popWrap.hasClass('wrapper')) {
				// 	console.log('1')
				// 	if(!$popWrap.hasClass('common-container')) {
				// 		console.log('2')
				// 		console.log($popWrap)
						
				// 	}
				// }
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

	// 마이페이지 상단 캐러셀(마이페이지 공통)
	var mypageTopInit = function() {
		if($('.shopping-diary .swiper-container').length) {
			var shoppingDiarySlide = new Swiper('.shopping-diary .swiper-container', {
				// loop: true,
				// loopAdditionalSlides : 1,
				slidesPerView: 3,
				// slidesPerGroup: 1,
				initialSlide: 0,
				spaceBetween: 41,
				watchOverflow : true,
				// allowTouchMove: false,
				slidesOffsetBefore: 15,
				slidesOffsetAfter: -25,
				
				navigation: {
					nextEl: '.shopping-diary .swiper-button-next',
					prevEl: '.shopping-diary .swiper-button-prev',
				},
				on: {
					init: function(swiper) {
						var slideNum = this.slides.length;
						if(slideNum == 0) {
							$('.shopping-diary .empty').show();
						}
					},
				   
				  }
			});
		}
	}

	var editorInit = function(selector) {
		var $editor = $(selector || '.editor-cont');

		if($editor.length === 0) return false;

		$editor.each(function(index, element) {
			$(element).keyup(function(){
				var content = $(this).val();

				$(element).parents('.editor').find('.character .num').html(content.length);
			});
		});
	}

	var tabInit = function() {
		var el;
		el = $('.tab-group-wrap');
		if(el.length <= 0){
			return;
		}
		el.each(function(idx, obj){
			if($(obj).find('.tab-menu-box > .tab').hasClass('selected')) {
				$(obj).find('.tab-menu-box > .tab').removeClass('selected').eq(0).addClass('selected');
			} else {
				$(obj).find('.tab-menu-box > .tab').removeClass('is-active').eq(0).addClass('is-active');
			}
			$(obj).find('> .tab-content').hide().eq(0).show();
	
			tabEvent(obj);
		});

		function tabEvent(obj){
			var $this = $(obj);

			$this.find('.tab-menu-box > .tab').on('click', function(e){
				e.preventDefault();
				var index = $(this).closest('.tab').index();
				if($this.find('> .tab-content').eq(index).length <= 0){
					return;
				}
				if($this.find('.tab-menu-box > .tab').hasClass('selected')) {
					$this.find('.tab-menu-box > .tab').removeClass('selected').eq(index).addClass('selected');
				} else {
					$this.find('.tab-menu-box > .tab').removeClass('is-active').eq(index).addClass('is-active');
				}
				$this.find('> .tab-content').hide().eq(index).show();
			});
		}

	}

	// 브라우저 체크 ie일경우 안내팝업 노출
	var ieCheck = function() {
		var agent = navigator.userAgent.toLowerCase();
		if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
			UI.showLayerPop('',{ url: '../common/popup-browser-info.html'}); return false;
		}
	}

	var scrollTabInit = function() {
		var $tabMenu = $('.tab-menu.overline') ? $('.tab-menu.overline') : null;

		if($tabMenu.find('.wrap').width() < $tabMenu.find('.list').width()) {
			$tabMenu.find('.wrap').addClass('swiper-container').find('.list').addClass('swiper-wrapper').find('li').addClass('swiper-slide');

			$tabMenu.append('<div class="action"><div class="play"><button type="button" class="btn-prev swiper-button-prev"></button><button type="button" class="btn-next swiper-button-next"></button></div></div>');

			var tabmenuSwiper = new Swiper($tabMenu.find('.wrap'), {
				slidesPerView: 'auto',
				freeMode: true,
				initialSlide: $tabMenu.find('.selected').index() || 0,
				navigation: {
					nextEl: '.tab-menu.overline .swiper-button-next',
					prevEl: '.tab-menu.overline .swiper-button-prev',
				}
			});
		}
	}

	// public
	return {
		gnbInit: gnbInit,
		floatingMunu: floatingMunu,
		fixedHeader: fixedHeader,
		utilMenu: utilMenu,
		breadcrumb: breadcrumb,
		dropdown: dropdown,
		accordionList: accordionList,
		datePicker: datePicker,
		visiblePwd: visiblePwd,
		clearInput: clearInput,

		showLayerPop: showLayerPop,
		closeLayerPop: closeLayerPop,
		mypageTopInit: mypageTopInit,
		editorInit: editorInit,
		tabInit: tabInit,
		ieCheck: ieCheck,
		scrollTabInit: scrollTabInit,

		/**
		 * UI 초기화
		 */
		init: function() {
			gnbInit();
			floatingMunu();
			fixedHeader();
			utilMenu();
			breadcrumb();
			dropdown();
			accordionList();
			datePicker();
			visiblePwd();
			clearInput();
			mypageTopInit();
			editorInit();
			tabInit();
			ieCheck();
			scrollTabInit();

			// 레이어 팝업 닫기 버튼
			$("body").on('click', '.js-pop-close', function(e) {
				closeLayerPop($(e.target).closest('.common-popup'));
				e.preventDefault();
			});

			// 셀렉트박스 옵션선택 후 포커스아웃
			$('select').on('change', function(e) {
				$(e.target).blur();
			});
		}
	};

})(window, document, jQuery);

// dom ready init
$(UI.init);