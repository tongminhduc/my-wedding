$(document).ready(function() {
	'use strict';
	
	// MagnificPopup cho ảnh
	var magnifPopup = function() {
		if (typeof $.fn.magnificPopup === 'undefined') {
			console.error('Magnific Popup plugin is not loaded!');
			return;
		}
		
		// Hàm khởi tạo lại Magnific Popup
		var initMagnific = function() {
			// Xóa các instance cũ để tránh duplicate
			$('.image-popup').each(function() {
				var $this = $(this);
				if ($this.data('magnificPopup')) {
					$this.magnificPopup('destroy');
				}
			});
			
			// Khởi tạo Magnific Popup cho tất cả các link có class image-popup
			$('.image-popup').magnificPopup({
				type: 'image',
				removalDelay: 300,
				mainClass: 'mfp-with-zoom',
				closeOnContentClick: true,
				closeBtnInside: false,
				fixedContentPos: false,
				gallery:{
					enabled:true
				},
				zoom: {
					enabled: true,
					duration: 300,
					easing: 'ease-in-out'
				},
				callbacks: {
					open: function() {
						// Ngăn scroll body khi popup mở
						$('body').css('overflow', 'hidden');
					},
					close: function() {
						// Khôi phục scroll body khi popup đóng
						$('body').css('overflow', '');
					}
				}
			});
		};
		
		// Khởi tạo ngay lập tức
		initMagnific();
		
		// Khởi tạo lại sau khi window load (đảm bảo tất cả đã sẵn sàng)
		$(window).on('load', function() {
			setTimeout(initMagnific, 200);
		});
		
		// Khởi tạo lại sau một khoảng thời gian để bắt các element được animate
		setTimeout(function() {
			initMagnific();
		}, 1000);
		
		// Khởi tạo lại khi scroll (để bắt các element được animate khi scroll đến)
		var scrollTimeout;
		$(window).on('scroll', function() {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(function() {
				var hasUninitialized = $('.image-popup').not('.mfp-ready').length > 0;
				if (hasUninitialized) {
					initMagnific();
				}
			}, 300);
		});
	};

	var magnifVideo = function() {
		if (typeof $.fn.magnificPopup !== 'undefined') {
			$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
				disableOn: 700,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,
				fixedContentPos: false
			});
		}
	};

	// Call the functions 
	magnifPopup();
	magnifVideo();
});