/**
 * CyberShield — Cybersecurity Awareness Website
 * main.js
 * 
 * Responsibilities:
 * - Back-to-top button fadeIn/fadeOut on scroll
 * - Smooth in-page navigation (with natural-flow navbar)
 * - Mobile hamburger menu auto-close on link click
 * - Reliable smooth scroll to top via scrollTo / jQuery animate
 * - Hero terminal typewriter animation with rotating security tips
 */

$(function () {
  'use strict';

  // ==========================================================================
  // 1. Back-to-Top Button Show/Hide on Scroll
  // ==========================================================================
  var $backToTopBtn = $('#backToTopBtn');
  var $navLinks = $('.navbar-nav .nav-link');

  function handleWindowScroll() {
    var scrollPos = $(window).scrollTop();

    // Toggle Back-to-Top button visibility with jQuery fadeIn/fadeOut
    if (scrollPos > 320) {
      $backToTopBtn.fadeIn(250);
    } else {
      $backToTopBtn.fadeOut(250);
    }

    // Highlight Home when near the very top of the page
    if (scrollPos < 120) {
      $navLinks.removeClass('active');
      $navLinks.filter('[href="#home"]').addClass('active');
    }
  }

  $(window).on('scroll', handleWindowScroll);
  // Run on initial load in case page is refreshed midway down
  handleWindowScroll();

  // ==========================================================================
  // 2. Smooth Scrolling & Mobile Menu Auto-Close
  // ==========================================================================
  $('a[href^="#"]').on('click', function (event) {
    var targetHash = this.hash;

    // Check if target element exists on page or is #home
    if (targetHash && (targetHash === '#home' || $(targetHash).length)) {
      event.preventDefault();

      // Navbar scrolls naturally with the page, so no fixed navbar offset is needed
      var targetPosition = (targetHash === '#home') ? 0 : $(targetHash).offset().top;

      // Smooth scroll using modern window.scrollTo with fallback to jQuery animate
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({
          top: targetPosition,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        $('html, body').stop().animate({ scrollTop: targetPosition }, 500);
      }

      // Update URL hash without causing an instant browser jump
      if (history.pushState) {
        history.pushState(null, null, targetHash);
      }

      // Update active navigation state
      $navLinks.removeClass('active');
      $navLinks.filter('[href="' + targetHash + '"]').addClass('active');

      // Auto-close responsive mobile navbar when link is clicked
      if ($('.navbar-collapse').hasClass('show')) {
        $('.navbar-toggler').trigger('click');
      }
    }
  });

  // ==========================================================================
  // 3. Back to Top Click Handler
  // ==========================================================================
  $backToTopBtn.on('click', function (e) {
    e.preventDefault();

    // Smoothly scroll to the very top
    if (typeof window.scrollTo === 'function') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      $('html, body').stop().animate({ scrollTop: 0 }, 500);
    }

    // Reset active nav state to Home
    $navLinks.removeClass('active');
    $navLinks.filter('[href="#home"]').addClass('active');
  });

  // ==========================================================================
  // 4. Hero Terminal Typewriter Effect
  // ==========================================================================
  var terminalMessages = [
    'Never disclose your SMS One-Time Password (OTP) to anyone. Banks and telcos will NEVER ask for it.',
    'Received an SMS about a suspended postal delivery parcel? Verify directly with the official courier before paying.',
    'Beware of WhatsApp and Telegram job offers offering Rs. 10,000/day for liking videos or rating hotels.',
    'Use unique passphrases of at least 12 characters and activate Multi-Factor Authentication on every account.',
    'A browser padlock means encrypted transit — fraudulent and phishing websites can also have HTTPS certificates.',
    'Keep your smartphone operating system and apps updated promptly to patch security vulnerabilities.'
  ];

  var $terminalText = $('#terminalTypingText');
  var currentMsgIdx = 0;
  var charIdx = 0;
  var isDeleting = false;
  var typingSpeed = 45;
  var pauseBetweenMsgs = 3200;

  function typeTerminalEffect() {
    if (!$terminalText.length) return;

    var currentMessage = terminalMessages[currentMsgIdx];

    if (!isDeleting) {
      // Typing forward
      $terminalText.text(currentMessage.substring(0, charIdx + 1));
      charIdx++;

      if (charIdx === currentMessage.length) {
        // Finished typing entire message
        isDeleting = true;
        setTimeout(typeTerminalEffect, pauseBetweenMsgs);
        return;
      }
    } else {
      // Deleting characters
      $terminalText.text(currentMessage.substring(0, charIdx - 1));
      charIdx--;

      if (charIdx === 0) {
        // Finished deleting, move to next message
        isDeleting = false;
        currentMsgIdx = (currentMsgIdx + 1) % terminalMessages.length;
        setTimeout(typeTerminalEffect, 400);
        return;
      }
    }

    var delay = isDeleting ? 20 : typingSpeed;
    setTimeout(typeTerminalEffect, delay);
  }

  // Initiate typewriter
  typeTerminalEffect();
});
