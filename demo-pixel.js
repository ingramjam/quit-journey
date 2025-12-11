/**
 * QuitJourney - Demo Version
 * Standalone gamified intake form with state management
 */

class QuitJourney {
  constructor() {
    // Initialize state object
    this.state = {
      selectedAvatar: null,
      demographics: {},
      products: [],
      progress: 0,
      answers: {}
    };

    // DOM element references
    this.elements = {
      avatarCards: document.querySelectorAll('.avatar-card'),
      productButtons: document.querySelectorAll('.product-btn'),
      continueButton: document.getElementById('continueJourney'),
      milestones: document.querySelectorAll('.milestone'),
      avatarTraveler: document.getElementById('avatarTraveler'),
      avatarIcon: document.querySelector('.avatar-icon'),
      form: document.getElementById('quitJourneyForm'),
      hiddenFields: {
        avatar: document.getElementById('avatarField'),
        demographics: document.getElementById('demographicsField'),
        products: document.getElementById('productsField'),
        answers: document.getElementById('answersField')
      }
    };

    // Initialize event listeners
    this.initEventListeners();
    
    // Initialize IntersectionObserver for milestones
    this.initIntersectionObserver();
    
    // Filter milestones based on selected products
    this.filterMilestones();
    
    console.log('✅ QuitJourney Demo initialized');
    console.log('💡 Tip: Use journey.getState() to view current state or journey.reset() to restart');
  }

  /**
   * Initialize all event listeners
   */
  initEventListeners() {
    // Avatar selection
    this.elements.avatarCards.forEach(card => {
      card.addEventListener('click', (e) => this.handleAvatarSelection(e));
    });

    // Product selection
    this.elements.productButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleProductSelection(e));
    });

    // Continue button
    this.elements.continueButton.addEventListener('click', () => {
      this.scrollToJourney();
    });

    // Milestone options
    this.elements.milestones.forEach((milestone, index) => {
      const options = milestone.querySelectorAll('.milestone-option');
      options.forEach(option => {
        option.addEventListener('click', (e) => {
          this.handleMilestoneAnswer(e, milestone, index);
        });
      });
    });

    // Form submission
    this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  /**
   * Handle avatar selection
   */
  handleAvatarSelection(event) {
    const card = event.currentTarget;
    const avatarId = card.dataset.avatarId;
    const demographics = JSON.parse(card.dataset.demographics);

    // Remove previous selection
    this.elements.avatarCards.forEach(c => c.classList.remove('selected'));

    // Add selection to clicked card
    card.classList.add('selected');

    // Update state
    this.state.selectedAvatar = avatarId;
    this.state.demographics = demographics;

    // Update avatar icon with selected avatar SVG
    const avatarImage = card.querySelector('.avatar-image');
    if (avatarImage) {
      const avatarIconImg = this.elements.avatarIcon.querySelector('img');
      if (avatarIconImg) {
        avatarIconImg.src = avatarImage.src;
      } else {
        this.elements.avatarIcon.innerHTML = `<img src="${avatarImage.src}" alt="Your Avatar" style="width: 100%; height: 100%;">`;
      }
    }

    // Auto-scroll to next section after a short delay
    setTimeout(() => {
      this.scrollToSection('backpack-selection');
    }, 500);

    console.log('🎭 Avatar selected:', this.state.selectedAvatar, demographics);
  }

  /**
   * Handle product selection (multi-select)
   */
  handleProductSelection(event) {
    const button = event.currentTarget;
    const product = button.dataset.product;

    // Toggle selection
    button.classList.toggle('selected');

    // Update state
    if (this.state.products.includes(product)) {
      // Remove product
      this.state.products = this.state.products.filter(p => p !== product);
    } else {
      // Add product
      this.state.products.push(product);
    }

    // Enable/disable continue button
    this.elements.continueButton.disabled = this.state.products.length === 0;

    // Filter milestones based on selected products
    this.filterMilestones();

    console.log('🎒 Products selected:', this.state.products);
  }

  /**
   * Filter milestones based on selected products
   */
  filterMilestones() {
    this.elements.milestones.forEach(milestone => {
      const requiredProducts = milestone.dataset.requiredProducts;
      
      // Show universal questions (empty required products)
      if (!requiredProducts || requiredProducts.trim() === '') {
        milestone.classList.remove('hidden');
        return;
      }

      // Check if any selected product matches the required products
      const requiredList = requiredProducts.split(',').map(p => p.trim());
      const hasMatch = requiredList.some(req => this.state.products.includes(req));

      if (hasMatch) {
        milestone.classList.remove('hidden');
      } else {
        milestone.classList.add('hidden');
      }
    });
  }

  /**
   * Handle milestone answer selection
   */
  handleMilestoneAnswer(event, milestone, milestoneIndex) {
    const option = event.currentTarget;
    const answer = option.dataset.answer;
    const milestoneId = milestone.dataset.milestone;

    // Remove previous selection in this milestone
    const allOptions = milestone.querySelectorAll('.milestone-option');
    allOptions.forEach(opt => opt.classList.remove('selected'));

    // Add selection to clicked option with animation
    option.classList.add('selected');
    
    // Create a confirmation popup effect
    this.showConfirmationPopup(option, milestone);

    // Store answer in state
    this.state.answers[`milestone_${milestoneId}`] = answer;

    // Update progress
    this.state.progress = milestoneIndex + 1;

    console.log('📍 Milestone answered:', { milestone: milestoneId, answer });

    // Check if this is the last visible milestone
    const visibleMilestones = Array.from(this.elements.milestones).filter(
      m => !m.classList.contains('hidden')
    );
    const isLastMilestone = milestone === visibleMilestones[visibleMilestones.length - 1];

    if (isLastMilestone) {
      // Auto-scroll to destination after answering last question
      setTimeout(() => {
        this.scrollToSection('destination');
      }, 1200);
    }
  }

  /**
   * Show confirmation popup when an option is selected
   */
  showConfirmationPopup(option, milestone) {
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'confirmation-popup';
    popup.innerHTML = '✓ Got it!';
    
    // Position it relative to the milestone card
    const card = milestone.querySelector('.milestone-card');
    card.style.position = 'relative';
    card.appendChild(popup);

    // Add animation class
    setTimeout(() => popup.classList.add('show'), 10);

    // Remove after animation
    setTimeout(() => {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 300);
    }, 1500);
  }

  /**
   * Initialize IntersectionObserver for milestone animations
   */
  initIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Add appropriate animation based on position
          const card = entry.target.querySelector('.milestone-card');
          if (card) {
            if (card.classList.contains('milestone-left')) {
              card.classList.add('slide-in-left');
            } else {
              card.classList.add('slide-in-right');
            }
          }
        }
      });
    }, observerOptions);

    // Observe all milestones
    this.elements.milestones.forEach(milestone => {
      observer.observe(milestone);
    });

    // Observer for avatar movement effect
    this.initAvatarScrollEffect();
  }

  /**
   * Initialize avatar scroll effect
   * The avatar "walks" down as the user scrolls
   */
  initAvatarScrollEffect() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateAvatarPosition();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Update avatar position based on scroll
   */
  updateAvatarPosition() {
    const journeySection = document.getElementById('journey-timeline');
    if (!journeySection) return;

    const rect = journeySection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if we're in the journey section
    if (rect.top < windowHeight && rect.bottom > 0) {
      // Calculate progress through the journey section
      const sectionProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - windowHeight)));
      
      // Add slight rotation for walking effect
      const rotation = Math.sin(sectionProgress * 50) * 5;
      this.elements.avatarTraveler.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      
      // Make avatar visible
      this.elements.avatarTraveler.style.opacity = '1';
    } else {
      // Hide avatar when not in journey section
      if (rect.bottom < 0) {
        this.elements.avatarTraveler.style.opacity = '0.3';
      } else {
        this.elements.avatarTraveler.style.opacity = '0';
      }
    }
  }

  /**
   * Scroll to a specific section
   */
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Scroll to journey timeline
   */
  scrollToJourney() {
    this.scrollToSection('journey-timeline');
  }

  /**
   * Handle form submission
   */
  handleFormSubmit(event) {
    event.preventDefault();

    // Validate that avatar and products are selected
    if (!this.state.selectedAvatar) {
      alert('Please select an avatar to begin your journey.');
      this.scrollToSection('avatar-selection');
      return;
    }

    if (this.state.products.length === 0) {
      alert('Please select at least one product you want to quit.');
      this.scrollToSection('backpack-selection');
      return;
    }

    // Populate hidden fields with state data
    this.elements.hiddenFields.avatar.value = this.state.selectedAvatar;
    this.elements.hiddenFields.demographics.value = JSON.stringify(this.state.demographics);
    this.elements.hiddenFields.products.value = JSON.stringify(this.state.products);
    this.elements.hiddenFields.answers.value = JSON.stringify(this.state.answers);

    // Get form data
    const formData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      avatar: this.state.selectedAvatar,
      demographics: this.state.demographics,
      products: this.state.products,
      answers: this.state.answers
    };

    console.log('🎉 Form Submission Data:', formData);

    // Show success message
    this.showSuccessMessage();
  }

  /**
   * Show success message
   */
  showSuccessMessage() {
    const submitBtn = this.elements.form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = '✓ Journey Started! We\'ll be in touch soon.';
    submitBtn.style.background = 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)';
    submitBtn.disabled = true;

    // Log the complete state
    console.log('📊 Complete Journey State:', this.state);
    
  }

  /**
   * Get current state (useful for debugging)
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Reset journey (useful for testing)
   */
  reset() {
    console.log('🔄 Resetting journey...');
    
    // Reset state
    this.state = {
      selectedAvatar: null,
      demographics: {},
      products: [],
      progress: 0,
      answers: {}
    };

    // Reset UI
    this.elements.avatarCards.forEach(card => card.classList.remove('selected'));
    this.elements.productButtons.forEach(btn => btn.classList.remove('selected'));
    this.elements.milestones.forEach(milestone => {
      const options = milestone.querySelectorAll('.milestone-option');
      options.forEach(opt => opt.classList.remove('selected'));
      milestone.classList.remove('visible');
    });

    // Reset continue button
    this.elements.continueButton.disabled = true;

    // Reset form
    this.elements.form.reset();
    const submitBtn = this.elements.form.querySelector('.submit-btn');
    submitBtn.textContent = 'Start Your Quit Journey';
    submitBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    submitBtn.disabled = false;

    // Reset avatar icon
    this.elements.avatarIcon.innerHTML = `
      <img src="assets/avatar-warrior.svg" alt="Your Avatar" style="width: 100%; height: 100%;">
    `;

    // Filter milestones
    this.filterMilestones();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('✅ Journey reset complete');
  }
}

// Make QuitJourney available globally
window.QuitJourney = QuitJourney;
