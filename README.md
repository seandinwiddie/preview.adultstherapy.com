# Adults and Couples Therapy of Oregon

This repository contains the website for Adults and Couples Therapy of Oregon, a therapy practice specializing in trauma-informed, resilience-oriented approaches for treating depression, anxiety, and relationship issues.

## Website Overview

### Content Focus
- Specializes in treating depression, anxiety, trauma, and relationship issues
- Emphasizes trauma-informed, resilience-oriented therapy approaches
- Offers multiple therapy modalities: Talk Therapy, CBT, DBT, Gottman Couples Therapy, Mindfulness
- Includes specialized resources for military clients

### Practitioner Credentials
- Gottman Couples Therapy Level 2 Practitioner
- EMDR Level 2 certified
- Certified Clinical Trauma Professional (CCTP I)
- Licensed in Oregon (LPC #C5403)
- Memberships in multiple professional organizations:
  - American Counseling Association (ACA)
  - Association for Comprehensive Energy Psychology (ACEP)

## Site Structure

### Main Sections
- **Home**: Overview of practice and services
- **Therapy**: Details of therapy approaches
  - Talk Therapy
  - Cognitive Behavioral Therapy (CBT)
  - Dialectical Behavior Therapy (DBT)
  - Gottman's Couple Therapy
  - Mindfulness
  - Military
- **Skills**: Resources for skill development
- **Education**: Educational materials
- **About**: Information about the therapist
- **Utility Pages**: Terms, Privacy, Sitemap

### File Organization
The site follows a WordPress-derived structure with static HTML exports:

```
/
├── .git/
├── wp-includes/
├── therapy/           # Therapy section with specialized pages
│   ├── cbt/
│   ├── dbt/
│   ├── gottman/
│   ├── mindfulness/
│   ├── talk-therapy/
│   └── military/
├── education/
├── about/
├── terms/
├── privacy/
├── skills/
├── sitemap/
├── wp-content/        # WordPress content
│   ├── plugins/       # Simple Sitemap plugin
│   ├── themes/        # Custom child theme
│   │   └── adultstherapycomchild/
│   │       └── assets/
│   │           └── fonts/
│   └── uploads/       # Media files organized by year
│       ├── 2022/
│       ├── 2023/
│       └── 2025/
├── sitemap files      # XML sitemaps and related files
└── index.html         # Main site homepage
```

## Technical Implementation

### Platform Details
- Based on WordPress with static HTML export
- Custom child theme (adultstherapycomchild)
- Block Editor (Gutenberg) content structure
- Responsive design for mobile compatibility

### Technology Features
- Custom fonts (Alike and Lexend)
- SEO implementation with Yoast
- Accessibility features included
- Google Analytics integration
- XML sitemap generation

### Preview Domain Link Handling
The site includes a JavaScript solution to handle links between the preview and production domains:

```javascript
if (window.location.hostname === 'preview.adultstherapy.com') {
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href.includes('adultstherapy.com')) {
      e.preventDefault();
      window.location.href = link.href.replace('adultstherapy.com', 'preview.adultstherapy.com');
    }
  });
}
```

This script is added to all pages to ensure that when viewing the site on the preview domain, users stay on the preview domain when clicking internal links rather than being redirected to the production site.

### Design Elements
- Color scheme: Purple (#7e679b) and blue (#99b4df)
- Centered content with clear visual hierarchy
- Clean navigation with dropdown menus
- Professional, calming aesthetic appropriate for a mental health practice

## Observations & Recommendations

### Strengths
- Well-structured content hierarchy with logical navigation
- Clean design appropriate for a therapy practice
- Good SEO practices with proper meta tags and structured data
- Mobile-responsive elements throughout

### Potential Improvements
- .DS_Store files (macOS system files) should be excluded from the repository
- Consider implementing a proper build process if this is a statically-generated site
- Some directories have limited content (like the plugins directory)
- Consider adding more dynamic features or interactive elements

## Maintenance

This site appears to be maintained as a static HTML export from WordPress. To update:

1. Make changes in the WordPress admin
2. Export the updated site
3. Push changes to this repository 