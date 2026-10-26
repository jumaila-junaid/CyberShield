/**
 * CyberShield — Cybersecurity Awareness Website
 * quiz.js
 * 
 * Responsibilities:
 * - 10 scenario-based multiple-choice cyber safety questions
 * - Step-by-step question progression and live progress indicator
 * - Immediate correct/incorrect feedback with concise explanations
 * - Single-answer enforcement per question
 * - Final score calculation and tailored security evaluation message
 * - Best score persistence strictly using numeric value in localStorage
 * - Defensive try/catch wrapping around localStorage to support private/restricted browsing
 * - Full quiz reset upon retry
 */

$(function () {
  'use strict';

  // Exactly 10 comprehensive cybersecurity awareness questions
  var quizQuestions = [
    {
      topic: 'Phishing',
      question: 'You receive an SMS claiming your delivery package is on hold and instructing you to click an unfamiliar link to pay Rs. 350. What is the safest response?',
      options: [
        'Click the link immediately to prevent the package from being returned',
        'Reply to the SMS with your card number and PIN',
        'Ignore the link and check the tracking status directly on the official courier website or app',
        'Forward the link to all your contacts to see if anyone else received it'
      ],
      correctIndex: 2,
      explanation: 'Unsolicited parcel delivery SMS messages are common phishing scams. Never click links in random messages; always look up the verified courier portal independently.'
    },
    {
      topic: 'Password Safety',
      question: 'Which of the following approaches creates the strongest protection against automated password-cracking attacks?',
      options: [
        'A short word with numbers like "Colombo2024!"',
        'Common word replacements like "P@$$w0rd"',
        'A long passphrase of 4+ unrelated words like "mango-elephant-river-sunset"',
        'A simple sequence of 12 digits like "123456789012"'
      ],
      correctIndex: 2,
      explanation: 'Length is the single most important factor against brute-force attacks. Multi-word passphrases (15+ characters) are computationally infeasible to crack and easy to remember.'
    },
    {
      topic: 'Multi-Factor Authentication',
      question: 'Why is Multi-Factor Authentication (MFA) essential even if you already use a complex, unique password?',
      options: [
        'It speeds up the login process automatically',
        'If an attacker steals your password in a data breach, they still cannot log in without the second factor',
        'It guarantees your computer will never get infected with malware',
        'It eliminates the need to remember any password ever again'
      ],
      correctIndex: 1,
      explanation: 'Passwords can leak via third-party database breaches or credential-stuffing. MFA ensures that a stolen password alone is insufficient to compromise your account.'
    },
    {
      topic: 'Public Wi-Fi',
      question: 'You are at a cafe or public transit station and need to access your online banking. Which option is the safest?',
      options: [
        'Connect to the free open Wi-Fi network named "Public_Free_WiFi"',
        'Use your personal smartphone mobile data (cellular connection) or a trusted VPN',
        'Use any open Wi-Fi network as long as your phone battery is above 50%',
        'Ask a stranger to look at your balance on their device'
      ],
      correctIndex: 1,
      explanation: 'Open public Wi-Fi networks lack encryption and can be spoofed by attackers nearby. Using cellular data or a reputable encrypted VPN protects your session from interception.'
    },
    {
      topic: 'Online Scams',
      question: 'A contact on Telegram offers you Rs. 8,000 per day for liking videos, but demands an upfront registration deposit of Rs. 3,000. What should you do?',
      options: [
        'Transfer the money immediately to start earning high daily profits',
        'Send half the amount to test if the recruiter is legitimate',
        'Block and report the account — legitimate employers never demand upfront payment to work',
        'Share your bank card CVV so they can deduct the deposit automatically'
      ],
      correctIndex: 2,
      explanation: 'This is a classic "task scam" or advance-fee fraud. Legitimate organizations pay you for work; they never require you to send deposits or recharge fees to withdraw profits.'
    },
    {
      topic: 'Software Updates',
      question: 'Why should you install system and browser updates as soon as they are released?',
      options: [
        'Updates only modify desktop icons and background themes',
        'Updates regularly patch critical security vulnerabilities that attackers actively exploit',
        'Software updates are intended only to slow down older hardware',
        'Updates are optional and only necessary once every few years'
      ],
      correctIndex: 1,
      explanation: 'Software updates contain critical security patches that close known backdoors and exploits. Postponing updates leaves devices vulnerable to automated malware attacks.'
    },
    {
      topic: 'Privacy & Permissions',
      question: 'A simple calculator app installed from an unknown source requests access to your Microphone, Contacts, and Location. What is the safest step?',
      options: [
        'Grant all permissions because modern apps require complete device access',
        'Deny the unnecessary permissions and uninstall the suspicious app immediately',
        'Grant permissions only when using the calculator during the day',
        'Turn your screen brightness down while calculating'
      ],
      correctIndex: 1,
      explanation: 'A calculator has no valid technical reason to record audio, read contacts, or track GPS location. Excessive permission requests are a major indicator of spyware.'
    },
    {
      topic: 'OTP Protection',
      question: 'A caller claiming to represent your bank states your account has a security alert and requests the 6-digit SMS OTP just sent to your phone. How should you respond?',
      options: [
        'Read the OTP immediately to prevent your account from being frozen',
        'Share only the first three digits of the OTP code',
        'Hang up immediately — banks will NEVER ask for your One-Time Password',
        'Ask the caller to call your family member instead'
      ],
      correctIndex: 2,
      explanation: 'One-Time Passwords (OTPs) authorize financial transactions and password resets. Real banks and telecom providers explicitly program staff never to ask for your OTP.'
    },
    {
      topic: 'Fake Giveaways & Prizes',
      question: 'You receive a WhatsApp message stating you won an international lottery or smartphone in a contest you never entered. What is this?',
      options: [
        'A genuine lucky giveaway requiring a small processing fee',
        'A scam designed to steal your money, identity documents, or payment details',
        'A government grant that should be claimed immediately',
        'A message that must be forwarded to 10 friends to qualify'
      ],
      correctIndex: 1,
      explanation: 'You cannot win a competition or lottery you never entered. Scammers use fake prize notifications to extort advance fees and harvest identity documents.'
    },
    {
      topic: 'Incident Response',
      question: 'If you realize you entered your card details and OTP on a fake lookalike website, what should you do FIRST?',
      options: [
        'Wait a few days to see if any unauthorized transactions appear on your statement',
        'Contact your bank immediately to freeze the card and block unauthorized transactions',
        'Restart your computer to erase the website visit history',
        'Email the fake website asking them to delete your submitted information'
      ],
      correctIndex: 1,
      explanation: 'Immediate action minimizes financial loss. Contacting your bank right away allows them to freeze compromised cards and block unauthorized fund transfers.'
    }
  ];

  // Quiz State
  var currentQuestionIndex = 0;
  var currentScore = 0;
  var answerSelected = false;

  // DOM Elements
  var $questionContainer = $('#quizQuestionContainer');
  var $resultScreen = $('#quizResultScreen');
  var $topicBadge = $('#quizTopicBadge');
  var $questionCounter = $('#quizQuestionCounter');
  var $questionTitle = $('#quizQuestionTitle');
  var $optionsList = $('#quizOptionsList');
  var $feedbackBox = $('#quizFeedbackBox');
  var $nextBtn = $('#quizNextBtn');
  var $retryBtn = $('#quizRetryBtn');
  var $progressBarFill = $('#quizProgressBarFill');
  var $bestScoreDisplay = $('#quizBestScoreVal');
  var $resultScore = $('#quizResultScore');
  var $resultBadge = $('#quizResultTierBadge');
  var $resultDesc = $('#quizResultDescription');
  var $resultBestScoreText = $('#quizResultBestScore');

  /**
   * Retrieves all-time best score safely from localStorage
   * Wrapped in try/catch to handle privacy/incognito blocks
   */
  function getStoredBestScore() {
    try {
      var stored = localStorage.getItem('cybershield_best_score');
      if (stored !== null) {
        var num = parseInt(stored, 10);
        return isNaN(num) ? 0 : num;
      }
    } catch (e) {
      // Storage access disabled or restricted in private mode
    }
    return null;
  }

  /**
   * Saves best score safely in localStorage
   * Stores strictly the numeric score, never answers or personal data
   */
  function saveBestScore(score) {
    try {
      var currentBest = getStoredBestScore() || 0;
      if (score > currentBest) {
        localStorage.setItem('cybershield_best_score', score.toString());
        return score;
      }
      return currentBest;
    } catch (e) {
      return score;
    }
  }

  /**
   * Updates the best score badge in the quiz header
   */
  function updateBestScoreUI() {
    var best = getStoredBestScore();
    if (best !== null) {
      $bestScoreDisplay.text('Best: ' + best + ' / 10');
    } else {
      $bestScoreDisplay.text('Best: —');
    }
  }

  /**
   * Renders the current question and option buttons
   */
  function renderQuestion() {
    answerSelected = false;
    $feedbackBox.hide().empty().removeClass('feedback-correct feedback-wrong');
    $nextBtn.hide();

    var q = quizQuestions[currentQuestionIndex];
    var questionNum = currentQuestionIndex + 1;
    var totalQuestions = quizQuestions.length;

    // Update headers and progress
    $topicBadge.text(q.topic);
    $questionCounter.text('Question ' + questionNum + ' of ' + totalQuestions);
    $questionTitle.text(q.question);

    var progressPercent = Math.round(((questionNum - 1) / totalQuestions) * 100);
    $progressBarFill.css('width', progressPercent + '%');

    // Build option buttons
    $optionsList.empty();
    var optionLetters = ['A', 'B', 'C', 'D'];

    $.each(q.options, function (idx, optionText) {
      var $optBtn = $('<button>')
        .addClass('quiz-option-btn')
        .attr('type', 'button')
        .attr('data-index', idx)
        .html(
          '<span class="quiz-option-badge">' + optionLetters[idx] + '</span>' +
          '<span class="quiz-option-text flex-grow-1">' + optionText + '</span>'
        );

      $optionsList.append($optBtn);
    });
  }

  /**
   * Handles user selecting an answer choice
   */
  $optionsList.on('click', '.quiz-option-btn', function () {
    if (answerSelected) return; // Prevent multiple clicks on the same question

    answerSelected = true;
    var selectedIndex = parseInt($(this).attr('data-index'), 10);
    var q = quizQuestions[currentQuestionIndex];
    var isCorrect = selectedIndex === q.correctIndex;

    // Disable all options to prevent subsequent clicks
    $('.quiz-option-btn').prop('disabled', true);

    if (isCorrect) {
      currentScore++;
      $(this).addClass('correct-choice');
      $feedbackBox
        .addClass('feedback-correct')
        .html('<strong><i class="bi bi-check-circle-fill"></i> Correct!</strong> ' + q.explanation)
        .slideDown(250);
    } else {
      $(this).addClass('wrong-choice');
      // Highlight the correct option as well so the user learns
      $('.quiz-option-btn[data-index="' + q.correctIndex + '"]').addClass('correct-choice');
      $feedbackBox
        .addClass('feedback-wrong')
        .html('<strong><i class="bi bi-x-circle-fill"></i> Not quite right.</strong> ' + q.explanation)
        .slideDown(250);
    }

    // Show Next button
    if (currentQuestionIndex < quizQuestions.length - 1) {
      $nextBtn.html('Next Question <i class="bi bi-arrow-right"></i>').fadeIn(200);
    } else {
      $nextBtn.html('See Final Results <i class="bi bi-trophy-fill"></i>').fadeIn(200);
    }
  });

  /**
   * Next Question button click handler
   */
  $nextBtn.on('click', function () {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      renderQuestion();
    } else {
      showFinalResults();
    }
  });

  /**
   * Displays the final quiz score screen
   */
  function showFinalResults() {
    $progressBarFill.css('width', '100%');
    $questionContainer.hide();
    $resultScreen.fadeIn(350);

    var total = quizQuestions.length;
    var percentage = Math.round((currentScore / total) * 100);
    var savedBest = saveBestScore(currentScore);

    $resultScore.text(currentScore + ' / ' + total);

    // Evaluate tier and encouraging message
    if (currentScore >= 9) {
      $resultBadge
        .attr('class', 'result-tier-badge bg-success text-white')
        .html('<i class="bi bi-shield-fill-check"></i> Cyber Champion (Grade: A+)');
      $resultDesc.text(
        'Outstanding instincts! You have a firm grasp of phishing warning signs, authentication best practices, and emergency response. You are well-equipped to keep yourself and others secure online.'
      );
    } else if (currentScore >= 7) {
      $resultBadge
        .attr('class', 'result-tier-badge bg-primary text-white')
        .html('<i class="bi bi-shield-check"></i> Cyber Aware (Grade: B)');
      $resultDesc.text(
        'Great job! You have a solid cybersecurity foundation. Review the few questions you missed in our Threat Guides and Safety Tips to eliminate remaining blind spots.'
      );
    } else if (currentScore >= 5) {
      $resultBadge
        .attr('class', 'result-tier-badge bg-warning text-dark')
        .html('<i class="bi bi-shield-exclamation"></i> Building Awareness (Grade: C)');
      $resultDesc.text(
        'You understand several cybersecurity basics, but sophisticated social engineering or fake delivery messages could still deceive you. Take a few minutes to explore the Safety Tips section!'
      );
    } else {
      $resultBadge
        .attr('class', 'result-tier-badge bg-danger text-white')
        .html('<i class="bi bi-exclamation-triangle-fill"></i> Needs Practice (Grade: D)');
      $resultDesc.text(
        'Cybersecurity is an ongoing learning curve! Modern online scams are tricky. Review the 6 Threat Cards and 12 Safety Tips, then give the quiz another shot.'
      );
    }

    $resultBestScoreText.text('All-Time Personal Best: ' + savedBest + ' / ' + total);
    updateBestScoreUI();
  }

  /**
   * Full reset of the quiz state
   */
  function resetQuiz() {
    currentQuestionIndex = 0;
    currentScore = 0;
    answerSelected = false;

    $resultScreen.hide();
    $questionContainer.fadeIn(300);

    updateBestScoreUI();
    renderQuestion();
  }

  $retryBtn.on('click', function () {
    resetQuiz();
  });

  // Initialize Quiz
  updateBestScoreUI();
  renderQuestion();
});
