# SmartCloset

A minimalist, mobile-responsive web application for managing your wardrobe and planning outfits with a "Quiet Luxury" aesthetic.

## Features

✨ **User Authentication** - Secure email/password login and registration

👔 **Digital Wardrobe** - Upload and organize your clothing items with photos

🔍 **Smart Search & Filter** - Easily find items by name or category

🎨 **Outfit Planner** - AI-powered outfit suggestions based on season and category

💾 **Save Outfits** - Keep track of your favorite combinations

📱 **Mobile Responsive** - Beautiful design on all devices

## Tech Stack

### Backend
- Node.js + Express
- SQLite database
- JWT authentication
- Multer for file uploads

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Custom CSS with "Quiet Luxury" design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartcloset
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

   Or manually:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

## Usage

### 1. Register/Login
- Create a new account or login with existing credentials
- Your session will persist for 7 days

### 2. Upload Clothes
- Click "Upload" in the navigation
- Select an image (max 5MB)
- Fill in item details:
  - **Item Name**: e.g., "White Cotton T-Shirt"
  - **Category**: Top, Bottom, Full-body, Shoes, or Outerwear
  - **Season**: Summer, Winter, or All
- Click "Add to Closet"

### 3. Browse Your Closet
- View all your items in a beautiful grid layout
- Use the search bar to find specific items
- Filter by category using the chips
- Delete items you no longer need

### 4. Plan Outfits
- Click "Home" to access the Outfit Planner
- Click "Suggest Outfit" to generate a random outfit
- The algorithm will:
  - Select either (1 Top + 1 Bottom) OR (1 Full-body item)
  - Add matching Shoes based on season
  - Optionally include Outerwear
- Click "Roll Again" for a new suggestion
- Click "Save Outfit" to keep your favorites

## Project Structure

```
smartcloset/
├── server/
│   ├── database/
│   │   ├── db.js              # Database setup
│   │   └── smartcloset.db     # SQLite database (auto-generated)
│   ├── routes/
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── clothes.js         # Clothes CRUD operations
│   │   └── outfit.js          # Outfit suggestion logic
│   ├── uploads/               # Uploaded images (auto-generated)
│   └── index.js               # Express server
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navigation.js
│       │   └── Navigation.css
│       ├── context/
│       │   └── AuthContext.js # Auth state management
│       ├── pages/
│       │   ├── LoginPage.js
│       │   ├── UploadPage.js
│       │   ├── ClosetPage.js
│       │   └── OutfitPlannerPage.js
│       ├── services/
│       │   └── api.js         # API service layer
│       ├── styles/
│       │   ├── index.css      # Global styles
│       │   └── App.css        # App-level styles
│       ├── App.js
│       └── index.js
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login

### Clothes
- `GET /api/clothes` - Get all clothes (with optional filters)
- `GET /api/clothes/:id` - Get single item
- `POST /api/clothes/upload` - Upload new item
- `PATCH /api/clothes/:id/wear` - Update last worn date
- `DELETE /api/clothes/:id` - Delete item

### Outfits
- `GET /api/outfit/suggest` - Get outfit suggestion
- `POST /api/outfit/save` - Save outfit
- `GET /api/outfit/saved` - Get saved outfits

## Design System

### Colors
- **Cream**: #F5F5F0 (Background)
- **Beige**: #E8E4DC
- **Soft Grey**: #D4D0C8
- **Warm Grey**: #A39B8B
- **Charcoal**: #3D3D3D
- **Black**: #1A1A1A

### Typography
- **Sans-serif**: Inter (UI elements)
- **Serif**: Crimson Pro (Headers)

### Design Principles
- Minimalist "Quiet Luxury" aesthetic
- Rounded corners and soft shadows
- Neutral color palette
- High-quality typography
- Smooth transitions and animations

## Future Enhancements

- [ ] Weather-based outfit suggestions
- [ ] Outfit history and analytics
- [ ] Social sharing features
- [ ] Advanced filtering (by color, brand, etc.)
- [ ] Virtual try-on
- [ ] Calendar integration
- [ ] Laundry tracking

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
