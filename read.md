# Frontend Mentor - FX Checker solution

This is a solution to the [FX Checker challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter).

## Table of contents

- [Overview](#overview)
- [My process](#my-process)
- [Author](#author)

## Overview

### Screenshot

![FX Checker screenshot](./screenshot.jpg)

### Links

- Solution URL: [Add after submission]
- Live Site URL: [Add after deployment]

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox and CSS Grid
- Mobile-first workflow
- Vanilla JavaScript (ES Modules)
- Frankfurter API (ECB data)
- Canvas API for rate history chart
- localStorage for favorites and conversion log

### What I learned

Building FX Checker taught me how to structure a real-world app using ES modules with single responsibility — each file does one thing. I learned how to draw charts using the Canvas API without relying on a library, and how to work with a live REST API to power real-time currency conversion.

I also practiced mobile-first responsive design, going from a single column mobile layout to a side-by-side tablet/desktop layout using media queries.

### Continued development

- Add real 24h change data for the live markets ticker
- Improve chart label positioning and responsiveness
- Connect Compare tab to update when send currency changes
- Add keyboard shortcuts for power users

### Useful resources

- [Frankfurter API docs](https://www.frankfurter.app/docs/) - Free ECB exchange rate API, no key needed
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Used for drawing the rate history chart

### AI Collaboration

I used Claude (Anthropic) throughout this project as a coding partner.

- **What I used it for:** HTML structure, CSS architecture, JS module design, debugging, and API integration
- **What worked well:** Breaking the app into single-responsibility modules, setting up the CSS variable system from the Figma design tokens, and working through API integration issues
- **What didn't:** Some CSS positioning issues (chart labels, picker positioning on desktop) needed manual iteration that AI couldn't solve without seeing the browser directly
- **My approach:** I reviewed and understood every piece of code before adding it to the project. Claude guided the architecture decisions but I made the final calls on structure and tradeoffs.

## Author

- Frontend Mentor - [@yourusername](https://www.frontendmentor.io/profile/yourusername)