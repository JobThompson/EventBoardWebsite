# Event Board Website - API Integration

This application has been updated to use API calls instead of browser localStorage for data persistence.

## Changes Made

### 1. Added HTTP Client Support
- Added `HttpClientModule` to `app.module.ts`
- Created `ApiService` to handle all HTTP communications

### 2. Updated Services
- **ApiService**: New service that handles all API calls to the backend
- **BoardService**: Updated to use `ApiService` instead of `StorageService`
- All methods now return Observables for proper async handling

### 3. Updated Components
All components have been updated to handle Observable responses:
- **BoardCreateComponent**: Handles async board creation
- **BoardEditComponent**: Handles async board updates
- **BoardViewComponent**: Handles async board and theme loading
- **HomeComponent**: Handles async board deletion
- **MessageCreateComponent**: Handles async message creation

### 4. Environment Configuration
- Added API endpoint configuration in environment files
- Development: `http://localhost:3000/api`
- Production: `https://your-production-api.com/api`

## Message Grid Layout

The application now uses a single number positioning system for messages instead of x/y coordinates. Messages are displayed in a grid layout with automatic wrapping.

### Configuration
- **Messages per row**: 4 (configurable in `MESSAGE_GRID_CONFIG`)
- **Responsive**: Automatically adjusts columns based on screen size
- **Auto-positioning**: New messages automatically get the next available position

### Grid Utilities
The `MessageGridUtils` class provides utilities for:
- Converting between position numbers and grid coordinates
- Finding the next available position
- Sorting messages by position
- Calculating responsive grid layouts

### Position Assignment
- New messages automatically get assigned the next available position
- Positions start at 0 and increment sequentially
- If a message is deleted, its position becomes available for reuse
- Messages without positions are displayed at the end

## API Endpoints Required

Your backend API should implement the following endpoints:

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get board by ID
- `GET /api/boards/share/:shareLink` - Get board by share link
- `POST /api/boards` - Create new board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Messages
- `GET /api/boards/:boardId/messages` - Get messages for a board
- `POST /api/boards/:boardId/messages` - Create new message
- `DELETE /api/boards/:boardId/messages/:messageId` - Delete message

### Themes
- `GET /api/themes` - Get all themes
- `GET /api/themes/:id` - Get theme by ID

## Data Models

### Board
```typescript
interface Board {
  id: string;
  title: string;
  description: string;
  occasion: string;
  recipientName: string;
  createdAt: Date;
  createdBy: string;
  themeId: string;
  shareLink: string;
  isPublic: boolean;
  messages: Message[];
}
```

### Message
```typescript
interface Message {
  id: string;
  boardId: string;
  authorName: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: Date;
  position?: number; // Grid position number (0-based), auto-assigned if not provided
}
```

### Theme
```typescript
interface Theme {
  id: string;
  name: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontFamily: string;
}
```

## Setup Instructions

1. **Update API Endpoint**: Edit `src/environments/environment.ts` and `src/environments/environment.prod.ts` to point to your actual API endpoints.

2. **Backend Setup**: Create a backend API that implements the endpoints listed above. You can use any technology stack (Node.js/Express, Python/FastAPI, .NET Core, etc.).

3. **CORS Configuration**: Make sure your backend allows CORS requests from your Angular application domain.

4. **Error Handling**: The application includes basic error handling, but you may want to implement more sophisticated error handling and user notifications.

## Example Backend Implementation (Node.js/Express)

Here's a basic example of what your backend endpoints might look like:

```javascript
// GET /api/boards
app.get('/api/boards', async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/boards
app.post('/api/boards', async (req, res) => {
  try {
    const board = new Board({
      ...req.body,
      id: generateId(),
      createdAt: new Date(),
      shareLink: generateShareLink(),
      messages: []
    });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## Development

1. Start your backend API server (typically on port 3000)
2. Run the Angular development server: `ng serve`
3. The application will make API calls to your backend

## Testing

The application includes updated unit tests for the new API service and updated board service. Run tests with:

```bash
ng test
```

## Notes

- All API calls include proper error handling
- The application maintains local caching through BehaviorSubjects for better performance
- Failed API calls will log errors to the console and can be extended to show user-friendly error messages
- File uploads are currently handled as base64 data URLs - you may want to implement proper file upload to your backend