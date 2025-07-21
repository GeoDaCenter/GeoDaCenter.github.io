# Adding Announcements to GeoDa Docusaurus Site

This guide provides detailed instructions for adding, enabling, and disabling announcement banners on the GeoDa Docusaurus site.

## 📋 Overview

The announcement system uses a banner component that appears at the top of the homepage. It's designed to highlight important news, updates, or events. The banner is dismissible by users and remembers their preference using localStorage.

## 🚀 Quick Start

### Enable an Existing Announcement

1. **Open the homepage file**:
   ```bash
   # Navigate to the source pages directory
   cd src/pages
   ```

2. **Edit `index.tsx`** and uncomment the AnnouncementBanner:
   ```tsx
   // Find this section (around line 37-40):
   {/* <AnnouncementBanner 
     text="🚀 NEW FEATURE! Add your announcement here! 🎯"
     url="/documentation"
   /> */}
   
   // Change it to:
   <AnnouncementBanner 
     text="🚀 NEW FEATURE! Add your announcement here! 🎯"
     url="/documentation"
   />
   ```

3. **Customize the announcement**:
   - Update the `text` prop with your message
   - Update the `url` prop with the target link
   - Add emojis for visual appeal

4. **Test locally**:
   ```bash
   pnpm start
   ```

5. **Commit and deploy**:
   ```bash
   git add src/pages/index.tsx
   git commit -m "Enable announcement banner: [Your Message]"
   git push origin main
   ```

## 📝 Detailed Guide

### Step 1: Understanding the Announcement Component

The announcement system consists of:

- **`AnnouncementBanner.tsx`**: The main component (located in `src/components/`)
- **`AnnouncementBanner.module.css`**: Styling for the banner
- **Usage in `index.tsx`**: Where the banner is displayed

### Step 2: Adding a New Announcement

#### Option A: Simple Text Announcement

1. **Edit `src/pages/index.tsx`**:
   ```tsx
   // Find the commented AnnouncementBanner section
   <AnnouncementBanner 
     text="🎉 GeoDa 2.0 is now available! Download the latest version."
     url="/download"
   />
   ```

#### Option B: Announcement with Custom Styling

If you need custom styling, you can modify the CSS in `src/components/AnnouncementBanner.module.css`:

```css
/* Example: Change banner colors for special events */
.banner {
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
  /* ... other styles ... */
}
```

### Step 3: Customizing Announcement Content

#### Text Content Guidelines

- **Keep it concise**: 50-100 characters work best
- **Use emojis**: Add visual appeal (🎉, 🚀, ⚡, 🎯, etc.)
- **Include call-to-action**: "Download now", "Learn more", "Register today"
- **Be specific**: Mention version numbers, dates, or specific features

#### Examples

```tsx
// New version release
<AnnouncementBanner 
  text="🚀 GeoDa 2.1.0 Released! New spatial analysis tools available."
  url="/download"
/>

// Conference announcement
<AnnouncementBanner 
  text="🎯 Join us at Spatial Data Science Conference 2024!"
  url="/events/conference-2024"
/>

// Workshop announcement
<AnnouncementBanner 
  text="📚 Free Workshop: Introduction to Spatial Data Science"
  url="/workshops/intro-spatial"
/>

// Maintenance notice
<AnnouncementBanner 
  text="⚠️ Scheduled maintenance on Sunday, 2-4 PM EST"
  url="/status"
/>
```

### Step 4: Disabling Announcements

#### Method 1: Comment Out the Component (Recommended)

1. **Edit `src/pages/index.tsx`**:
   ```tsx
   // Comment out the AnnouncementBanner
   {/* <AnnouncementBanner 
     text="Your announcement text here"
     url="/your-link"
   /> */}
   ```

2. **Commit the change**:
   ```bash
   git add src/pages/index.tsx
   git commit -m "Disable announcement banner"
   git push origin main
   ```

### Step 5: Testing Your Announcement

1. **Start the development server**:
   ```bash
   pnpm start
   ```

2. **Check the announcement**:
   - Visit `http://localhost:3000`
   - Verify the banner appears at the top
   - Test the link functionality
   - Test the close button
   - Check responsive design on mobile

3. **Test user dismissal**:
   - Click the × button to close the banner
   - Refresh the page - the banner should not reappear
   - Clear localStorage to reset the dismissal

### Step 6: Deployment

Once you're satisfied with your announcement:

1. **Commit your changes**:
   ```bash
   git add src/pages/index.tsx
   git commit -m "Add announcement: [Your Message]"
   git push origin main
   ```

2. **Automatic deployment**:
   - GitHub Actions will build and deploy the site
   - Your announcement will be live within minutes

## 🎨 Customization Options

### Changing Banner Colors

Edit `src/components/AnnouncementBanner.module.css`:

```css
.banner {
  /* Default gradient */
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #feca57 100%);
  
  /* Alternative: Solid color */
  /* background: #007bff; */
  
  /* Alternative: Different gradient */
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
}
```

### Changing Banner Position

The banner is currently fixed at the top. To change this:

```css
.banner {
  /* Current: Fixed at top */
  position: fixed;
  top: 0;
  
  /* Alternative: Static positioning */
  /* position: static; */
  
  /* Alternative: Fixed at bottom */
  /* position: fixed; */
  /* bottom: 0; */
  /* top: auto; */
}
```

### Adding Animation Effects

The banner already includes a slide-down animation. You can modify it:

```css
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Alternative: Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

## 🔧 Advanced Features

### Conditional Announcements

You can make announcements conditional based on dates or other factors:

```tsx
// Example: Show announcement only during a specific period
const showAnnouncement = () => {
  const now = new Date();
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-31');
  return now >= startDate && now <= endDate;
};

// In your JSX:
{showAnnouncement() && (
  <AnnouncementBanner 
    text="🎉 New Year Special: 50% off GeoDa Pro!"
    url="/pricing"
  />
)}
```

### Multiple Announcements

For multiple announcements, you can create an array:

```tsx
const announcements = [
  {
    text: "🚀 GeoDa 2.1.0 Released!",
    url: "/download"
  },
  {
    text: "📚 New Tutorial Available",
    url: "/tutorials"
  }
];

// Show the first announcement
{announcements.length > 0 && (
  <AnnouncementBanner 
    text={announcements[0].text}
    url={announcements[0].url}
  />
)}
```

## 📱 Responsive Design

The announcement banner is already responsive and includes:

- **Mobile optimization**: Smaller text and adjusted layout
- **Touch-friendly**: Large close button for mobile devices
- **Flexible layout**: Adapts to different screen sizes

### Mobile-Specific Customization

```css
@media screen and (max-width: 768px) {
  .bannerContent {
    padding: 0 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .bannerLink {
    font-size: 0.9rem;
  }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Banner not appearing**:
   - Check that the component is not commented out
   - Verify the import statement is present
   - Clear localStorage to reset dismissal state

2. **Link not working**:
   - Verify the URL is correct
   - Test the URL in a new tab
   - Check for typos in the URL

3. **Styling issues**:
   - Check the CSS file for syntax errors
   - Verify class names match between TSX and CSS
   - Test in different browsers

4. **Mobile display problems**:
   - Test on actual mobile devices
   - Check responsive breakpoints
   - Verify touch targets are large enough

### Debugging Tips

1. **Check browser console** for JavaScript errors
2. **Use browser dev tools** to inspect the banner element
3. **Test localStorage**:
   ```javascript
   // In browser console
   localStorage.getItem('announcement-banner-hidden')
   localStorage.removeItem('announcement-banner-hidden')
   ```

## 📅 Best Practices

### Content Guidelines

- **Keep announcements relevant** and timely
- **Use clear, actionable language**
- **Include relevant links** for more information
- **Don't overuse** - reserve for important updates
- **Test thoroughly** before deployment

### Timing Guidelines

- **New releases**: Show for 1-2 weeks
- **Events**: Show 2-4 weeks before the event
- **Maintenance**: Show 24-48 hours before
- **Urgent updates**: Show until resolved

### Accessibility

The announcement banner includes:
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **High contrast** colors
- **Dismissible** functionality

## 🎯 Quick Reference

### Enable Announcement
```tsx
<AnnouncementBanner 
  text="Your announcement text here"
  url="/your-link"
/>
```

### Disable Announcement
```tsx
{/* <AnnouncementBanner 
  text="Your announcement text here"
  url="/your-link"
/> */}
```

### File Locations
- **Component**: `src/components/AnnouncementBanner.tsx`
- **Styles**: `src/components/AnnouncementBanner.module.css`
- **Usage**: `src/pages/index.tsx`

### Git Commands
```bash
# Enable announcement
git add src/pages/index.tsx
git commit -m "Enable announcement: [Message]"
git push origin main

# Disable announcement
git add src/pages/index.tsx
git commit -m "Disable announcement banner"
git push origin main
```

---

**Need help?** Contact the GeoDa team at spatial@uchicago.edu or create an issue on GitHub. 