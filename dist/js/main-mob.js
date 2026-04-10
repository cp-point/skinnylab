'use strict';

/**
 * MAIN Functions
 * @returns {Object}
 */
var MAIN = (function(window, document, $) {
	var introVisualAction = function() {
		$('.intro-visual').addClass('in');

		$('.intro-visual .banner .list li').each(function(index, element) {
			var num = index + 1;
			$(this).addClass('item-bg' + num );
		});
	}

	var bestSellerAction = function() {
		$('.best-seller').addClass('in');

		gsap.registerPlugin(ScrollTrigger);

		var bestProduct = $('.best-seller .best-product');
		var bestExplain = $('.best-seller .explain');
		var secTitle = $('.best-seller .sec-title');

		gsap.utils.toArray(secTitle).forEach(function (item) {
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

	var pickAction = function() {
		$('.skinnylab-pick').addClass('in');

		gsap.registerPlugin(ScrollTrigger);

		var pickItem = $('.pick-product .item');
		var secTitle = $('.skinnylab-pick .sec-title');

		gsap.utils.toArray(secTitle).forEach(function (item) {
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

	var eventAction = function() {
		$('.event').addClass('in');

		gsap.registerPlugin(ScrollTrigger);

		var eventCarousel = $('.event .event-carousel');
		var secTitle = $('.event .sec-title');
		var eventItem = $('.event .event-carousel .swiper-container li .bg-wrap .bg');

		gsap.utils.toArray(eventItem).forEach(function (item) {
			var ease = Power4.easeOut;
			gsap.to(item, {
				scrollTrigger: {
					trigger: item,
					start: "-10% 100%",
					end: "100% 50%",
					scrub: 1,
				},
					top: -50
				}
			);
		});

		gsap.utils.toArray(secTitle).forEach(function (item) {
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
	}

	var deliveryServiceAction = function() {
		$('.delivery-service').addClass('in');

		gsap.registerPlugin(ScrollTrigger);

		var deliveryCarousel = $('.delivery-service .delivery-carousel');
		var secTitle = $('.delivery-servic .sec-title');

		gsap.utils.toArray(secTitle).forEach(function (item) {
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

	var customerReviewAction = function() {
		$('.customer-review').addClass('in');

		gsap.registerPlugin(ScrollTrigger);

		var customerReview = $('.customer-review .review-wrap');
		var secTitle = $('.customer-review .sec-title');

		gsap.utils.toArray(secTitle).forEach(function (item) {
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

	var footSliderAction = function() {
		$('.foot-slider').addClass('in');
	}

	// public
	return {
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