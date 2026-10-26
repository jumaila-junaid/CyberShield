/**
 * CyberShield — Cybersecurity Awareness Website
 * phish.js
 * 
 * Responsibilities:
 * - Interactive "Spot the Phish" simulated exercise
 * - Tracking discovery of 5 distinct phishing red flags
 * - Duplicate selection prevention
 * - Live "Found X/5" counter update
 * - Revealing clear, beginner-friendly security explanations
 * - Congratulatory completion banner trigger
 * - Full state reset
 */

$(function () {
  'use strict';

  // Details for the 5 phishing indicators
  var phishFlagsData = {
    sender: {
      title: 'Suspicious & Unofficial Sender Domain',
      explanation: 'The email address uses "sl-postal-secure-track-delivery.xyz" rather than an authentic government or registered corporate domain (.gov.lk or verified .lk). Attackers frequently register cheap, hyphenated domain names to mimic trusted organizations.'
    },
    greeting: {
      title: 'Generic, Impersonal Greeting',
      explanation: 'Using "Dear Valued Customer" instead of your actual registered name is a hallmark of mass phishing campaigns. Legitimate courier services that have your package already have your recipient name and dispatch details.'
    },
    urgency: {
      title: 'Manufactured Urgency & Coercive Threats',
      explanation: 'Threats like "Package will be seized, destroyed within 24 hours" are psychological tactics designed to induce panic. Scammers know that when people feel rushed or fearful, they skip critical verification steps.'
    },
    link: {
      title: 'Deceptive URL & Insecure HTTP Protocol',
      explanation: 'The link directs to "track-parcel-srilanka-paynow.cc" over unencrypted HTTP. Legitimate postal portals never direct users to obscure overseas top-level domains (.cc, .xyz) for customs clearance payments.'
    },
    sensitive: {
      title: 'Outrageous Request for CVV, NIC & OTP',
      explanation: 'Postal couriers never require your card CVV or SMS One-Time Password (OTP) via email. Sharing an OTP gives attackers immediate clearance to drain your bank account or take over your digital profile.'
    }
  };

  // State
  var discoveredFlags = {};
  var totalFlagsCount = 5;

  // DOM Elements
  var $flags = $('.phish-flag');
  var $counterBadge = $('#phishFoundCount');
  var $completionBanner = $('#phishCompletionBanner');
  var $resetBtn = $('#resetPhishBtn');

  /**
   * Updates the counter badge text
   */
  function updateCounter() {
    var count = Object.keys(discoveredFlags).length;
    $counterBadge.text('Found ' + count + ' / ' + totalFlagsCount + ' Red Flags');

    if (count === totalFlagsCount) {
      $completionBanner.slideDown(350);
    } else {
      $completionBanner.slideUp(200);
    }
  }

  /**
   * Handle clicking on a potential red flag in the email
   */
  $flags.on('click', function (e) {
    e.preventDefault();

    var $flag = $(this);
    var flagKey = $flag.data('flag');

    // Prevent duplicate counting if already discovered
    if (discoveredFlags[flagKey]) {
      return;
    }

    // Mark as discovered in state
    discoveredFlags[flagKey] = true;

    // Apply visual highlight to the flag element in the email
    $flag.addClass('flag-found');
    $flag.attr('aria-label', $flag.text() + ' (Discovered Red Flag)');

    // Reveal and highlight the corresponding explanation card below
    var $explanationCard = $('#explanation-' + flagKey);
    $explanationCard.addClass('revealed');
    $explanationCard.find('.explanation-status-badge')
      .removeClass('bg-secondary')
      .addClass('bg-danger')
      .html('<i class="bi bi-check-circle-fill"></i> Discovered');

    $explanationCard.find('.explanation-content').slideDown(300);

    // Update the counter
    updateCounter();
  });

  // Keyboard accessibility: Enter or Space triggers flag detection
  $flags.on('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $(this).trigger('click');
    }
  });

  /**
   * Resets the entire exercise to the initial clean state
   */
  function resetPhishExercise() {
    discoveredFlags = {};

    $flags.removeClass('flag-found');
    $flags.each(function () {
      $(this).attr('aria-label', $(this).text() + ' (Click to inspect)');
    });

    $('.phish-explanation-card').each(function () {
      var $card = $(this);
      $card.removeClass('revealed');
      $card.find('.explanation-status-badge')
        .removeClass('bg-danger')
        .addClass('bg-secondary')
        .html('<i class="bi bi-search"></i> Undiscovered');
      $card.find('.explanation-content').slideUp(200);
    });

    updateCounter();
  }

  $resetBtn.on('click', function (e) {
    e.preventDefault();
    resetPhishExercise();
  });

  // Initialize
  updateCounter();
});
