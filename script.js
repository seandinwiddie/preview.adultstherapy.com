/**
 * Navigation enhancements for Adults and Couples Therapy of Oregon
 * Using functional programming principles
 */

// Wait for DOM to be ready, then run the main function
document.addEventListener('DOMContentLoaded', () => {
  // Compose our functions together
  const run = pipe(
    addInlineStyles,
    highlightNavigation,
    setupAccessibility
  );
  
  // Execute our composed function
  run(document);
});

/**
 * Function composition utility
 * Runs an array of functions from left to right, passing the result of each to the next
 */
const pipe = (...fns) => initialValue => 
  fns.reduce((value, fn) => fn(value), initialValue);

/**
 * Add inline styles to document to ensure navigation highlighting works
 * @param {Document} doc - The document object
 * @returns {Document} - The document for chaining
 */
const addInlineStyles = (doc) => {
  const styleElement = doc.createElement('style');
  styleElement.id = 'nav-highlight-styles';
  styleElement.textContent = `
    /* Direct navigation highlighting styles */
    .nav-active {
      color: #7e679b !important;
      font-weight: bold !important;
    }
    
    .nav-active-border {
      border-bottom: 2px solid #7e679b !important;
      padding-bottom: 3px !important;
    }
    
    /* Submenu styles */
    .wp-block-navigation__submenu-container .nav-active {
      background-color: rgba(126, 103, 155, 0.1) !important;
    }
  `;
  
  doc.head.appendChild(styleElement);
  return doc;
};

/**
 * Core navigation highlighting function
 * @param {Document} doc - The document object 
 * @returns {Document} - The document for chaining
 */
const highlightNavigation = (doc) => {
  const currentPath = window.location.pathname;
  
  // Map paths to section names
  const pathMap = {
    '/': 'Home',
    '/skills/': 'Skills',
    '/education/': 'Education',
    '/about/': 'About',
    '/therapy/': 'Therapy'
  };
  
  // Get all navigation links
  const navLinks = Array.from(doc.querySelectorAll('.wp-block-navigation a'));
  
  // Determine active section based on current path
  const getActiveSection = (path) => {
    return Object.keys(pathMap).find(key => 
      path === key || path.startsWith(key)
    );
  };
  
  const activeSection = getActiveSection(currentPath);
  
  // Check if we're on a therapy subpage
  const isTherapySubpage = currentPath.includes('/therapy/') && currentPath !== '/therapy/';
  
  // Get therapy type if applicable
  const getTherapyType = (path) => {
    if (!path.includes('/therapy/')) return null;
    const match = path.match(/\/therapy\/([^\/]+)/);
    return match ? match[1] : null;
  };
  
  const therapyType = getTherapyType(currentPath);
  
  // Map of therapy types to display names
  const therapyNames = {
    'cbt': 'Cognitive Behavioral Therapy',
    'dbt': 'Dialectical Behavior Therapy',
    'gottman': 'Gottman\'s Couple Therapy',
    'military': 'Military',
    'mindfulness': 'Mindfulness',
    'talk-therapy': 'Talk Therapy'
  };
  
  // Apply styles to each nav link based on conditions
  navLinks.forEach(link => {
    // Clean up any previously applied styles
    link.className = link.className.replace(/\bnav-active\b/g, '').trim();
    link.style.color = '';
    link.style.fontWeight = '';
    link.style.borderBottom = '';
    link.style.paddingBottom = '';
    
    const linkText = link.textContent.trim();
    const isInSubmenu = !!link.closest('.wp-block-navigation__submenu-container');
    const href = link.getAttribute('href') || '';
    
    // Highlight active main section
    if (activeSection && pathMap[activeSection] === linkText && !isInSubmenu) {
      markActive(link, !isInSubmenu);
      console.log('Main navigation active:', linkText);
    }
    
    // Highlight Therapy parent when on therapy subpage
    if (isTherapySubpage && linkText === 'Therapy' && !isInSubmenu) {
      markActive(link, true);
      console.log('Therapy parent active');
    }
    
    // Highlight specific therapy submenu item
    if (therapyType && therapyNames[therapyType] === linkText) {
      markActive(link, false);
      console.log('Therapy submenu active:', linkText);
    }
    
    // Direct URL match (for extra safety)
    if (href === window.location.href || 
        href === window.location.origin + currentPath) {
      markActive(link, !isInSubmenu);
      console.log('Exact URL match:', href);
    }
  });
  
  // For debugging
  console.log('Current path:', currentPath);
  console.log('Active section:', activeSection ? pathMap[activeSection] : 'none');
  console.log('Therapy type:', therapyType);
  
  return doc;
};

/**
 * Helper function to mark a link as active
 * @param {Element} link - The link element to mark as active
 * @param {boolean} withBorder - Whether to add a border
 */
const markActive = (link, withBorder = true) => {
  // Add class for CSS styling
  link.classList.add('nav-active');
  
  // Also add inline styles for immediate effect
  link.style.color = '#7e679b';
  link.style.fontWeight = 'bold';
  
  if (withBorder) {
    link.style.borderBottom = '2px solid #7e679b';
    link.style.paddingBottom = '3px';
  }
  
  // Mark parent li as active for CSS targeting
  const parentItem = link.closest('.wp-block-navigation-item');
  if (parentItem) {
    parentItem.classList.add('current-menu-item');
  }
};

/**
 * Set up accessibility and mobile navigation features
 * @param {Document} doc - The document object
 * @returns {Document} - The document for chaining
 */
const setupAccessibility = (doc) => {
  // Mobile menu toggle behavior
  const submenuToggles = Array.from(doc.querySelectorAll('.wp-block-navigation-submenu__toggle'));
  
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', event => {
      const submenu = toggle.closest('.wp-block-navigation-submenu');
      if (submenu) {
        submenu.classList.toggle('is-open');
      }
    });
  });
  
  // Keyboard accessibility
  const navItems = Array.from(doc.querySelectorAll('.wp-block-navigation-item'));
  
  navItems.forEach(item => {
    // Handle keyboard navigation
    item.addEventListener('keydown', event => {
      const hasSubmenu = item.classList.contains('has-child');
      
      // Open submenu on enter or space
      if ((event.key === 'Enter' || event.key === ' ') && hasSubmenu) {
        event.preventDefault();
        item.classList.add('is-open');
        
        // Focus first submenu link
        const firstLink = item.querySelector('.wp-block-navigation__submenu-container a');
        if (firstLink) firstLink.focus();
      }
      
      // Close on escape
      if (event.key === 'Escape' && item.classList.contains('is-open')) {
        event.preventDefault();
        item.classList.remove('is-open');
        
        // Focus parent link
        const parentLink = item.querySelector(':scope > a');
        if (parentLink) parentLink.focus();
      }
    });
    
    // Handle focus out
    item.addEventListener('focusout', event => {
      if (!item.contains(event.relatedTarget)) {
        // Check if focus truly left
        setTimeout(() => {
          if (!item.contains(doc.activeElement)) {
            item.classList.remove('is-open');
          }
        }, 10);
      }
    });
  });
  
  return doc;
}; 