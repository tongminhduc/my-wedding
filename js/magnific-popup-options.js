// Sử dụng jQuery để đảm bảo tương thích với Magnific Popup
(function() {
	'use strict';
	
	// Hàm xử lý click vào image popup
	function handleImagePopupClick(e) {
		var $link = $(e.currentTarget || e.target).closest('.image-popup');
		
		if ($link.length === 0) {
			return;
		}
		
		// Ngăn default behavior và propagation
		e.preventDefault();
		e.stopImmediatePropagation();
		
		// Đảm bảo jQuery và Magnific Popup đã load
		if (typeof jQuery === 'undefined' || typeof $.magnificPopup === 'undefined') {
			return false;
		}
		
		var href = $link.attr('href');
		
		if (!href) {
			return false;
		}
		
		// Đảm bảo element có thể click
		if ($link.css('pointer-events') === 'none') {
			$link.css('pointer-events', 'auto');
		}
		
		// Tìm tất cả các ảnh trong gallery để tạo gallery mode
		var items = [];
		var currentIndex = 0;
		
		$('#fh5co-gallery-list .image-popup').each(function(index) {
			var itemHref = $(this).attr('href');
			if (itemHref) {
				items.push({
					src: itemHref,
					type: 'image'
				});
				if (this === $link[0]) {
					currentIndex = index;
				}
			}
		});
		
		// Nếu không có gallery, chỉ mở ảnh đơn
		if (items.length === 0) {
			items.push({
				src: href,
				type: 'image'
			});
		}
		
		// Mở popup trực tiếp - không dùng zoom opener để tránh lỗi
		$.magnificPopup.open({
			items: items,
			type: 'image',
			gallery: {
				enabled: items.length > 1
			},
			removalDelay: 300,
			mainClass: 'mfp-with-zoom',
			closeOnContentClick: true,
			closeBtnInside: false,
			fixedContentPos: false,
			index: currentIndex,
			zoom: {
				enabled: false  // Tắt zoom để tránh lỗi với opener function
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
		}, currentIndex);
		
		return false;
	}
	
	// Bind event khi jQuery đã sẵn sàng
	function initImagePopup() {
		if (typeof jQuery === 'undefined') {
			return;
		}
		
		// Xóa event cũ nếu có
		$(document).off('click.imagepopup', '.image-popup');
		
		// Bind event với jQuery - đảm bảo tương thích
		$(document).on('click.imagepopup', '.image-popup', handleImagePopupClick);
	}
	
	// Khởi tạo ngay khi jQuery sẵn sàng
	if (typeof jQuery !== 'undefined') {
		$(document).ready(function() {
			initImagePopup();
		});
	} else {
		// Đợi jQuery load
		window.addEventListener('load', function() {
			if (typeof jQuery !== 'undefined') {
				$(document).ready(function() {
					initImagePopup();
				});
			}
		});
	}
	
	// Khởi tạo lại sau một khoảng thời gian để đảm bảo
	setTimeout(function() {
		if (typeof jQuery !== 'undefined') {
			initImagePopup();
		}
	}, 500);
})();

$(document).ready(function() {
	'use strict';
	
	// MagnificPopup cho ảnh (backup - nhưng event delegation ở trên sẽ chạy trước)
	var magnifPopup = function() {
		// Function này giữ lại để tương thích, nhưng event delegation ở trên sẽ xử lý
		if (typeof $.fn.magnificPopup === 'undefined') {
			console.error('Magnific Popup plugin is not loaded!');
			return;
		}
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