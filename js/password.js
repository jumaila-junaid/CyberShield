/**
 * CyberShield — Cybersecurity Awareness Website
 * password.js
 * 
 * Responsibilities:
 * - Real-time password evaluation strictly within local client browser memory
 * - Show/Hide password toggle
 * - Password strength calculation & dynamic meter update
 * - Multi-criteria checklist evaluation (length, uppercase, lowercase, number, symbol, common list)
 * - Reset and auto-clear functionality for privacy
 * 
 * STRICT PRIVACY SAFEGUARDS:
 * - No network requests or transmission
 * - No console logging of password values
 * - No localStorage, sessionStorage, or cookie storage
 * - Clears on reset and on window blur / tab hidden events
 */

$(function () {
  'use strict';

  // Small demonstration list of notoriously common, compromised passwords
  // Clearly documented as an illustrative demo list, not an exhaustive registry
  var commonPasswordsDemo = [
    'password',
    'password123',
    '123456',
    '12345678',
    '123456789',
    '12345',
    'admin',
    'admin123',
    'qwerty',
    'letmein',
    'welcome',
    'iloveyou',
    'pass1234',
    'srilanka',
    'srilanka123',
    'colombo',
    'colombo123',
    'monkey',
    'dragon',
    'football',
    'master',
    'sunshine',
    'princess',
    'trustno1'
  ];

  // DOM Elements
  var $passwordInput = $('#passwordInput');
  var $toggleVisibilityBtn = $('#togglePasswordVisibility');
  var $toggleIcon = $('#togglePasswordIcon');
  var $strengthBar = $('#strengthMeterBar');
  var $strengthLabel = $('#strengthMeterLabel');
  var $strengthScoreText = $('#strengthScoreText');
  var $resetPasswordBtn = $('#resetPasswordBtn');

  // Checklist DOM elements
  var $checkLength = $('#pwCheckLength');
  var $checkUpper = $('#pwCheckUpper');
  var $checkLower = $('#pwCheckLower');
  var $checkNumber = $('#pwCheckNumber');
  var $checkSymbol = $('#pwCheckSymbol');
  var $checkCommon = $('#pwCheckCommon');

  /**
   * Updates an individual checklist item's UI
   * @param {jQuery} $item - The checklist li element
   * @param {boolean} isValid - Whether requirement is met
   * @param {boolean} isCompromised - Special case for common password flag
   */
  function updateChecklistItem($item, isValid, isCompromised) {
    var $icon = $item.find('i');

    $item.removeClass('valid invalid compromised');

    if (isCompromised) {
      $item.addClass('compromised');
      $icon.attr('class', 'bi bi-exclamation-triangle-fill');
      $item.find('.pw-check-text').text('Appears in common password demonstration list');
      return;
    }

    if (isValid) {
      $item.addClass('valid');
      $icon.attr('class', 'bi bi-check-circle-fill');
    } else {
      $item.addClass('invalid');
      $icon.attr('class', 'bi bi-circle');
    }

    // Reset default text if not compromised
    if ($item.attr('id') === 'pwCheckCommon') {
      $item.find('.pw-check-text').text('Not on common password demonstration list');
    }
  }

  /**
   * Evaluates the password strength and updates the live UI
   */
  function evaluatePassword() {
    var val = $passwordInput.val() || '';

    if (val.length === 0) {
      // Empty input state
      $strengthBar.css({ width: '0%', backgroundColor: 'rgba(255, 255, 255, 0.1)' });
      $strengthLabel.text('Enter a password to evaluate strength');
      $strengthScoreText.text('0 / 6 Requirements');

      updateChecklistItem($checkLength, false, false);
      updateChecklistItem($checkUpper, false, false);
      updateChecklistItem($checkLower, false, false);
      updateChecklistItem($checkNumber, false, false);
      updateChecklistItem($checkSymbol, false, false);
      updateChecklistItem($checkCommon, false, false);
      return;
    }

    // Criteria checks
    var hasLength = val.length >= 12;
    var hasUpper = /[A-Z]/.test(val);
    var hasLower = /[a-z]/.test(val);
    var hasNumber = /[0-9]/.test(val);
    var hasSymbol = /[^A-Za-z0-9]/.test(val);

    // Common password check (case-insensitive)
    var isCommon = commonPasswordsDemo.indexOf(val.toLowerCase().trim()) !== -1;

    // Update checklist UI
    updateChecklistItem($checkLength, hasLength, false);
    updateChecklistItem($checkUpper, hasUpper, false);
    updateChecklistItem($checkLower, hasLower, false);
    updateChecklistItem($checkNumber, hasNumber, false);
    updateChecklistItem($checkSymbol, hasSymbol, false);
    updateChecklistItem($checkCommon, !isCommon, isCommon);

        // Count the 5 basic requirements (used for the strength levels below)
    var requirementsMet = 0;
    if (hasLength) requirementsMet++;
    if (hasUpper) requirementsMet++;
    if (hasLower) requirementsMet++;
    if (hasNumber) requirementsMet++;
    if (hasSymbol) requirementsMet++;

    // The 6th checklist item (not a common password) also counts for the display
    var totalMet = requirementsMet + (isCommon ? 0 : 1);
    $strengthScoreText.text(totalMet + ' / 6 Requirements Met');

    // Determine strength tier
    if (isCommon) {
      // Immediate demotion if password is known to be in common list
      $strengthBar.css({ width: '15%', backgroundColor: '#FF4D6D' });
      $strengthLabel.html('<span class="text-danger fw-bold"><i class="bi bi-x-octagon"></i> Insecure — Highly Common Password</span>');
      return;
    }

    if (val.length < 8) {
      $strengthBar.css({ width: '20%', backgroundColor: '#FF4D6D' });
      $strengthLabel.html('<span class="text-danger fw-bold"><i class="bi bi-exclamation-triangle"></i> Very Weak — Much too short</span>');
    } else if (requirementsMet <= 2) {
      $strengthBar.css({ width: '40%', backgroundColor: '#FF9F1C' });
      $strengthLabel.html('<span class="text-warning fw-bold"><i class="bi bi-shield-exclamation"></i> Weak — Needs more character variety</span>');
    } else if (requirementsMet === 3 || requirementsMet === 4) {
      $strengthBar.css({ width: '65%', backgroundColor: '#F59E0B' });
      $strengthLabel.html('<span style="color: #FBBF24;" class="fw-bold"><i class="bi bi-shield-check"></i> Moderate — Getting better, aim for 12+ chars</span>');
    } else if (requirementsMet === 5 && val.length < 16) {
      $strengthBar.css({ width: '85%', backgroundColor: '#2F80FF' });
      $strengthLabel.html('<span class="text-primary-blue fw-bold"><i class="bi bi-shield-lock-fill"></i> Strong — Meets all 6 core guidelines</span>');
    } else if (requirementsMet === 6 && val.length >= 16) {
      $strengthBar.css({ width: '100%', backgroundColor: '#22C55E' });
      $strengthLabel.html('<span class="text-success fw-bold"><i class="bi bi-shield-fill-check"></i> Very Strong — Excellent passphrase length & complexity!</span>');
    }
  }

  // Live input listener
  $passwordInput.on('input', evaluatePassword);

  // Show/Hide Password Toggle
  $toggleVisibilityBtn.on('click', function () {
    var currentType = $passwordInput.attr('type');

    if (currentType === 'password') {
      $passwordInput.attr('type', 'text');
      $toggleIcon.removeClass('bi-eye').addClass('bi-eye-slash');
      $toggleVisibilityBtn.attr('aria-label', 'Hide password');
    } else {
      $passwordInput.attr('type', 'password');
      $toggleIcon.removeClass('bi-eye-slash').addClass('bi-eye');
      $toggleVisibilityBtn.attr('aria-label', 'Show password');
    }
  });

  // Reset Tool & Clear Password
  function clearPasswordChecker() {
    $passwordInput.val('');
    $passwordInput.attr('type', 'password');
    $toggleIcon.removeClass('bi-eye-slash').addClass('bi-eye');
    $toggleVisibilityBtn.attr('aria-label', 'Show password');
    evaluatePassword();
  }

  $resetPasswordBtn.on('click', function () {
    clearPasswordChecker();
  });

  // Privacy Safeguard: Auto-clear password field when leaving tab/window or page blur
  $(window).on('blur', function () {
    if ($passwordInput.val().length > 0) {
      clearPasswordChecker();
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && $passwordInput.val().length > 0) {
      clearPasswordChecker();
    }
  });
});
