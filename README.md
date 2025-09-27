# Client Handoff Toolkit WordPress Plugin

A comprehensive solution for agency-client transitions with visual commenting system, maintenance scheduling, and client-friendly editing mode.

## 🚀 Features

### Visual Commenting System
- **Click-to-Comment**: Click on any element on your website to add visual comments
- **Automatic Screenshots**: Automatically captures screenshots of commented elements
- **Real-time Collaboration**: Reply to comments and track progress like a project management system
- **Admin Bar Toggle**: Easy on/off toggle directly from the WordPress admin bar
- **Status Management**: Mark comments as Open, In Progress, or Resolved

### Admin Dashboard
- **Comments Overview**: View all comments with filtering and search capabilities
- **Statistics Dashboard**: Track open, resolved, and total comments
- **Export Functionality**: Export comments to CSV for external reporting
- **User Permission Control**: Configure which user roles can add comments

## 🛠 Installation

### Prerequisites
- WordPress 5.0+
- PHP 7.4+
- Node.js 16+ (for development)

### Quick Installation

1. **Upload the Plugin**
   ```bash
   # Upload the entire plugin folder to your WordPress plugins directory
   /wp-content/plugins/client-handoff-toolkit/
   ```

2. **Install Dependencies**
   ```bash
   cd /path/to/your/wordpress/wp-content/plugins/client-handoff-toolkit/
   npm install
   ```

3. **Build Assets**
   ```bash
   # For development
   npm run start
   
   # For production
   npm run build
   ```

4. **Activate the Plugin**
   - Go to WordPress Admin > Plugins
   - Find "Client Handoff Toolkit"
   - Click "Activate"

### Manual Installation from Source

1. **Clone the Repository**
   ```bash
   git clone [your-repo-url] /path/to/wordpress/wp-content/plugins/client-handoff-toolkit/
   cd /path/to/wordpress/wp-content/plugins/client-handoff-toolkit/
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Activate in WordPress**
   - Navigate to WordPress Admin > Plugins
   - Activate "Client Handoff Toolkit"

## 📖 Usage Guide

### For Administrators

1. **Enable Visual Comments**
   - Go to WordPress Admin > Client Handoff
   - Configure settings (user roles, auto-screenshots, etc.)
   - Save settings

2. **Manage Comments**
   - Visit Client Handoff > Visual Comments
   - View all comments in a table format
   - Filter by status, search comments
   - Update comment statuses
   - Export data to CSV

### For Users (Adding Comments)

1. **Enable Comment Mode**
   - Visit any page on your website
   - Click "Visual Comments" in the admin bar (top)
   - Or use the floating toggle button (bottom right)

2. **Add Comments**
   - Click on any element you want to comment on
   - A popup will appear asking for your comment
   - Type your feedback and click "Save Comment"
   - A screenshot will be automatically captured

3. **View and Reply to Comments**
   - Existing comments appear as numbered markers
   - Click on any marker to view details
   - Add replies or update status (if permitted)

## 🎯 Technical Implementation

### Dynamic DOM Targeting
The plugin uses two approaches for reliable element targeting:

1. **CSS Selector Generation**: Creates unique selectors for clicked elements
2. **Position-based Fallback**: Stores X/Y coordinates as backup
3. **Screenshot Capture**: Uses html2canvas to capture visual context

### Database Structure

**Comments Table** (`wp_cht_comments`):
- `id` - Unique comment ID
- `post_id` - Associated WordPress post
- `user_id` - Comment author
- `comment_text` - The actual comment
- `element_selector` - CSS selector for the element
- `screenshot_url` - Base64 or URL of captured screenshot
- `x_position`, `y_position` - Element coordinates
- `page_url` - Full URL where comment was made
- `status` - open, in_progress, resolved
- Timestamps for created/updated

**Replies Table** (`wp_cht_comment_replies`):
- `id` - Unique reply ID
- `comment_id` - Parent comment reference
- `user_id` - Reply author
- `reply_text` - Reply content
- `created_at` - Timestamp

### React Components Structure

```
src/
├── components/
│   ├── VisualCommentsApp.js     # Main app container
│   ├── CommentToggle.js         # Toggle button component
│   ├── CommentOverlay.js        # Instruction overlay
│   ├── CommentPopup.js          # New comment form
│   ├── CommentsDisplay.js       # Comments manager
│   └── CommentMarker.js         # Individual comment markers
├── admin/
│   └── AdminDashboard.js        # Admin dashboard component
├── styles/
│   ├── frontend.scss            # Frontend styles
│   └── admin.scss               # Admin styles
├── frontend.js                  # Frontend entry point
└── admin.js                     # Admin entry point
```

## 🔧 Development

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run start
   ```
   This will:
   - Watch for file changes
   - Auto-compile SCSS to CSS
   - Bundle JavaScript with hot reload

2. **Code Structure**
   - PHP files handle WordPress integration and AJAX endpoints
   - React components manage the frontend user interface
   - SCSS files provide styling with WordPress admin theme compatibility

3. **Build for Production**
   ```bash
   npm run build
   ```

### Key Files

- `client-handoff-toolkit.php` - Main plugin file with WordPress hooks
- `admin/admin-page.php` - Admin dashboard HTML
- `admin/comments-page.php` - Comments management page
- `src/components/VisualCommentsApp.js` - Main React application
- `package.json` - Dependencies and build scripts
- `webpack.config.js` - Asset bundling configuration

## 🎨 Customization

### Styling
All styles are in SCSS format with CSS variables for easy customization:

```scss
// Custom color scheme
$primary-color: #your-brand-color;
$danger-color: #your-error-color;
$success-color: #your-success-color;
```

### User Permissions
Configure which user roles can add comments:

```php
// In WordPress Admin > Client Handoff > Settings
'allowed_roles' => ['administrator', 'editor', 'author']
```

### Screenshot Settings
Control screenshot capture:

```php
// Disable auto-screenshots
update_option('cht_auto_screenshot', 0);
```

## 🔒 Security Features

- **Nonce Verification**: All AJAX requests are protected with WordPress nonces
- **User Capability Checks**: Actions restricted based on user permissions
- **Data Sanitization**: All inputs sanitized before database storage
- **Escaped Outputs**: All dynamic content properly escaped for display

## 📋 Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please:
1. Check the WordPress admin for any error messages
2. Enable WordPress debug mode to see detailed errors
3. Ensure all dependencies are installed and assets are built
4. Check browser console for JavaScript errors

### Common Issues

**Comments not saving:**
- Check user permissions
- Verify nonce security tokens
- Ensure database tables were created properly

**Toggle button not appearing:**
- Confirm user has `edit_posts` capability
- Check if admin bar is enabled
- Verify scripts are properly enqueued

**Screenshots not capturing:**
- Ensure html2canvas library loaded
- Check for CORS issues with external resources
- Verify browser supports canvas API

## 🚀 Roadmap

- **v1.1**: Mobile responsive improvements
- **v1.2**: Integration with popular page builders (Elementor, Gutenberg)
- **v1.3**: Email notifications for new comments
- **v1.4**: Advanced filtering and sorting options
- **v1.5**: Multi-language support

---

Built with ❤️ for WordPress agencies and their clients.