# Adding Announcements to GeoDa Docusaurus Site

This guide provides detailed instructions for adding, enabling, and disabling announcement banners on the GeoDa Docusaurus site.

## 📋 Overview

The announcement system uses a banner component that appears at the top of the homepage. It's designed to highlight important news, updates, or events. The banner is dismissible by users and uses a date-based system to ensure new announcements are displayed even after users have dismissed previous ones.

## 🚀 Quick Start

### Adding a New Announcement

1. **Open the announcements configuration file**:
   ```bash
   # Navigate to the data directory
   cd src/data
   ```

2. **Edit `announcements.json`** and update the current announcement:
   ```json
   {
     "current": {
       "text": "🚀 GeoDa 1.22.0.20 (7/31/2025) is now available! 🎯",
       "url": "/download",
       "date": "07/31/2025",
       "active": true
     }
   }
   ```

3. **Customize the announcement**:
   - Update the `text` prop with your message
   - Update the `url` prop with the target link
   - Set a unique `date` (MM/DD/YYYY format)
   - Set `active` to `true` to enable the announcement

4. **Test locally**:
   ```bash
   pnpm start
   ```

5. **Commit and deploy**:
   ```bash
   git add src/data/announcements.json
   git commit -m "Add new announcement: [Your Message]"
   git push origin main
   ```

## 📝 Detailed Guide

### Step 1: Understanding the Announcement System

The announcement system consists of:

- **`AnnouncementBanner.tsx`**: The main component (located in `src/components/`)
- **`AnnouncementBanner.module.css`**: Styling for the banner
- **`announcements.json`**: Configuration file for managing announcements
- **Usage in `index.tsx`**: Where the banner is displayed

### Step 2: How the Date System Works

The announcement system uses dates to ensure users see new announcements:

1. **When a user dismisses an announcement**: The date is stored in localStorage
2. **When a new announcement is published**: The system compares the new date with the last dismissed date
3. **If the new announcement is newer**: It will be displayed to the user
4. **If the new announcement is older**: It will be hidden (user has already seen it)

This means users will always see new announcements, even if they've dismissed previous ones.

### Step 3: Managing Announcements

#### Adding a New Announcement

1. **Edit `src/data/announcements.json`**:
   ```json
   {
     "current": {
       "text": "🎉 GeoDa 2.0 is now available! Download the latest version.",
       "url": "/download",
       "date": "08/15/2025",
       "active": true
     },
     "previous": [
       {
         "text": "🚀 GeoDa 1.22.0.20 (7/31/2025) is now available! 🎯",
         "url": "/download",
         "date": "07/31/2025",
         "active": false
       }
     ]
   }
   ```

2. **Move the current announcement to previous**:
   - Copy the current announcement to the `previous` array
   - Set `active: false` for the previous announcement
   - Update the `current` object with your new announcement

#### Disabling an Announcement

To temporarily disable an announcement without removing it:

```json
{
  "current": {
    "text": "Your announcement text",
    "url": "/your-link",
    "date": "08/15/2025",
    "active": false
  }
}
```

#### Removing an Announcement

To completely remove an announcement, simply update the `current` object with a new announcement or set `active: false`.

### Step 4: Date Guidelines

#### Format
- Use MM/DD/YYYY format: `MM/DD/YYYY`
- Example: `07/31/2025`

#### Best Practices
- **Use release dates**: For version releases, use the actual release date
- **Use event dates**: For events, use the event start date
- **Use current date**: For general announcements, use the current date
- **Be consistent**: Always use the same format (MM/DD/YYYY) for consistency

#### Examples

```json
// Version release
{
  "text": "🚀 GeoDa 2.1.0 Released! New spatial analysis tools available.",
  "url": "/download",
  "date": "08/15/2025",
  "active": true
}

// Conference announcement
{
  "text": "🎯 Join us at Spatial Data Science Conference 2024!",
  "url": "/events/conference-2024",
  "date": "09/01/2024",
  "active": true
}

// Workshop announcement
{
  "text": "📚 Free Workshop: Introduction to Spatial Data Science",
  "url": "/workshops/intro-spatial",
  "date": "08/20/2024",
  "active": true
}
```

### Step 5: Testing Your Announcement

1. **Start the development server**:
   ```bash
   pnpm start
   ```

2. **Test the announcement**:
   - Visit the homepage to see the announcement
   - Click the close button to dismiss it
   - Refresh the page to verify it's hidden
   - Update the date to a newer date and refresh to see it again

3. **Test with different dates**:
   - Try setting the date to a date older than the last dismissed one
   - Verify the announcement doesn't show
   - Try setting the date to a newer date
   - Verify the announcement shows again

### Step 6: Troubleshooting

#### Announcement Not Showing
- Check that `active` is set to `true`
- Verify the date is newer than the last dismissed date
- Clear localStorage to reset user preferences: `localStorage.removeItem('announcement-banner-last-dismissed')`

#### Announcement Always Showing
- Check that the date is properly formatted (MM/DD/YYYY)
- Verify the component is receiving the correct props
- Check the browser console for any errors

#### Backward Compatibility
The system maintains backward compatibility with the old localStorage key (`announcement-banner-hidden`) for announcements without dates.

## 🎯 Best Practices

1. **Keep announcements concise**: 50-100 characters work best
2. **Use emojis**: Add visual appeal (🎉, 🚀, ⚡, 🎯, etc.)
3. **Include call-to-action**: "Download now", "Learn more", "Register today"
4. **Be specific**: Mention version numbers, dates, or specific features
5. **Use meaningful dates**: Use actual release dates or event dates
6. **Test thoroughly**: Always test with different dates before deploying

## 📚 Examples

### Version Release Announcement
```json
{
  "current": {
    "text": "🚀 GeoDa 1.22.0.20 (7/31/2025) is now available! 🎯",
    "url": "/download",
    "date": "07/31/2025",
    "active": true
  }
}
```

### Conference Announcement
```json
{
  "current": {
    "text": "🎯 Join us at Spatial Data Science Conference 2024!",
    "url": "/events/conference-2024",
    "date": "09/01/2024",
    "active": true
  }
}
```

### Workshop Announcement
```json
{
  "current": {
    "text": "📚 Free Workshop: Introduction to Spatial Data Science",
    "url": "/workshops/intro-spatial",
    "date": "08/20/2024",
    "active": true
  }
}
```

### Maintenance Notice
```json
{
  "current": {
    "text": "⚠️ Scheduled maintenance on Sunday, 2-4 PM EST",
    "url": "/status",
    "date": "08/18/2024",
    "active": true
  }
}
``` 