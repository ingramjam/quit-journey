# Quit Journey - Gamified Intake Form

## Project Overview
A gamified "Choose Your Own Adventure" vertical scroller intake form built as a HubSpot custom module.

## Tech Stack
- HTML5 (Semantic structure)
- CSS3 (Flexbox/Grid, Animations)
- Vanilla JavaScript (State management, DOM manipulation, Scroll logic)
- HubSpot HubL (Module fields and form embedding)

## Project Structure
- `module.html` - Main module template with HubL
- `module.css` - Styles for timeline, sticky avatar, animations
- `module.js` - State management and scroll logic
- `fields.json` - HubSpot module field definitions
- `meta.json` - Module metadata

## Development Guidelines
- Use semantic HTML5 elements
- Keep JavaScript vanilla (no frameworks)
- Use IntersectionObserver API for scroll animations
- Maintain state in a centralized JS object
- Follow HubSpot module best practices

## State Management
Track: selectedAvatar, demographics, products (array), progress (current step)

## UI Sections
1. Avatar Selection - Grid of selectable cards
2. The Backpack - Multi-select product buttons
3. The Journey - Vertical timeline with milestones
4. The Destination - Form submission

## HubSpot Integration Notes
- Use HubL {% form %} tag for form embedding
- Hide actual form fields with CSS
- Pass game state to hidden fields via JavaScript before submission
