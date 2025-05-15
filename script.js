/**
 * Navigation enhancements for Adults and Couples Therapy of Oregon
 * Provides additional functionality for dropdown menus
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add current-menu-item class to navigation items based on current URL
  highlightCurrentPage();
  
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
  const navItems = document.querySelectorAll('.wp-block-navigation-item a');
  
  navItems.forEach(item => {
    const linkPath = new URL(item.href).pathname;
    
    // Check if current URL matches this nav item (allowing for trailing slash variations)
    if (currentPath === linkPath || 
        currentPath === linkPath + '/' || 
        currentPath + '/' === linkPath) {
      // Add current-menu-item class to parent li element
      item.closest('.wp-block-navigation-item').classList.add('current-menu-item');
      
      // If this is in a submenu, also highlight the parent menu item
      const parentSubmenu = item.closest('.wp-block-navigation-submenu');
      if (parentSubmenu) {
        parentSubmenu.classList.add('current-menu-parent');
      }
    }
  });
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