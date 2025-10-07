# EventBoard Website

A web application built in Angular 14 that lets users create and share digital group message boards for celebrations or recognition. Users can start a board, invite others to post messages, photos, or videos, customize the design, and share the final board via link, download, or print.

## Features

### 🎨 Board Creation
- Create custom celebration boards for any occasion
- Choose from pre-designed themes (Birthday, Farewell, Team Appreciation, Celebration)
- Customize board title, description, and recipient name
- Set board visibility (public/private)

### 💬 Message Management
- Add text messages to boards
- Upload photos and videos
- View all messages in a beautiful grid layout
- Delete messages as needed

### 🎭 Theme Customization
- Multiple pre-designed themes with unique color schemes and fonts
- Live preview of selected theme
- Themes optimized for different occasions

### 🔗 Sharing & Export
- Generate unique shareable links
- Copy link to clipboard with one click
- Print boards directly from the browser
- Download boards (print to PDF)

### 💾 Local Storage
- All data persisted in browser's localStorage
- No backend required
- Works offline after initial load

## Technologies Used

- **Angular 14** - Frontend framework
- **TypeScript** - Programming language
- **SCSS** - Styling
- **Reactive Forms** - Form handling
- **RxJS** - Reactive programming
- **LocalStorage API** - Data persistence

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JobThompson/EventBoardWebsite.git
cd EventBoardWebsite
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run watch` - Build and watch for changes

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/              # Home page with board listing
│   │   ├── board-create/      # Board creation form
│   │   ├── board-view/        # Board display and message viewing
│   │   ├── board-edit/        # Board editing form
│   │   └── message-create/    # Message creation form
│   ├── models/
│   │   ├── board.ts           # Board data model
│   │   ├── message.ts         # Message data model
│   │   └── theme.ts           # Theme data model
│   ├── services/
│   │   ├── board.service.ts   # Board CRUD operations
│   │   └── storage.service.ts # LocalStorage wrapper
│   ├── app-routing.module.ts  # Application routes
│   └── app.module.ts          # Root module
├── assets/                    # Static assets
├── environments/              # Environment configurations
└── styles.scss               # Global styles
```

## Usage Guide

### Creating a Board

1. Click "Create Board" from the home page or navigation
2. Fill in the board details:
   - **Title**: Give your board a catchy name
   - **Description**: Describe the celebration
   - **Occasion**: Select the type of event
   - **Recipient Name**: Who is this board for?
   - **Your Name**: Who is creating the board?
3. Choose a theme that matches your occasion
4. Click "Create Board"

### Adding Messages

1. Open any board
2. Click "Add Message"
3. Enter your name and message
4. Optionally upload a photo or video
5. Click "Add Message"

### Sharing a Board

1. Open the board you want to share
2. Click "Copy Link" to copy the shareable URL
3. Share the link with others
4. Recipients can view and add messages using the shared link

### Editing a Board

1. Open the board
2. Click "Edit Board"
3. Update any details or change the theme
4. Click "Save Changes"

### Exporting a Board

- **Print**: Click the "Print" button to open the print dialog
- **Download**: Use the print dialog and select "Save as PDF"

## Data Storage

EventBoard uses the browser's localStorage API to persist data. This means:
- No account or login required
- Data is stored locally in your browser
- Data persists across browser sessions
- Clearing browser data will delete boards
- Boards are not synced across devices

## Browser Compatibility

EventBoard works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with Angular 14
- Icons from Unicode emoji
- Gradient inspiration from UI Gradients

## Future Enhancements

Potential features for future versions:
- Backend integration for cross-device syncing
- User authentication
- More theme options
- Custom theme creation
- Advanced message formatting
- Reactions and comments on messages
- Email notifications
- Social media sharing
- Video recording within the app
- Collaborative editing
- Board templates

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ for celebrating special moments
