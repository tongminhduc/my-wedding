/**
 * Custom JavaScript for Wedding Invitation
 */

(function() {
  'use strict';

  // Initialize countdown timer
  function initCountdown() {
    var d = new Date(new Date().getTime() + 200 * 120 * 120 * 2000);

    // Default countdown
    if (typeof simplyCountdown !== 'undefined') {
      simplyCountdown('.simply-countdown-one', {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate()
      });
    }
  }

  // Initialize name popup and team selection
  function initNamePopup() {
    const popup = document.getElementById('namePopup');
    const input = document.getElementById('guestName');
    const inviteName = document.querySelector('#fh5co-couple h2');
    const btnTeamGroom = document.querySelector('.btn-team-groom');
    const btnTeamBride = document.querySelector('.btn-team-bride');
    const mainContent = document.querySelector('.main-content');
    const invitationGroom = document.getElementById('invitation-card-groom');
    const invitationBride = document.getElementById('invitation-card-bride');
    const teamGroomContent = document.querySelector('.team-groom-content');
    const teamBrideContent = document.querySelector('.team-bride-content');

    if (!popup || !input || !inviteName) {
      return;
    }

    // Always show popup when page loads
    // Check if team and name were previously saved to pre-fill
    const savedTeam = localStorage.getItem('selectedTeam');
    const savedName = localStorage.getItem('guestName');
    
    // Reset content when showing popup
    if (mainContent) {
      mainContent.style.display = 'block';
    }
    
    // Hide all team content
    const allTeamContent = document.querySelectorAll('.team-content');
    allTeamContent.forEach(function(content) {
      if (content) content.style.display = 'none';
    });
    
    if (savedName) {
      input.value = savedName;
    }
    
    // Show popup when page loads
    popup.style.display = 'flex';
    document.body.classList.add('popup-active');

    // Handle team selection
    if (btnTeamGroom) {
      btnTeamGroom.addEventListener('click', function() {
        const name = input.value.trim();
        if (name === '') {
          alert('Vui lòng nhập tên của bạn nhé!');
          return;
        }
        inviteName.textContent = name;
        localStorage.setItem('guestName', name);
        localStorage.setItem('selectedTeam', 'groom');
        selectTeam('groom', mainContent, invitationGroom, invitationBride, teamGroomContent, teamBrideContent);
        popup.style.display = 'none';
        document.body.classList.remove('popup-active');
      });
    }

    if (btnTeamBride) {
      btnTeamBride.addEventListener('click', function() {
        const name = input.value.trim();
        if (name === '') {
          alert('Vui lòng nhập tên của bạn nhé!');
          return;
        }
        inviteName.textContent = name;
        localStorage.setItem('guestName', name);
        localStorage.setItem('selectedTeam', 'bride');
        selectTeam('bride', mainContent, invitationGroom, invitationBride, teamGroomContent, teamBrideContent);
        popup.style.display = 'none';
        document.body.classList.remove('popup-active');
      });
    }

    // Allow Enter key to focus on team buttons
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Focus on first team button
        if (btnTeamGroom) {
          btnTeamGroom.focus();
        }
      }
    });
  }

  // Function to select team and show appropriate content
  function selectTeam(team, mainContent, invitationGroom, invitationBride, teamGroomContent, teamBrideContent) {
    // Hide main content
    if (mainContent) {
      mainContent.style.display = 'none';
    }

    // Hide all team content
    const allTeamContent = document.querySelectorAll('.team-content');
    allTeamContent.forEach(function(content) {
      if (content) content.style.display = 'none';
    });

    // Get guest name
    const guestName = localStorage.getItem('guestName') || '';
    const guestNameGroom = document.getElementById('guestNameGroom');
    const guestNameBride = document.getElementById('guestNameBride');

    // Show selected team's invitation card
    if (team === 'groom') {
      if (invitationGroom) {
        invitationGroom.style.display = 'block';
      }
      if (teamGroomContent) {
        teamGroomContent.style.display = 'block';
      }
      // Fill name into groom's invitation
      if (guestNameGroom && guestName) {
        guestNameGroom.textContent = guestName;
      }
    } else if (team === 'bride') {
      if (invitationBride) {
        invitationBride.style.display = 'block';
      }
      if (teamBrideContent) {
        teamBrideContent.style.display = 'block';
      }
      // Fill name into bride's invitation
      if (guestNameBride && guestName) {
        guestNameBride.textContent = guestName;
      }
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }

  // Save RSVP to localStorage
  function saveRSVPToLocalStorage(formData) {
    let rsvpList = [];
    
    // Get existing RSVP list from localStorage
    const stored = localStorage.getItem('rsvpList');
    if (stored) {
      try {
        rsvpList = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing RSVP list:', e);
        rsvpList = [];
      }
    }
    
    // Add new RSVP with timestamp
    const rsvpEntry = {
      ...formData,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString('vi-VN')
    };
    
    rsvpList.push(rsvpEntry);
    
    // Save back to localStorage
    localStorage.setItem('rsvpList', JSON.stringify(rsvpList));
    
    return rsvpList;
  }

  // Send data to Google Sheet
  function sendToGoogleSheet(formData) {
    // Thay bằng URL của Google Apps Script Web App của bạn
    // Bạn sẽ nhận được URL này sau khi deploy Google Apps Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqUI_Z99dTmIoASkynRQ_Kdo1gHPEWEKfk3-742EjILzJzvXfiSq4uBVTXNf1w8nX7/exec'; // Thay bằng URL của bạn
    
    // Check if Google Script URL is configured
    if (GOOGLE_SCRIPT_URL !== 'https://script.google.com/macros/s/AKfycbyqUI_Z99dTmIoASkynRQ_Kdo1gHPEWEKfk3-742EjILzJzvXfiSq4uBVTXNf1w8nX7/exec') {
      console.warn('Google Script URL chưa được cấu hình. Vui lòng cập nhật URL trong js/custom.js');
      return Promise.resolve(false);
    }
    
    // Prepare data to send
    const data = {
      name: formData.name || '',
      phone: formData.phone || '',
      wishes: formData.wishes || '',
      attendance: formData.attendance || '',
      timestamp: new Date().toLocaleString('vi-VN'),
      date: new Date().toISOString()
    };
    
    // Send data to Google Sheet via fetch
    return fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(function() {
      // With no-cors mode, we can't read the response
      // But the data should be sent
      console.log('Data sent to Google Sheet');
      return true;
    })
    .catch(function(error) {
      console.error('Failed to send data to Google Sheet:', error);
      return false;
    });
  }

  // Initialize RSVP form
  function initRSVPForm() {
    const rsvpForm = document.getElementById('rsvpForm');
    
    if (!rsvpForm) {
      return;
    }

    rsvpForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('guestNameForm').value,
        phone: document.getElementById('guestPhone').value,
        wishes: document.getElementById('guestWishes').value,
        attendance: document.getElementById('guestAttendance').value
      };

      // Validate required fields
      if (!formData.name || formData.name.trim() === '') {
        alert('Vui lòng nhập tên của bạn!');
        return;
      }

      // Show loading message
      const submitButton = rsvpForm.querySelector('.btn-rsvp');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Đang xử lý...';
      submitButton.disabled = true;

      // Save to localStorage (optional backup)
      saveRSVPToLocalStorage(formData);

      // Send to Google Sheet
      sendToGoogleSheet(formData).then(function(sent) {
        if (sent) {
          alert('Cảm ơn bạn đã gửi lời chúc! ❤️');
        } else {
          alert('Cảm ơn bạn đã gửi lời chúc! ❤️\n\n(Lưu ý: Dữ liệu chưa được gửi lên Google Sheet. Vui lòng kiểm tra cấu hình Google Script URL trong js/custom.js)');
        }
        
        // Reset form
        rsvpForm.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
    });
  }

  // Initialize QR Code popup
  function initQRCodePopup() {
    const qrButton = document.getElementById('qrCodeButton');
    const qrPopup = document.getElementById('qrCodePopup');
    const qrImage = document.getElementById('qrCodeImage');
    const qrClose = document.querySelector('.qr-popup-close');

    if (!qrButton || !qrPopup || !qrImage) {
      return;
    }

    // Handle QR button click
    qrButton.addEventListener('click', function() {
      const selectedTeam = localStorage.getItem('selectedTeam');
      
      // Set QR code image based on team
      if (selectedTeam === 'groom') {
        qrImage.src = 'images/qrtrai.jpg'; // QR code for nhà trai
      } else if (selectedTeam === 'bride') {
        qrImage.src = 'images/qrgai.jpg'; // QR code for nhà gái
      } else {
        // Default QR code if no team selected - show alert to select team first
        alert('Vui lòng chọn team nhà trai hoặc nhà gái trước!');
        return;
      }
      
      qrPopup.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    // Handle close button click
    if (qrClose) {
      qrClose.addEventListener('click', function() {
        qrPopup.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close popup when clicking outside
    qrPopup.addEventListener('click', function(e) {
      if (e.target === qrPopup) {
        qrPopup.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && qrPopup.classList.contains('active')) {
        qrPopup.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initNamePopup();
    initCountdown();
    initRSVPForm();
    initQRCodePopup();
  });
})();

