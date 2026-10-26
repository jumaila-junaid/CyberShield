/**
 * CyberShield — Cybersecurity Awareness Website
 * threats.js
 * 
 * Responsibilities:
 * - Threat Card details expansion & collapse via jQuery slideToggle()
 * - Single-card open policy (auto-collapsing previously opened threat cards)
 * - Accessibility state maintenance (aria-expanded, keyboard control)
 * - Safety Tips category filtering using jQuery fadeIn() / fadeOut()
 * - Active filter button management and accessible attributes (aria-pressed)
 */

$(function () {
  'use strict';

  // ==========================================================================
  // 1. Cyber Threat Cards Accordion Behavior
  // ==========================================================================
  var $threatExpandBtns = $('.threat-expand-btn');

  $threatExpandBtns.on('click', function (e) {
    e.preventDefault();

    var $clickedBtn = $(this);
    var targetDetailsId = $clickedBtn.attr('aria-controls');
    var $targetDetails = $('#' + targetDetailsId);
    var isCurrentlyExpanded = $clickedBtn.attr('aria-expanded') === 'true';

    // Rule: Keep only ONE threat card open at any time
    // First, slide up all other open detail areas and reset their buttons
    $('.threat-details-area').not($targetDetails).slideUp(300);
    $threatExpandBtns.not($clickedBtn).attr('aria-expanded', 'false');

    // Toggle the clicked card's details area
    if (isCurrentlyExpanded) {
      $targetDetails.slideUp(300, function () {
        $clickedBtn.attr('aria-expanded', 'false');
      });
    } else {
      $targetDetails.slideDown(300, function () {
        $clickedBtn.attr('aria-expanded', 'true');
      });
    }
  });

  // Keyboard accessibility: Allow Space & Enter to toggle threat cards
  $threatExpandBtns.on('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $(this).trigger('click');
    }
  });

  // ==========================================================================
  // 2. Safety Tips Category Filtering & Reset Handling
  // ==========================================================================
  var $filterBtns = $('.filter-btn');
  var $tipCards = $('.tip-item-col');
  var currentCategory = 'all';

  /**
   * Applies the selected category filter, updates cards with .stop(true, true),
   * and synchronizes the active button states and aria attributes.
   * @param {string} category - The category to filter by ('all', 'passwords', etc.)
   */
  function applyTipFilter(category) {
    currentCategory = category || 'all';

    // 1. Update filter buttons active styling and aria-pressed states
    $filterBtns.each(function () {
      var $btn = $(this);
      var isActive = $btn.data('filter') === currentCategory;
      $btn.toggleClass('active', isActive).attr('aria-pressed', isActive ? 'true' : 'false');
    });

    // 2. Filter cards using jQuery stop(true, true) with fadeIn/fadeOut
    $tipCards.each(function () {
      var $col = $(this);
      var cardCategory = $col.find('.tip-card').data('category');
      var shouldShow = (currentCategory === 'all' || cardCategory === currentCategory);

      $col.stop(true, true);
      if (shouldShow) {
        if ($col.is(':hidden')) {
          $col.fadeIn(300);
        } else {
          $col.css('opacity', 1);
        }
      } else {
        if (!$col.is(':hidden')) {
          $col.fadeOut(250);
        }
      }
    });
  }

  // Mobile touch scroll tracking to prevent accidental resets during scrolling
  var touchMoved = false;
  $(document).on('touchstart', function () {
    touchMoved = false;
  });
  $(document).on('touchmove', function () {
    touchMoved = true;
  });

  // Single delegated click handler for filter buttons and empty-area resets
  $(document).on('click', function (e) {
    if (touchMoved) {
      touchMoved = false;
      return;
    }

    var $target = $(e.target);

    // Case A: Click on a filter button
    var $clickedFilterBtn = $target.closest('.filter-btn');
    if ($clickedFilterBtn.length) {
      e.preventDefault();
      var selected = $clickedFilterBtn.data('filter');
      // If clicking the currently active category button a second time, reset to 'all'
      if (selected === currentCategory && currentCategory !== 'all') {
        applyTipFilter('all');
      } else {
        applyTipFilter(selected);
      }
      return;
    }

    // Case B: If current filter is already 'all', no empty-area reset is needed
    if (currentCategory === 'all') {
      return;
    }

    // Case C: Check if click is on an interactive element or inside a card/section
    // Must NOT reset if clicking inside a tip card, or on any interactive element
    // (a, button, input, textarea, select, label, summary, navbar, quiz, password checker, phishing exercise, any card)
    var isInteractiveOrCard = $target.closest([
      'a', 'button', 'input', 'textarea', 'select', 'label', 'summary',
      'nav', '.navbar',
      '.tip-card', '.tip-item-col', '.card', '.threat-card',
      '.tool-container-card', '.quiz-card', '.cert-card', '.incident-step-card',
      '#quiz', '#tools', '#password-tool', '#phish-tool',
      '.filter-button-group'
    ].join(',')).length > 0;

    if (!isInteractiveOrCard) {
      // Empty non-interactive background area clicked -> Reset to 'All'
      applyTipFilter('all');
    }
  });
});
