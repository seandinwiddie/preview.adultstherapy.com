/**
 * Navigation enhancements for Adults and Couples Therapy of Oregon
 * Provides additional functionality for dropdown menus
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add current-menu-item class to navigation items based on current URL
  highlightCurrentPage();
  
  // Add active navigation markers using data attributes
  addActiveNavigationMarkers();
  
  // Enhanced mobile menu behavior
  setupMobileNavigation();
  
  // Improve dropdown accessibility for keyboard users
  enhanceKeyboardAccessibility();
});

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
  const currentPath = window.location.pathname;
  // Remove trailing slash for consistency in comparison
  const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
  
  // Map of page paths to their corresponding navigation links
  const pageToNavMap = {
    '/': 'a[href="/"]',
    '/education': 'a[href*="/education"]',
    '/about': 'a[href*="/about"]',
    '/skills': 'a[href*="/skills"]',
    '/therapy': 'a[href*="/therapy"]',
    '/therapy/cbt': 'a[href*="/therapy/cbt"]',
    '/therapy/dbt': 'a[href*="/therapy/dbt"]',
    '/therapy/gottman': 'a[href*="/therapy/gottman"]',
    '/therapy/military': 'a[href*="/therapy/military"]',
    '/therapy/mindfulness': 'a[href*="/therapy/mindfulness"]',
    '/therapy/talk-therapy': 'a[href*="/therapy/talk-therapy"]',
    '/privacy': 'a[href*="/privacy"]',
    '/terms': 'a[href*="/terms"]', 
    '/sitemap': 'a[href*="/sitemap"]',
  };
  
  // First, remove any existing active markers
  document.querySelectorAll('[data-nav-active="true"]').forEach(el => {
    el.removeAttribute('data-nav-active');
    el.style.color = '';
    el.style.fontWeight = '';
  });
  
  // Check if we're on a therapy subpage
  let isTherapySubpage = false;
  if (normalizedCurrentPath.startsWith('/therapy/')) {
    isTherapySubpage = true;
    
    // Try to find the specific therapy page link
    const specificSelector = pageToNavMap[normalizedCurrentPath];
    if (specificSelector) {
      const specificLinks = document.querySelectorAll(specificSelector);
      specificLinks.forEach(link => {
        link.setAttribute('data-nav-active', 'true');
        link.style.color = '#7e679b';
        link.style.fontWeight = 'bold';
        
        // Also mark the parent item
        const parentItem = link.closest('.wp-block-navigation-submenu');
        if (parentItem) {
          const parentLink = parentItem.querySelector(':scope > a');
          if (parentLink) {
            parentLink.setAttribute('data-nav-parent-active', 'true');
            parentLink.style.color = '#7e679b';
          }
        }
      });
    }
    
    // Always highlight the main Therapy link for any therapy subpage
    const therapyLinks = document.querySelectorAll(pageToNavMap['/therapy']);
    therapyLinks.forEach(link => {
      // Only select the main Therapy link, not subpage links
      if (!link.closest('.wp-block-navigation__submenu-container')) {
        link.setAttribute('data-nav-active', 'true');
        link.style.color = '#7e679b';
        link.style.fontWeight = 'bold';
      }
    });
  } else {
    // For non-therapy pages, use the direct mapping
    const selector = pageToNavMap[normalizedCurrentPath];
    if (selector) {
      const links = document.querySelectorAll(selector);
      links.forEach(link => {
        // Skip submenu links except when explicitly matching them
        if (!link.closest('.wp-block-navigation__submenu-container') || 
            normalizedCurrentPath.includes('/therapy/')) {
          link.setAttribute('data-nav-active', 'true');
          link.style.color = '#7e679b';
          link.style.fontWeight = 'bold';
        }
      });
    }
  }
  
  // Log active navigation items
  console.log('Active navigation items:', document.querySelectorAll('[data-nav-active="true"]').length);
} 