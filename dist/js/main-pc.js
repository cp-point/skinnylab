'use strict';

/**
 * MAIN Functions
 * @returns {Object}
 */
var MAIN = (function(window, document, $) {
	var headerAction = function() {
		var $window = $(window);
		var $body = $('body');

		$window.on('mousewheel', function(e) {
			if(e.originalEvent.deltaY < 0) {
				$body.removeClass('hidden-header');
			} else {
				$body.addClass('hidden-header');
			}
		});
	}

	var introVisualAction = function() {
		$('.intro-visual').addClass('in');

		$('.intro-visual .banner .list li').each(function(index, element) {
			var num = index + 1;
			$(this).addClass('item-bg' + num );
		});
	}

	var bestSellerAction = function() {
		var bestItem = $('.best-product .item');

		$('.best-seller').addClass('in');

		gsap.registerPlugin(ScrollTrigger);
		gsap.utils.toArray(bestItem).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-40% 100%",
					end: "50% 50%",
					scrub: 1,
					// once: true,
				},
					opacity: 0,
					y: 180,
					ease: ease
				}
			);
		});
	}

	var pickAction = function() {
		var pickItem01 = $('.pick-product .item01');
		var pickItem02 = $('.pick-product .item02');
		var pickItem03 = $('.pick-product .item03');

		$('.skinnylab-pick').addClass('in');

		gsap.registerPlugin(ScrollTrigger);
		gsap.utils.toArray(pickItem01).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1,
					// markers: true
				},
					y: 200,
					ease: ease
				}
			);
		});

		gsap.utils.toArray(pickItem02).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1.4,
				},
					y: 200,
					ease: ease
				}
			);
		});

		gsap.utils.toArray(pickItem03).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1.8,
				},
					y: 200,
					ease: ease
				}
			);
		});
	}

	var eventAction = function() {
		$('.event').addClass('in');

		$('.event .event-carousel .swiper-container .swiper-wrapper > li').each(function(index, element) {
			var num = index + 1;
			$(this).addClass('item-bg' + num );
		});

		function eventAni() {
			var eventItem = $('.event .event-carousel .swiper-container li .bg-wrap .bg');

			gsap.registerPlugin(ScrollTrigger);
			gsap.utils.toArray(eventItem).forEach(function (item) {
				var ease = Power4.easeOut;
				gsap.to(item, {
					scrollTrigger: {
						trigger: item,
						start: "-10% 100%",
						end: "100% 50%",
						scrub: .6,
					},
						top: -260
					}
				);
			});
		}
		eventAni();
	}

	var deliveryServiceAction = function() {
		$('.delivery-service').addClass('in');
	}

	var customerReviewAction = function() {
		var reviewItem01 = $('.review-wrap .list .item01');
		var reviewItem02 = $('.review-wrap .list .item02');
		var reviewItem03 = $('.review-wrap .list .item03');

		$('.customer-review').addClass('in');

		gsap.registerPlugin(ScrollTrigger);
		gsap.utils.toArray(reviewItem01).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1, 
				},
					y: 200,
					ease: ease
				}
			);
		});

		gsap.utils.toArray(reviewItem02).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1, 
				},
					y: 250,
					ease: ease
				}
			);
		});

		gsap.utils.toArray(reviewItem03).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.from(item, {
				scrollTrigger: {
					trigger: item,
					start: "-30% 100%",
					end: "50% 50%",
					scrub: 1, 
				},
					y: 300,
					ease: ease
				}
			);
		});
	}

	var footSliderAction = function() {
		$('.foot-slider').addClass('in');

		
	}

	// public
	return {
		headerAction: headerAction,

		introVisualAction: introVisualAction,
		bestSellerAction: bestSellerAction,
		pickAction: pickAction,
		eventAction: eventAction,
		deliveryServiceAction: deliveryServiceAction,
		customerReviewAction: customerReviewAction,
		footSliderAction: footSliderAction,

		/**
		 * MAIN 초기화
		 */
		init: function() {
		}
	};

})(window, document, jQuery);

// dom ready init
$(MAIN.init);