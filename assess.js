//Demo2.js

document.addEventListener('DOMContentLoaded', function() {
  // --- DOM Elements ---
  const steps = document.querySelectorAll('.step');
  const btnStart = document.getElementById('btn-start');
  const btnConsentNext = document.getElementById('btn-consent-next');
  const consentCheckbox = document.getElementById('consent-checkbox');
  const assessmentForm = document.getElementById('mental-health-form');
  const btnShowResources = document.getElementById('btn-show-resources');
  const btnFinish = document.getElementById('btn-finish');
  const progressIndicator = document.getElementById('progress-indicator');
  const questionGroups = assessmentForm.querySelectorAll('.question-group');

  // Result display elements
  const scoreD = document.getElementById('score-d');
  const levelD = document.getElementById('level-d');
  const scoreA = document.getElementById('score-a');
  const levelA = document.getElementById('level-a');
  const scoreS = document.getElementById('score-s');
  const levelS = document.getElementById('level-s');

  const totalQuestions = questionGroups.length; // Should be 21
  let currentQuestionIndex = 0;

    const linkPsychologist = document.getElementById('link-psychologist');
    if (linkPsychologist) {
      linkPsychologist.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'Demo3.html'; // เปลี่ยนหน้าไปยัง Demo3.html
      });
    }
    

  // --- Helper Functions ---
  function showStep(stepIdToShow) {
      steps.forEach(step => {
          step.classList.toggle('active', step.id === stepIdToShow);
          step.classList.toggle('hidden', step.id !== stepIdToShow);
      });
      // Scroll to top of container
      document.querySelector('.assessment-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showQuestion(index) {
      questionGroups.forEach((group, i) => {
          group.classList.toggle('active', i === index);
          group.classList.toggle('hidden', i !== index);
      });
      // Update progress indicator
      if (progressIndicator) {
          progressIndicator.textContent = `คำถาม ${index + 1} / ${totalQuestions}`;
      }
      currentQuestionIndex = index;
  }

  function getSelectedValue(questionIndex) {
       const group = questionGroups[questionIndex];
       const radioName = `q${questionIndex + 1}`; // q1, q2, ...
       const selectedRadio = group.querySelector(`input[name="${radioName}"]:checked`);
       return selectedRadio ? parseInt(selectedRadio.value) : null; // Return null if not answered
  }

  // --- DASS-21 Scoring Functions ---
  function calculateDASS21Scores() {
      let scores = { d: 0, a: 0, s: 0 };
      let allAnswered = true;

      questionGroups.forEach((group, index) => {
          const scale = group.getAttribute('data-scale'); // 'd', 'a', or 's'
          const value = getSelectedValue(index);

          if (value === null) {
              allAnswered = false;
              console.error(`Question ${index + 1} not answered.`); // Log error
              return; // Skip this question score calculation
          }

          if (scale && scores.hasOwnProperty(scale)) {
              scores[scale] += value;
          }
      });

       if (!allAnswered) {
           alert('กรุณาตอบคำถามให้ครบทุกข้อก่อนส่ง');
           return null; // Indicate scoring failed due to missing answers
       }

      // Multiply scores by 2 as per DASS-21 standard for comparison with norms
      scores.d *= 2;
      scores.a *= 2;
      scores.s *= 2;

      return scores;
  }

  function getDASSCategory(scale, score) {
      const levels = {
          d: [{limit: 9, label: "ปกติ"}, {limit: 13, label: "น้อย"}, {limit: 20, label: "ปานกลาง"}, {limit: 27, label: "รุนแรง"}, {limit: Infinity, label: "รุนแรงมากที่สุด"}],
          a: [{limit: 7, label: "ปกติ"}, {limit: 9, label: "น้อย"}, {limit: 14, label: "ปานกลาง"}, {limit: 19, label: "รุนแรง"}, {limit: Infinity, label: "รุนแรงมากที่สุด"}],
          s: [{limit: 14, label: "ปกติ"}, {limit: 18, label: "น้อย"}, {limit: 25, label: "ปานกลาง"}, {limit: 33, label: "รุนแรง"}, {limit: Infinity, label: "รุนแรงมากที่สุด"}],
      };

      for (const level of levels[scale]) {
          if (score <= level.limit) {
              return level.label;
          }
      }
      return "ไม่สามารถระบุได้"; // Fallback
  }

  // --- Event Listeners ---
  if (btnStart) {
      btnStart.addEventListener('click', () => showStep('step-consent'));
  }

  if (consentCheckbox) {
      consentCheckbox.addEventListener('change', () => {
          btnConsentNext.disabled = !consentCheckbox.checked;
      });
  }

  if (btnConsentNext) {
      btnConsentNext.addEventListener('click', () => {
          if (consentCheckbox.checked) {
              showStep('step-assessment');
              showQuestion(0); // Show the first question
          }
      });
  }

  // Assessment Form Navigation & Submission
  assessmentForm.addEventListener('click', function(event) {
      const target = event.target;

      // Check if clicked inside a nav-buttons container
      if (!target.closest('.nav-buttons')) return;


      if (target.classList.contains('btn-next-question')) {
          // Validate current question before proceeding
          if (getSelectedValue(currentQuestionIndex) === null) {
               alert('กรุณาเลือกคำตอบ');
               return;
          }
          if (currentQuestionIndex < totalQuestions - 1) {
              showQuestion(currentQuestionIndex + 1);
          }
      } else if (target.classList.contains('btn-prev-question')) {
          if (currentQuestionIndex > 0) {
              showQuestion(currentQuestionIndex - 1);
          }
      } else if (target.classList.contains('btn-submit-assessment')) {
           // Validate last question
           if (getSelectedValue(currentQuestionIndex) === null) {
               alert('กรุณาเลือกคำตอบข้อสุดท้าย');
               return;
           }

          showStep('step-processing'); // Show processing step

          // Simulate processing delay & calculate scores
          setTimeout(() => {
              const finalScores = calculateDASS21Scores();

              if (finalScores === null) {
                   // Handle case where not all questions were answered (alert shown in calculate function)
                   showStep('step-assessment'); // Go back to assessment
                   showQuestion(currentQuestionIndex); // Show the problematic question again
                   return;
              }

              // Display scores and levels
              scoreD.textContent = finalScores.d;
              levelD.textContent = getDASSCategory('d', finalScores.d);
              scoreA.textContent = finalScores.a;
              levelA.textContent = getDASSCategory('a', finalScores.a);
              scoreS.textContent = finalScores.s;
              levelS.textContent = getDASSCategory('s', finalScores.s);

              showStep('step-results'); // Show results step
          }, 1000); // Simulate 1 second processing time
      }
  });

  if (btnShowResources) {
      btnShowResources.addEventListener('click', () => showStep('step-resources'));
  }

  if (btnFinish) {
      btnFinish.addEventListener('click', () => {
          // Reset state and go back to welcome screen
          assessmentForm.reset();
          consentCheckbox.checked = false;
          btnConsentNext.disabled = true;
          currentQuestionIndex = 0; // Reset question index
           // Clear results (optional)
           scoreD.textContent = '-'; levelD.textContent = '-';
           scoreA.textContent = '-'; levelA.textContent = '-';
           scoreS.textContent = '-'; levelS.textContent = '-';

          showStep('step-welcome');
          console.log('Assessment finished and reset.');
      });
  }

  // --- Initial Setup ---
  if (totalQuestions > 0) { // Ensure questions exist before showing
       showStep('step-welcome');
  } else {
       console.error("No question groups found in the form.");
       // Handle error state, maybe show an error message step
  }


});

// --- Chatbot popup logic ---
const chatbotLink = document.getElementById("chatbot-link");
const popup = document.getElementById("chatbot-popup");
const overlay = document.getElementById("popup-overlay");
const btnConfirm = document.getElementById("confirm-chatbot");
const btnCancel = document.getElementById("cancel-chatbot");

if (chatbotLink && popup && overlay) {
  chatbotLink.addEventListener("click", function (e) {
    e.preventDefault(); // หยุดการลิงก์ออกไปก่อน
    popup.classList.remove("hidden");
    overlay.classList.remove("hidden");
  });

  btnConfirm.addEventListener("click", function () {
    window.open(chatbotLink.href, "_blank");
    popup.classList.add("hidden");
    overlay.classList.add("hidden");
  });

  btnCancel.addEventListener("click", function () {
    popup.classList.add("hidden");
    overlay.classList.add("hidden");
  });
}
