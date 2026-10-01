/**
 * AURA AI VOICE AGENT - FIGMA READY CONTROLLER (HTML / CSS / JS ONLY)
 * Handles screen switching, multi-frame grid mode, and interactive voice simulation
 */

(function () {
  'use strict';

  // --- DOM Elements ---
  const screenTabs = document.querySelectorAll('.screen-tab-btn');
  const screenArtboards = {
    'screen-voice': document.getElementById('screen-voice'),
    'screen-transcription': document.getElementById('screen-transcription'),
    'screen-dashboard': document.getElementById('screen-dashboard'),
  };
  const artboardLabels = {
    'screen-voice': document.getElementById('label-screen-1'),
    'screen-transcription': document.getElementById('label-screen-2'),
    'screen-dashboard': document.getElementById('label-screen-3'),
  };

  const navItemLinks = document.querySelectorAll('.nav-item-link');
  const btnToggleFigmaGrid = document.getElementById('btn-toggle-figma-grid');
  const screensWrapper = document.getElementById('screens-wrapper');

  // Interactive Voice Elements
  const interactiveMicBtn = document.getElementById('interactive-mic-btn');
  const voiceScreenStatusPill = document.getElementById('voice-screen-status-pill');
  const voicePillText = document.getElementById('voice-pill-text');
  const voiceMainPrompt = document.getElementById('voice-main-prompt');
  const voiceSubPrompt = document.getElementById('voice-sub-prompt');
  const vectorWaveBars = document.querySelectorAll('.vector-wave-bar');

  // Confirmation Modal Elements
  const interactiveConfirmationModal = document.getElementById('interactive-confirmation-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const btnConfirmModal = document.getElementById('btn-confirm-modal');

  let currentScreenId = 'screen-voice';
  let isMultiFrameMode = false;
  let isListening = false;
  let waveAnimTimer = null;

  // --- Screen Switching Logic ---
  function showScreen(screenId) {
    currentScreenId = screenId;

    // If currently in multi-frame mode, exit it to view individual screen
    if (isMultiFrameMode) {
      exitMultiFrameMode();
    }

    // Update top workspace controller tabs
    screenTabs.forEach((tab) => {
      if (tab.dataset.target === screenId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update screens visibility
    Object.keys(screenArtboards).forEach((key) => {
      const artboard = screenArtboards[key];
      const label = artboardLabels[key];
      if (key === screenId) {
        artboard.classList.remove('hidden');
        if (label) label.style.display = 'none';
      } else {
        artboard.classList.add('hidden');
        if (label) label.style.display = 'none';
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Figma Multi-Frame Grid View Toggle ---
  function toggleMultiFrameMode() {
    isMultiFrameMode = !isMultiFrameMode;

    if (isMultiFrameMode) {
      document.body.classList.add('multi-frame-mode');
      btnToggleFigmaGrid.style.background = 'linear-gradient(135deg, var(--cyan-primary), var(--violet-primary))';
      btnToggleFigmaGrid.style.color = '#080a11';
      btnToggleFigmaGrid.style.borderColor = 'transparent';

      // Show all 3 screens and their Figma header labels
      Object.keys(screenArtboards).forEach((key) => {
        screenArtboards[key].classList.remove('hidden');
        if (artboardLabels[key]) {
          artboardLabels[key].style.display = 'flex';
        }
      });
    } else {
      exitMultiFrameMode();
      showScreen(currentScreenId);
    }
  }

  function exitMultiFrameMode() {
    isMultiFrameMode = false;
    document.body.classList.remove('multi-frame-mode');
    btnToggleFigmaGrid.style.background = '';
    btnToggleFigmaGrid.style.color = '';
    btnToggleFigmaGrid.style.borderColor = '';

    Object.keys(artboardLabels).forEach((key) => {
      if (artboardLabels[key]) {
        artboardLabels[key].style.display = 'none';
      }
    });
  }

  // --- Voice Waveform Animation & Mic Toggle ---
  function toggleVoiceInput() {
    isListening = !isListening;

    if (isListening) {
      // Listening State
      voiceScreenStatusPill.style.background = 'rgba(0, 242, 254, 0.18)';
      voiceScreenStatusPill.style.borderColor = 'var(--cyan-primary)';
      voicePillText.textContent = 'Listening to your request...';
      voiceMainPrompt.textContent = 'Click again to stop';
      voiceSubPrompt.textContent = 'Streaming live acoustic input to Books Management & System Router';
      interactiveMicBtn.style.boxShadow = '0 0 45px rgba(0, 242, 254, 0.8)';
      interactiveMicBtn.style.transform = 'scale(1.06)';

      startWaveformAnimation();

      // Automatically simulate confirmation after 2.6s
      setTimeout(() => {
        if (isListening) {
          toggleVoiceInput();
          interactiveConfirmationModal.classList.remove('hidden');
        }
      }, 2600);
    } else {
      // Idle State
      voiceScreenStatusPill.style.background = '';
      voiceScreenStatusPill.style.borderColor = '';
      voicePillText.textContent = 'Agent Ready • Click to speak';
      voiceMainPrompt.textContent = 'Click to speak';
      voiceSubPrompt.textContent = 'Click the microphone or press [Space] to begin speaking with the agent';
      interactiveMicBtn.style.boxShadow = '';
      interactiveMicBtn.style.transform = '';

      stopWaveformAnimation();
    }
  }

  function startWaveformAnimation() {
    clearInterval(waveAnimTimer);
    waveAnimTimer = setInterval(() => {
      vectorWaveBars.forEach((bar, index) => {
        // Organic sinusoidal voice wave bounce
        const randomHeight = Math.floor(12 + Math.abs(Math.sin(Date.now() / 150 + index * 0.35)) * 96);
        bar.style.height = `${randomHeight}px`;
      });
    }, 100);
  }

  function stopWaveformAnimation() {
    clearInterval(waveAnimTimer);
    // Reset to pleasant bell-curve resting state
    const restingHeights = [
      14, 22, 38, 52, 34, 18, 26, 64, 82, 48, 28, 42, 76, 94, 68, 36, 58, 88, 104, 72, 46, 62, 96, 110,
      110, 96, 62, 46, 72, 104, 88, 58, 36, 68, 94, 76, 42, 28, 48, 82, 64, 26, 18, 34, 52, 38, 22, 14
    ];
    vectorWaveBars.forEach((bar, index) => {
      bar.style.height = `${restingHeights[index % restingHeights.length]}px`;
    });
  }

  // --- Attach Event Listeners ---
  function initEvents() {
    // Top workspace tabs
    screenTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        showScreen(tab.dataset.target);
      });
    });

    // In-screen navbar links (allow navigation directly inside desktop frame)
    navItemLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetScreenId = link.getAttribute('data-switch');
        if (targetScreenId) {
          showScreen(targetScreenId);
        }
      });
    });

    // Multi-frame toggle button
    if (btnToggleFigmaGrid) {
      btnToggleFigmaGrid.addEventListener('click', toggleMultiFrameMode);
    }

    // Microphone click
    if (interactiveMicBtn) {
      interactiveMicBtn.addEventListener('click', toggleVoiceInput);
    }

    // Modal buttons
    if (btnCancelModal) {
      btnCancelModal.addEventListener('click', () => {
        interactiveConfirmationModal.classList.add('hidden');
      });
    }

    if (btnConfirmModal) {
      btnConfirmModal.addEventListener('click', () => {
        interactiveConfirmationModal.classList.add('hidden');
        // Jump to Dashboard to show the newly added task!
        showScreen('screen-dashboard');
      });
    }

    // Filter pills in Dashboard
    const filterPills = document.querySelectorAll('.filter-btn-pill');
    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;

      if (e.key === '1') {
        showScreen('screen-voice');
      } else if (e.key === '2') {
        showScreen('screen-transcription');
      } else if (e.key === '3') {
        showScreen('screen-dashboard');
      } else if (e.key === 'f' || e.key === 'F') {
        toggleMultiFrameMode();
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (currentScreenId === 'screen-voice') {
          toggleVoiceInput();
        }
      } else if (e.key === 'Escape') {
        interactiveConfirmationModal.classList.add('hidden');
      }
    });
  }

  // --- Initial Setup ---
  function init() {
    initEvents();

    // Check URL parameters for direct deep-linking or Figma multi-frame import
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || urlParams.get('view');
    const screen = urlParams.get('screen');

    if (mode === 'figma' || mode === 'all' || mode === 'grid') {
      toggleMultiFrameMode();
    } else if (screen === '2' || screen === 'transcription') {
      showScreen('screen-transcription');
    } else if (screen === '3' || screen === 'dashboard') {
      showScreen('screen-dashboard');
    } else {
      showScreen('screen-voice');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
