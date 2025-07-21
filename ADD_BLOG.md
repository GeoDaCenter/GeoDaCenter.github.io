# Adding Blog Posts to GeoDa Docusaurus Site

This guide provides detailed steps for adding new blog posts to the GeoDa Docusaurus site and publishing them via GitHub Actions.

## 📋 Prerequisites

- Git access to the `GeoDaCenter/newsite` repository
- Basic knowledge of Markdown syntax
- Image files ready (if needed)

## 🚀 Shortcut

### Quick Blog Post Addition (Direct to Main)

If you have write access to the main branch and want to add a simple blog post quickly:

1. **Create your blog post file** in the `blog/` directory:
   ```bash
   # Navigate to blog directory
   cd blog
   
   # Create a new markdown file with date prefix
   touch YYYY-MM-DD-your-post-title.md
   ```

2. **Add content** to your file with proper frontmatter:
   ```markdown
   ---
   title: Your Blog Post Title
   authors: [existing-author-id]
   tags: [existing-tag1, existing-tag2]
   ---

   Your blog post content here...
   ```

3. **Commit and push directly to main**:
   ```bash
   git add blog/YYYY-MM-DD-your-post-title.md
   git commit -m "Add blog post: [Your Post Title]"
   git push origin main
   ```

4. **Automatic deployment**:
   - GitHub Actions will automatically build and deploy
   - Your post will be live at `https://geodacenter.github.io/newsite/blog/` within minutes

**Note**: This shortcut is for simple posts using existing authors and tags. For new authors, tags, or complex posts with images, follow the full guide below.


## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/GeoDaCenter/newsite.git
   cd newsite
   ```

2. **Create a new branch**:
   ```bash
   git checkout -b add-blog-post-[post-title]
   ```

3. **Follow the detailed steps below**

## 📝 Step-by-Step Guide

### Step 1: Create the Blog Post File

#### Option A: Simple Blog Post (Single Markdown File)

1. **Navigate to the blog directory**:
   ```bash
   cd blog
   ```

2. **Create a new markdown file** with the naming convention:
   ```
   YYYY-MM-DD-[slug].md
   ```
   
   Example: `2025-01-30-new-feature-announcement.md`

3. **Add the frontmatter** at the top of the file:
   ```markdown
   ---
   title: Your Blog Post Title
   authors: [author-id]
   tags: [tag1, tag2]
   ---
   ```

4. **Write your content** below the frontmatter:
   ```markdown
   ---
   title: New GeoDa Feature Announcement
   authors: [jkoschinsky]
   tags: [news, features]
   ---

   Your blog post content goes here. You can use standard Markdown syntax.

   ## Subheadings

   You can include:
   - **Bold text**
   - *Italic text*
   - [Links](https://example.com)
   - Code snippets: `inline code`
   - And more...
   ```

#### Option B: Blog Post with Images (Directory Structure)

1. **Create a directory** with the naming convention:
   ```
   YYYY-MM-DD-[slug]/
   ```

2. **Create an `index.md` file** inside the directory:
   ```markdown
   ---
   slug: your-slug-name
   title: Your Blog Post Title
   authors: [author-id]
   tags: [tag1, tag2]
   ---

   Your blog post content here.
   ```

3. **Add images** to the same directory and reference them:
   ```markdown
   ![Image Description](./image-name.png)
   ```

### Step 2: Add Author Information (if needed)

If you're a new author, add your information to `blog/authors.yml`:

```yaml
your-author-id:
  name: Your Full Name
  title: Your Title
  url: https://your-website.com
  image_url: https://your-photo-url.com/photo.jpg
  page: true
  socials:
    x: your-twitter-handle
    linkedin: your-linkedin-id
    github: your-github-username
```

**Available author fields:**
- `name`: Your full name
- `title`: Your professional title
- `url`: Your personal website
- `image_url`: URL to your profile photo
- `page`: Set to `true` to create an author page
- `socials`: Social media handles (optional)

### Step 3: Add Tags (if needed)

If you're using new tags, add them to `blog/tags.yml`:

```yaml
your-tag:
  label: Your Tag Label
  permalink: /your-tag
  description: Description of what this tag represents
```

**Available tag fields:**
- `label`: Display name for the tag
- `permalink`: URL path for the tag page
- `description`: Description of the tag

### Step 4: Test Locally

1. **Install dependencies** (if not already done):
   ```bash
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   pnpm start
   ```

3. **Navigate to the blog**:
   - Go to `http://localhost:3000/blog`
   - Check that your post appears correctly
   - Verify images load properly
   - Test any links

4. **Check for warnings**:
   - Look for console warnings about missing authors or tags
   - Fix any issues before committing

### Step 5: Commit and Push

1. **Add your files**:
   ```bash
   git add blog/your-post-file.md
   git add blog/authors.yml  # if you modified it
   git add blog/tags.yml     # if you modified it
   ```

2. **Commit your changes**:
   ```bash
   git commit -m "Add blog post: [Your Post Title]"
   ```

3. **Push to your branch**:
   ```bash
   git push origin add-blog-post-[post-title]
   ```

### Step 6: Create Pull Request

1. **Go to GitHub**:
   - Navigate to `https://github.com/GeoDaCenter/newsite`
   - You should see a prompt to create a pull request from your branch

2. **Create the pull request**:
   - Click "Compare & pull request"
   - Add a descriptive title: `Add blog post: [Your Post Title]`
   - Add a description explaining what the post is about
   - Request review if needed

3. **Wait for review and merge**:
   - The pull request will be reviewed
   - Once approved, it will be merged to the main branch

### Step 7: Automatic Deployment

Once merged to the main branch, GitHub Actions will automatically:

1. **Build the site** with your new blog post
2. **Deploy to GitHub Pages** at `https://geodacenter.github.io/newsite/`
3. **Make your post live** at `https://geodacenter.github.io/newsite/blog/`

## 📋 Blog Post Best Practices

### Content Guidelines

1. **Use clear, descriptive titles**
2. **Include relevant tags** for categorization
3. **Add images** when appropriate (use descriptive alt text)
4. **Keep paragraphs short** for readability
5. **Use headings** to organize content
6. **Include links** to relevant resources

### Image Guidelines

1. **Optimize images** before uploading (compress PNG/JPG files)
2. **Use descriptive filenames** (e.g., `geoda-new-feature-screenshot.png`)
3. **Include alt text** for accessibility
4. **Keep file sizes reasonable** (< 1MB when possible)

### Markdown Examples

```markdown
# Main heading
## Subheading
### Sub-subheading

**Bold text** and *italic text*

[Link text](https://example.com)

![Image description](./image.png)

- Bullet point 1
- Bullet point 2

1. Numbered list item 1
2. Numbered list item 2

`inline code`

```javascript
// Code block
function example() {
  return "Hello World";
}
```

> Blockquote text
```

## 🔧 Troubleshooting

### Common Issues

1. **Post not appearing**:
   - Check the frontmatter syntax (YAML format)
   - Verify the filename follows the date convention
   - Ensure the file is in the correct location

2. **Images not loading**:
   - Check the image path is correct
   - Verify the image file exists
   - Use relative paths (e.g., `./image.png`)

3. **Author/tag warnings**:
   - Add missing authors to `authors.yml`
   - Add missing tags to `tags.yml`
   - Check spelling and case sensitivity

4. **Build errors**:
   - Check the console for specific error messages
   - Verify all YAML syntax is correct
   - Ensure all referenced files exist

### Getting Help

If you encounter issues:

1. **Check the Docusaurus documentation**: https://docusaurus.io/docs/blog
2. **Review existing blog posts** for examples
3. **Ask for help** in the pull request or issues
4. **Contact the maintainers** at spatial@uchicago.edu

## 📅 Publishing Timeline

- **Development**: Test locally with `pnpm start`
- **Review**: Pull request review process
- **Merge**: Automatic deployment via GitHub Actions
- **Live**: Available at `https://geodacenter.github.io/newsite/blog/` within minutes

## 🎯 Quick Reference

### File Structure
```
blog/
├── YYYY-MM-DD-post-title.md          # Simple post
├── YYYY-MM-DD-post-with-images/      # Post with images
│   ├── index.md
│   └── image.png
├── authors.yml                       # Author definitions
└── tags.yml                          # Tag definitions
```

### Frontmatter Template
```markdown
---
title: Your Post Title
authors: [author-id]
tags: [tag1, tag2]
---
```

### Git Commands
```bash
git checkout -b add-blog-post-[title]
git add blog/your-file.md
git commit -m "Add blog post: [Title]"
git push origin add-blog-post-[title]
```

---

**Need help?** Contact the GeoDa team at spatial@uchicago.edu or create an issue on GitHub. 