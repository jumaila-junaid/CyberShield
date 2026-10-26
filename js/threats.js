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
  // 2. Safety Tips Category Filtering
  // ==========================================================================
  var $filterBtns = $('.filter-btn');
  var $tipCards = $('.tip-item-col');

  $filterBtns.on('click', function (e) {
    e.preventDefault();

    var $activeBtn = $(this);
    var selectedCategory = $activeBtn.data('filter');

    // Update active visual and accessibility states on filter buttons
    $filterBtns.removeClass('active').attr('aria-pressed', 'false');
    $activeBtn.addClass('active').attr('aria-pressed', 'true');

    // Filter tip cards using jQuery fadeOut() and fadeIn()
    if (selectedCategory === 'all') {
      // Fade in all cards
      $tipCards.each(function () {
        var $card = $(this);
        if ($card.is(':hidden')) {
          $card.fadeIn(300);
        }
      });
    } else {
      // First fade out cards that do not match
      $tipCards.each(function () {
        var $card = $(this);
        var cardCategory = $card.find('.tip-card').data('category');

        if (cardCategory === selectedCategory) {
          $card.fadeIn(300);
        } else {
          $card.fadeOut(250);
        }
      });
    }
  });
});
