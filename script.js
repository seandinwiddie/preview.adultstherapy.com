/**
 * Navigation enhancements for Adults and Couples Therapy of Oregon
 * Provides additional functionality for dropdown menus
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add inline CSS for navigation highlighting
  addInlineNavigationStyles();

  // Highlight all main navigation items based on current URL
  highlightMainNavigation();
  
  // Add current-menu-item class to navigation items based on current URL
  highlightCurrentPage();
  
  // Add active navigation markers using data attributes
  addActiveNavigationMarkers();
  
  // Special case for therapy pages - ensure parent menu is highlighted
  highlightTherapyParentMenu();
  
  // Enhanced mobile menu behavior
  setupMobileNavigation();
  
  // Improve dropdown accessibility for keyboard users
  enhanceKeyboardAccessibility();
});

/**
 * Adds inline CSS styles to ensure navigation highlighting works
 */
function addInlineNavigationStyles() {
  const styleTag = document.createElement('style');
  styleTag.id = 'nav-highlight-styles';
  styleTag.innerHTML = `
    /* Direct navigation highlighting styles */
    .wp-block-navigation-item.current-menu-item > a,
    .wp-block-navigation-item.current-menu-item > .wp-block-navigation-item__content {
      color: #7e679b !important;
      font-weight: bold !important;
      border-bottom: 2px solid #7e679b !important;
      padding-bottom: 3px !important;
    }
    
    .wp-block-navigation-item.current-menu-parent > a,
    .wp-block-navigation-item.current-menu-parent > .wp-block-navigation-item__content {
      color: #7e679b !important;
    }
    
    /* Ensure the styles work for Education, About, Skills and Therapy links */
    body[class*="page-education"] .wp-block-navigation a[href*="/education/"],
    body[class*="page-about"] .wp-block-navigation a[href*="/about/"],
    body[class*="page-skills"] .wp-block-navigation a[href*="/skills/"],
    body[class*="page-therapy"] .wp-block-navigation a[href*="/therapy/"] {
      color: #7e679b !important;
      font-weight: bold !important;
    }
    
    /* Submenu items */
    .wp-block-navigation__submenu-container .current-menu-item > a {
      background-color: rgba(126, 103, 155, 0.1) !important;
      color: #7e679b !important;
      font-weight: bold !important;
    }
  `;
  
  document.head.appendChild(styleTag);
}

/**
 * Generic function to highlight main navigation items based on current URL
 */
function highlightMainNavigation() {
  const currentPath = window.location.pathname;
  console.log('Highlighting main navigation for path:', currentPath);
  
  // Map of URL paths to menu item text
  const pathToMenuMap = {
    '/': 'Home',
    '/skills/': 'Skills',
    '/education/': 'Education',
    '/about/': 'About',
    '/therapy/': 'Therapy'
  };
  
  // Find which section we're in by checking URL
  let activeSection = '';
  Object.keys(pathToMenuMap).forEach(path => {
    if (currentPath === path || currentPath.startsWith(path)) {
      activeSection = pathToMenuMap[path];
    }
  });
  
  if (!activeSection) return;
  
  console.log('Active section determined to be:', activeSection);
  
  // Find and style the main navigation items
  document.querySelectorAll('.wp-block-navigation-item').forEach(item => {
    // Get the link text, trimming any whitespace
    const link = item.querySelector('a');
    if (!link) return;
    
    const linkText = link.textContent.trim();
    
    // If this is the active section, highlight it
    if (linkText === activeSection) {
      console.log('Highlighting main nav item:', linkText);
      
      // Apply direct styling
      link.style.color = '#7e679b';
      link.style.fontWeight = 'bold';
      
      // Add a bottom border for extra visibility
      if (!link.closest('.wp-block-navigation__submenu-container')) {
        link.style.borderBottom = '2px solid #7e679b';
        link.style.paddingBottom = '3px';
      }
      
      // Add the current-menu-item class
      item.classList.add('current-menu-item');
      
      // If this is a dropdown toggle, style it directly
      const toggleButton = item.querySelector('.wp-block-navigation-submenu__toggle');
      if (toggleButton) {
        toggleButton.style.color = '#7e679b';
      }
    }
  });
  
  // For debugging, log all main navigation items
  console.log('All main navigation items:');
  document.querySelectorAll('.wp-block-navigation-item > a').forEach(link => {
    console.log('  -', link.textContent.trim());
  });
}

/**
 * Highlights the current active page in the navigation
 */
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  // Remove trailing slash for consistency in comparison
  const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
  
  // Add page-specific class to body element for CSS targeting
  addPageClassToBody(normalizedCurrentPath);
  
  // Target all navigation links
  const navItems = document.querySelectorAll('.wp-block-navigation-item a');
  
  navItems.forEach(item => {
    if (!item.href) return; // Skip if no href attribute
    
    try {
      const url = new URL(item.href);
      let linkPath = url.pathname;
      
      // Normalize the path for comparison (remove trailing slash)
      linkPath = linkPath.endsWith('/') ? linkPath.slice(0, -1) : linkPath;
      
      // Check if current URL matches this nav item
      const isCurrentPage = normalizedCurrentPath === linkPath;
      
      if (isCurrentPage) {
        // Add current-menu-item class to parent li element
        const navItem = item.closest('.wp-block-navigation-item');
        if (navItem) {
          navItem.classList.add('current-menu-item');
          
          // If this is in a submenu, also highlight the parent menu item
          const parentSubmenu = navItem.closest('.wp-block-navigation-submenu');
          if (parentSubmenu) {
            parentSubmenu.classList.add('current-menu-parent');
            
            // Also add the current-menu-item class to the direct parent for visibility
            const directParent = parentSubmenu.closest('.wp-block-navigation-item');
            if (directParent) {
              directParent.classList.add('current-menu-parent');
            }
          }
        }
      }
    } catch (e) {
      console.error("Error checking navigation URL:", e);
    }
  });
  
  // Add console log to debug
  console.log('Current path:', normalizedCurrentPath);
  console.log('Navigation items with current-menu-item class:', document.querySelectorAll('.current-menu-item').length);
}

/**
 * Adds page-specific classes to the body element for CSS targeting
 */
function addPageClassToBody(path) {
  const body = document.body;
  
  // Remove any existing page-specific classes
  body.classList.forEach(cls => {
    if (cls.startsWith('page-')) {
      body.classList.remove(cls);
    }
  });
  
  // Extract page name from path
  let pageName = 'home';
  
  if (path === '' || path === '/') {
    pageName = 'home';
  } else {
    // Extract the main section
    const parts = path.split('/').filter(p => p);
    if (parts.length > 0) {
      pageName = parts[0];
    }
  }
  
  // Add page-specific class
  body.classList.add(`page-${pageName}`);
  
  // For submenu items, also add a class for the parent section
  if (path.includes('/therapy/')) {
    body.classList.add('page-therapy');
    
    // Add specific therapy type class
    const therapyType = path.split('/therapy/')[1]?.split('/')[0];
    if (therapyType) {
      body.classList.add(`page-therapy-${therapyType}`);
    }
  }
  
  console.log('Added body class:', `page-${pageName}`);
}

/**
 * Enhances mobile navigation behavior
 */
function setupMobileNavigation() {
  // Smooth transition for mobile menu opening/closing
  const menuButtons = document.querySelectorAll('.wp-block-navigation__responsive-container-open');
  const closeButtons = document.querySelectorAll('.wp-block-navigation__responsive-container-close');
  
  // Add tap functionality for submenu toggles on mobile
  const submenuToggles = document.querySelectorAll('.wp-block-navigation-submenu__toggle');
  
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      // Only needed for additional functionality beyond WP's built-in behavior
      const submenu = this.closest('.wp-block-navigation-submenu');
      if (submenu) {
        submenu.classList.toggle('is-open');
      }
    });
  });
}

/**
 * Improves keyboard accessibility for navigation
 */
function enhanceKeyboardAccessibility() {
  const navItems = document.querySelectorAll('.wp-block-navigation-item');
  
  navItems.forEach(item => {
    // Focus handling for keyboard navigation
    item.addEventListener('keydown', function(e) {
      // Open submenu on enter or space key for parent items
      if ((e.key === 'Enter' || e.key === ' ') && item.classList.contains('has-child')) {
        e.preventDefault();
        item.classList.add('is-open');
        
        // Focus the first link in the submenu
        const firstSubmenuLink = item.querySelector('.wp-block-navigation__submenu-container a');
        if (firstSubmenuLink) {
          firstSubmenuLink.focus();
        }
      }
      
      // Close submenu on escape key
      if (e.key === 'Escape' && item.classList.contains('is-open')) {
        e.preventDefault();
        item.classList.remove('is-open');
        
        // Return focus to parent item link
        const parentLink = item.querySelector(':scope > a');
        if (parentLink) {
          parentLink.focus();
        }
      }
    });
    
    // Close submenus when focus leaves
    item.addEventListener('focusout', function(e) {
      // Check if the focus is still within this menu item
      if (!item.contains(e.relatedTarget)) {
        // Only close if focus has truly left this menu branch
        setTimeout(() => {
          if (!item.contains(document.activeElement)) {
            item.classList.remove('is-open');
          }
        }, 10);
      }
    });
  });
}

/**
 * Directly marks navigation items as active using data attributes
 * This provides a more reliable way to highlight the current page
 */
function addActiveNavigationMarkers() {
  // Get the current URL path
  const currentPath = window.location.pathname;
  console.log('Current path:', currentPath);
  
  // Get all navigation links
  const navLinks = document.querySelectorAll('.wp-block-navigation a');
  console.log('Total nav links found:', navLinks.length);
  
  // Clear any previously set active states
  navLinks.forEach(link => {
    link.style.color = '';
    link.style.fontWeight = '';
    link.style.borderBottom = '';
    link.style.paddingBottom = '';
    link.parentElement.classList.remove('current-menu-item');
    link.parentElement.classList.remove('current-menu-parent');
  });
  
  // Define a mapping for the specific sections we saw in the screenshots
  const sectionMap = {
    '/about/': 'About',
    '/education/': 'Education',
    '/skills/': 'Skills',
    '/therapy/': 'Therapy'
  };
  
  // Determine the active section
  let activeSection = '';
  for (const path in sectionMap) {
    if (currentPath.includes(path)) {
      activeSection = sectionMap[path];
      break;
    }
  }
  
  // If we found an active section, highlight it
  if (activeSection) {
    console.log('Active section:', activeSection);
    
    // Find navigation item with that text
    const navItems = document.querySelectorAll('.wp-block-navigation-item');
    navItems.forEach(item => {
      // Check if text content includes the section name
      const linkText = item.textContent.trim();
      
      if (linkText === activeSection) {
        console.log('Found matching nav item:', linkText);
        const link = item.querySelector('a');
        if (link) {
          link.style.color = '#7e679b';
          link.style.fontWeight = 'bold';
          link.style.borderBottom = '2px solid #7e679b';
          link.style.paddingBottom = '3px';
          item.classList.add('current-menu-item');
        }
      }
    });
  }
  
  // Match the current URL against navigation links as well (for safety)
  navLinks.forEach(link => {
    if (!link.href) return;
    
    // Simple direct URL comparison
    if (link.href === window.location.href || 
        link.href === window.location.origin + currentPath) {
      console.log('EXACT MATCH:', link.href);
      
      // Style the link and its parent
      link.style.color = '#7e679b';
      link.style.fontWeight = 'bold';
      link.style.borderBottom = '2px solid #7e679b';
      link.style.paddingBottom = '3px';
      link.parentElement.classList.add('current-menu-item');
      
      // If in a submenu, also mark the parent item
      const submenuContainer = link.closest('.wp-block-navigation__submenu-container');
      if (submenuContainer) {
        const parentSubmenu = submenuContainer.parentElement;
        if (parentSubmenu) {
          const parentLink = parentSubmenu.querySelector(':scope > a');
          if (parentLink) {
            parentLink.style.color = '#7e679b';
            parentSubmenu.classList.add('current-menu-parent');
          }
        }
      }
    }
    // Check for section matches (for example, any therapy page should highlight the Therapy menu)
    else if (currentPath.includes('/therapy/') && link.href.includes('/therapy') && 
             !link.closest('.wp-block-navigation__submenu-container')) {
      console.log('SECTION MATCH (Therapy):', link.href);
      link.style.color = '#7e679b';
      link.style.fontWeight = 'bold';
      link.style.borderBottom = '2px solid #7e679b';
      link.style.paddingBottom = '3px';
      link.parentElement.classList.add('current-menu-item');
    }
    else if (currentPath.includes('/education') && link.href.includes('/education')) {
      console.log('SECTION MATCH (Education):', link.href);
      link.style.color = '#7e679b';
      link.style.fontWeight = 'bold';
      link.style.borderBottom = '2px solid #7e679b';
      link.style.paddingBottom = '3px';
      link.parentElement.classList.add('current-menu-item');
    }
    else if (currentPath.includes('/about') && link.href.includes('/about')) {
      console.log('SECTION MATCH (About):', link.href);
      link.style.color = '#7e679b';
      link.style.fontWeight = 'bold';
      link.style.borderBottom = '2px solid #7e679b';
      link.style.paddingBottom = '3px';
      link.parentElement.classList.add('current-menu-item');
    }
    else if (currentPath.includes('/skills') && link.href.includes('/skills')) {
      console.log('SECTION MATCH (Skills):', link.href);
      link.style.color = '#7e679b';
      link.style.fontWeight = 'bold';
      link.style.borderBottom = '2px solid #7e679b';
      link.style.paddingBottom = '3px';
      link.parentElement.classList.add('current-menu-item');
    }
  });
  
  // If we're on a specific therapy page, make sure the corresponding submenu item is also highlighted
  if (currentPath.includes('/therapy/')) {
    // Get the therapy type from the URL
    const therapyType = currentPath.split('/therapy/')[1]?.split('/')[0];
    
    if (therapyType) {
      navLinks.forEach(link => {
        if (link.href.includes(`/therapy/${therapyType}`)) {
          console.log('THERAPY TYPE MATCH:', link.href);
          link.style.color = '#7e679b';
          link.style.fontWeight = 'bold';
          link.parentElement.classList.add('current-menu-item');
        }
      });
    }
  }
}

/**
 * Special function to ensure the Therapy parent menu item is highlighted
 * when viewing a therapy subpage
 */
function highlightTherapyParentMenu() {
  const currentPath = window.location.pathname;
  
  // Check if we're on a therapy page
  if (currentPath.includes('/therapy/')) {
    console.log('On therapy page, highlighting parent menu');
    
    // Find the main Therapy menu item directly by its text content
    document.querySelectorAll('.wp-block-navigation-item').forEach(item => {
      const link = item.querySelector('a');
      if (link && link.textContent.trim() === 'Therapy') {
        console.log('Found Therapy menu item:', link);
        
        // Apply direct styling
        link.style.color = '#7e679b';
        link.style.fontWeight = 'bold';
        link.style.borderBottom = '2px solid #7e679b';
        
        // Also add the current-menu-parent class
        item.classList.add('current-menu-parent');
        
        // If this is a dropdown toggle, style it directly
        const toggleButton = item.querySelector('.wp-block-navigation-submenu__toggle');
        if (toggleButton) {
          toggleButton.style.color = '#7e679b';
        }
      }
    });
    
    // Also check for exact therapy submenu match
    const therapyType = currentPath.split('/therapy/')[1]?.split('/')[0];
    if (therapyType) {
      // Map of therapy types to their display names
      const therapyNames = {
        'cbt': 'Cognitive Behavioral Therapy',
        'dbt': 'Dialectical Behavior Therapy',
        'gottman': 'Gottman\'s Couple Therapy',
        'military': 'Military',
        'mindfulness': 'Mindfulness',
        'talk-therapy': 'Talk Therapy'
      };
      
      const targetName = therapyNames[therapyType];
      if (targetName) {
        // Find submenu item by name
        document.querySelectorAll('.wp-block-navigation__submenu-container .wp-block-navigation-item').forEach(item => {
          const link = item.querySelector('a');
          if (link && link.textContent.trim() === targetName) {
            console.log('Found therapy submenu item:', link);
            
            // Style it directly
            link.style.color = '#7e679b';
            link.style.fontWeight = 'bold';
            item.classList.add('current-menu-item');
          }
        });
      }
    }
  }
} 