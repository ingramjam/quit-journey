# Quit Journey - Gamified Intake Form 🎮

A "Choose Your Own Adventure" vertical scroller intake form built as a custom HubSpot module. This gamified experience guides users through a personalized quit journey with avatar selection, product selection, and dynamic milestone questions.

## 🎯 Project Overview

This project transforms a traditional intake form into an engaging, game-like experience where users:
1. **Choose an Avatar** - Select a character that represents them
2. **Pack Their Backpack** - Select products they want to quit (cigarettes, vapes, marijuana, nicotine pouches)
3. **Walk The Path** - Answer personalized questions as they scroll through a vertical timeline
4. **Reach The Summit** - Submit their information to begin their quit journey

## 🛠️ Tech Stack

- **HTML5** - Semantic structure with HubSpot HubL templating
- **CSS3** - Flexbox/Grid layouts with smooth animations
- **Vanilla JavaScript** - State management and scroll-based interactions
- **HubSpot HubL** - Module fields and dynamic content
- **IntersectionObserver API** - Smooth milestone animations and avatar movement

## 📁 Project Structure

```
Quit Journey/
├── .github/
│   └── copilot-instructions.md   # AI assistant context
├── module.html                    # Main template with HubL
├── module.css                     # Styles for timeline & animations
├── module.js                      # State management & logic
├── fields.json                    # HubSpot module field definitions
├── meta.json                      # Module metadata
└── README.md                      # This file
```

## 🚀 Installation

### Option 1: HubSpot Design Manager (Recommended)

1. **Create a new module** in HubSpot Design Manager
2. **Upload the files**:
   - Copy `module.html` content to the module HTML
   - Copy `module.css` content to the module CSS
   - Upload `module.js` as a module asset
   - Copy `fields.json` content to define module fields
   - Configure module settings using `meta.json` information

3. **Add to a page**:
   - Edit any HubSpot page or template
   - Add the "Quit Journey" module
   - Configure avatar images and text in the module editor

### Option 2: HubSpot CLI (Advanced)

```bash
# Install HubSpot CLI
npm install -g @hubspot/cli

# Authenticate with your HubSpot account
hs auth

# Upload the module
hs upload "Quit Journey" "quit-journey"
```

## ⚙️ Configuration

### Module Fields (fields.json)

The module includes customizable fields:

**Hero Section:**
- `hero_title` - Main title for avatar selection
- `hero_subtitle` - Subtitle text

**Avatar Fields (1-4):**
- `avatar_X_image` - Upload avatar images (SVG or PNG recommended)
- `avatar_X_name` - Avatar name
- `avatar_X_description` - Short description

**Backpack Section:**
- `backpack_title` - Section title
- `backpack_description` - Instructions

**Destination:**
- `destination_title` - Success message title
- `destination_subtitle` - Final instructions

**Optional:**
- `hubspot_form_id` - Use an existing HubSpot form
- `custom_css` - Override default styles

## 🎨 Customization

### Adding Custom Avatar Images

1. Navigate to **Design Manager** > **Files**
2. Upload your avatar images (recommended: 300x300px, SVG or PNG)
3. In the module editor, select the uploaded images for each avatar field
4. The avatars will automatically display in the selection grid

### Modifying Questions/Milestones

Edit `module.html` to add or modify milestone questions:

```html
<div class="milestone" data-milestone="X" data-required-products="product-name">
  <div class="milestone-card milestone-left">
    <h3 class="milestone-title">Your Question Here?</h3>
    <div class="milestone-options">
      <button class="milestone-option" data-answer="answer-1">Option 1</button>
      <button class="milestone-option" data-answer="answer-2">Option 2</button>
    </div>
  </div>
</div>
```

**Key attributes:**
- `data-milestone` - Unique milestone ID (number)
- `data-required-products` - Show only if this product is selected (leave empty for universal questions)
- `milestone-left` or `milestone-right` - Alternate for visual variety

### Styling Customization

Override default styles using the `custom_css` field or by editing `module.css`:

```css
/* Example: Change primary color */
.journey-title {
  color: #your-color;
}

/* Example: Adjust avatar size */
.avatar-traveler {
  width: 100px;
  height: 100px;
}
```

## 🔗 HubSpot Integration

### Method 1: Using Built-in Form (Current Implementation)

The module includes a standard HTML form that captures:
- First Name
- Last Name
- Email
- Phone Number
- Hidden fields for journey data (avatar, demographics, products, answers)

**To connect to HubSpot:**

1. **Create matching HubSpot properties** in your portal:
   - `avatar_selected` (Single-line text)
   - `demographics` (Multi-line text)
   - `products_selected` (Multi-line text)
   - `journey_answers` (Multi-line text)

2. **Modify `module.js`** to enable actual submission:
   - Uncomment the `submitToHubSpot()` method
   - Add your Portal ID and Form GUID
   - The form will submit via HubSpot Forms API

### Method 2: Embedding Existing HubSpot Form (Recommended)

1. **Create a HubSpot form** with all required fields
2. **Hide the form fields** with CSS:

```css
.journey-form .hs-form-field {
  display: none;
}
```

3. **Use JavaScript to populate hidden fields** before submission:

```javascript
// In module.js handleFormSubmit()
const hsForm = document.querySelector('.hs-form');
hsForm.querySelector('input[name="avatar_selected"]').value = this.state.selectedAvatar;
// ... populate other fields
hsForm.submit();
```

4. **Add HubL form embed** to `module.html`:

```html
{% form
  form_id="{{ module.hubspot_form_id }}",
  title="",
  form_style="embedded"
%}
```

## 🎮 Features Explained

### State Management

The `QuitJourney` class tracks user progress:

```javascript
this.state = {
  selectedAvatar: null,        // Selected avatar ID
  demographics: {},            // Age & location from avatar
  products: [],                // Array of selected products
  progress: 0,                 // Current milestone
  answers: {}                  // User's answers to questions
}
```

### Sticky Avatar Movement

The avatar "walks" down the path as users scroll:
- Uses CSS `position: fixed` for sticky positioning
- JavaScript updates rotation for walking animation
- IntersectionObserver triggers milestone animations

### Conditional Question Logic

Questions appear based on selected products:
- Universal questions show for all users
- Product-specific questions only appear if that product is selected
- Implemented via `data-required-products` attribute

### Smooth Scrolling

Auto-scrolls between sections:
- After avatar selection → scroll to backpack
- After product selection → scroll to journey
- After last question → scroll to destination

## 🧪 Testing & Debugging

### Browser Console Commands

```javascript
// Access the journey instance
const journey = window.journeyInstance;

// View current state
journey.getState();

// Reset the journey
journey.reset();

// Check which milestones are visible
document.querySelectorAll('.milestone:not(.hidden)');
```

### Common Issues

**Avatar doesn't appear on path:**
- Check that an avatar image is uploaded
- Verify the avatar card is clicked (should have `.selected` class)
- Check browser console for JavaScript errors

**Questions not filtering correctly:**
- Verify `data-required-products` matches product button `data-product`
- Check that products are being added to state (use `journey.getState()`)

**Form not submitting:**
- Check that all required fields are filled
- Verify HubSpot Form ID is correct (if using embedded form)
- Check browser console for API errors

## 📱 Responsive Design

The module is fully responsive with breakpoints at:
- **Desktop**: Full layout with alternating milestone cards
- **Tablet** (768px): Adjusted spacing and font sizes
- **Mobile** (768px and below): Single column layout, simplified animations

## 🎯 Implementation Tips

### For HubSpot Developers

1. **Start Simple**: Upload with placeholder images first, test functionality
2. **Test Branching Logic**: Select different product combinations to verify conditional questions
3. **Check Form Submission**: Test with a test HubSpot form to verify data capture
4. **Monitor Performance**: The scroll effects are optimized, but test on mobile devices

### Advanced Enhancements

**Add More Products:**
```javascript
// In module.html, add button:
<button class="product-btn" data-product="chewing-tobacco">
  <span class="product-icon">🎯</span>
  <span class="product-name">Chewing Tobacco</span>
</button>

// Add corresponding milestone questions
```

**Add Progress Bar:**
```css
/* Add to module.css */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(to right, #667eea, #764ba2);
  width: 0%;
  transition: width 0.3s ease;
  z-index: 1000;
}
```

```javascript
// Update in module.js
updateProgressBar() {
  const totalMilestones = document.querySelectorAll('.milestone:not(.hidden)').length;
  const progress = (this.state.progress / totalMilestones) * 100;
  document.querySelector('.progress-bar').style.width = `${progress}%`;
}
```

**Add Sound Effects:**
```javascript
// Add audio elements
const sounds = {
  select: new Audio('/path/to/select.mp3'),
  milestone: new Audio('/path/to/milestone.mp3'),
  success: new Audio('/path/to/success.mp3')
};

// Play on interactions
handleAvatarSelection(event) {
  sounds.select.play();
  // ... rest of code
}
```

## 🔒 Privacy & Data Handling

- All user data is stored in HubSpot's secure database
- Form submission follows HubSpot's privacy policies
- No data is stored in browser localStorage by default
- Ensure GDPR/CCPA compliance in your HubSpot settings

## 📊 Analytics Integration

Track user interactions:

```javascript
// Add to module.js
trackEvent(action, label) {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: 'Quit Journey',
      event_label: label
    });
  }
  
  // HubSpot tracking
  if (typeof _hsq !== 'undefined') {
    _hsq.push(['trackCustomBehavioralEvent', {
      name: 'quit_journey_interaction',
      properties: { action, label }
    }]);
  }
}

// Use in methods:
handleAvatarSelection(event) {
  this.trackEvent('avatar_selected', this.state.selectedAvatar);
  // ... rest of code
}
```

## 🤝 Contributing

This is a custom HubSpot module. To contribute:
1. Test changes locally with HubSpot CLI
2. Ensure cross-browser compatibility
3. Update README with new features
4. Follow HubSpot module best practices

## 📝 License

This project is provided as-is for use in HubSpot implementations.

## 🆘 Support

For issues or questions:
1. Check the HubSpot Developer Documentation
2. Review browser console for errors
3. Test with different HubSpot portal configurations
4. Verify all module files are properly uploaded

## 🎉 Credits

Developed for engaging quit journey experiences on HubSpot CMS.

---

**Version**: 1.0.0  
**Last Updated**: December 10, 2025  
**HubSpot Compatibility**: CMS Hub Professional & Enterprise
