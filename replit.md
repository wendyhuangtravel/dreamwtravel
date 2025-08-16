# Dream W Travel - Static Website

## Overview

Dream W Travel is a static travel website designed to showcase travel services and capture customer quotes. The site serves as a professional landing page for a travel agency specializing in cruise travel, international trips, honeymoon packages, family vacations, and group travel coordination. The website features a single-page design with smooth scrolling navigation, responsive layout, and a quote request form to generate leads for the travel business.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Static HTML/CSS/JavaScript implementation without backend dependencies
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox for layout management
- **Component-based Structure**: Modular sections including header, hero, services, activities, and quote form
- **Smooth Scrolling Navigation**: JavaScript-powered section navigation with offset calculations for fixed header
- **Form Handling**: Client-side validation with rate limiting and local storage management

### Design System
- **Typography**: Inter font family from Google Fonts for modern, clean appearance
- **Color Scheme**: CSS custom properties (variables) for consistent theming with primary blue (#2563eb), secondary gray, and accent amber colors
- **Layout Strategy**: CSS Grid and Flexbox for responsive layouts that stack appropriately on mobile devices
- **Visual Hierarchy**: Clear heading structure (H1, H2) with consistent spacing and typography scales

### User Interface Components
- **Sticky Header**: Navigation bar that remains visible during scroll with visual state changes
- **Hero Section**: Full-width background image with overlay panel for text readability
- **Service Cards**: Icon-based layout showcasing different travel service offerings
- **External Link Integration**: Buttons linking to Viator (activities) and Golden Tickets (event access) platforms
- **Quote Form**: Multi-field form with client-side validation and success messaging

### Client-Side Features
- **Form Validation**: Required field checking, date range validation, and email format verification
- **Rate Limiting**: Local storage-based submission throttling (3 submissions per hour)
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with smooth scrolling and form features
- **Accessibility**: Semantic HTML structure with proper heading hierarchy and form labels

## External Dependencies

### Content Delivery Networks
- **Google Fonts**: Inter font family for typography
- **Font Awesome**: Icon library (version 6.4.0) for service section and UI elements

### Third-Party Integrations
- **Viator Activities**: External link integration for travel activities and tours booking
- **Golden Tickets**: External link integration for concert and event ticket access
- **Email Services**: Form submissions require external email handling (not implemented in static version)

### Asset Requirements
- **Logo Asset**: PNG/SVG logo file to be placed in assets/ directory
- **Hero Background**: Sky and ocean image for hero section background
- **Favicon**: Browser tab icon (not currently implemented)

### Browser APIs
- **Local Storage**: Used for rate limiting form submissions
- **Scroll API**: For smooth scrolling navigation and header state management
- **Form API**: Native HTML5 form validation enhanced with custom JavaScript