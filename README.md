# Journify - AI Journaling App

Journify is an AI journaling app for busy, growth-minded individuals to write daily entries that build their life story with fun and ease.

## Features

### Core Features
- **Daily Journaling**: Write text entries or use speech-to-text
- **Rich Text Editor**: Format text with various styling options
- **Mood Tracking**: Record your mood with each entry using emoji indicators
- **AI Prompts**: Get AI-generated writing prompts to inspire your entries
- **Tag System**: Organize entries with custom tags (folders, people, locations, hashtags)
- **Auto-tagging**: AI suggests relevant tags automatically
- **Highlights**: Mark special entries as highlights
- **Multiple Views**: Timeline, Calendar, Grid, and Stats views
- **Writing Analytics**: Track your writing stats and insights

### Advanced Features
- **Speech-to-Text**: Convert voice memos to text
- **Image/Video Attachments**: Add media to your entries
- **Gamification**: Level up system and currency (planned)
- **Dark/Light Mode**: Beautiful theme support
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Search**: Find entries quickly with powerful search
- **Export/Import**: Backup and restore your journal data

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### How to Use Entry Functionality

1. **Creating a New Entry**
   - Click the "New Entry" button in any view (Timeline, Calendar, or Grid)
   - Or use the sidebar navigation to create a new entry
   - The entry editor will open with a blank canvas

2. **Writing Your Entry**
   - Add a title (optional) at the top
   - Write your content in the main text area
   - Use AI prompts for inspiration (click the "AI Prompts" button)
   - Add voice notes using the "Voice" button (simulated)

3. **Adding Metadata**
   - Select your mood using the emoji buttons in the sidebar
   - Add tags by clicking on existing tags or creating new ones
   - Mark as highlight using the star button in the header

4. **Saving Your Entry**
   - Click the "Save" button or use ⌘S (Cmd+S on Mac, Ctrl+S on Windows)
   - Entries require content before they can be saved
   - Toast notifications will confirm successful save/update

5. **Viewing Your Entries**
   - **Timeline View**: Chronological list of all entries
   - **Calendar View**: Browse entries by date, click on dates to see entries
   - **Grid View**: Visual card layout with different size options
   - Click on any entry to edit it

6. **Managing Entries**
   - Edit entries by clicking the edit button or clicking on the entry
   - Delete entries using the trash button
   - Toggle highlights using the star button
   - Filter entries using the search and filter options

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd journify
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the following SQL to create the database schema:

   ```sql
   -- Create users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     avatar TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create journal_entries table
   CREATE TABLE journal_entries (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     title TEXT,
     content TEXT NOT NULL,
     mood TEXT CHECK (mood IN ('happy', 'sad', 'excited', 'calm', 'angry', 'neutral')),
     is_highlight BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create tags table
   CREATE TABLE tags (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     type TEXT CHECK (type IN ('folder', 'person', 'location', 'hashtag')),
     color TEXT,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create entry_tags junction table
   CREATE TABLE entry_tags (
     entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
     tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
     PRIMARY KEY (entry_id, tag_id)
   );

   -- Create attachments table
   CREATE TABLE attachments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
     type TEXT CHECK (type IN ('image', 'video', 'audio')),
     url TEXT NOT NULL,
     filename TEXT NOT NULL,
     size INTEGER NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
   ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
   ALTER TABLE entry_tags ENABLE ROW LEVEL SECURITY;
   ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

   -- Create RLS policies
   CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can view own entries" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own entries" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own entries" ON journal_entries FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own entries" ON journal_entries FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own tags" ON tags FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own tags" ON tags FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own tags" ON tags FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own tags" ON tags FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own entry tags" ON entry_tags FOR SELECT USING (
     EXISTS (SELECT 1 FROM journal_entries WHERE id = entry_tags.entry_id AND user_id = auth.uid())
   );
   CREATE POLICY "Users can insert own entry tags" ON entry_tags FOR INSERT WITH CHECK (
     EXISTS (SELECT 1 FROM journal_entries WHERE id = entry_tags.entry_id AND user_id = auth.uid())
   );
   CREATE POLICY "Users can delete own entry tags" ON entry_tags FOR DELETE USING (
     EXISTS (SELECT 1 FROM journal_entries WHERE id = entry_tags.entry_id AND user_id = auth.uid())
   );

   CREATE POLICY "Users can view own attachments" ON attachments FOR SELECT USING (
     EXISTS (SELECT 1 FROM journal_entries WHERE id = attachments.entry_id AND user_id = auth.uid())
   );
   CREATE POLICY "Users can insert own attachments" ON attachments FOR INSERT WITH CHECK (
     EXISTS (SELECT 1 FROM journal_entries WHERE id = attachments.entry_id AND user_id = auth.uid())
   );
   CREATE POLICY "Users can delete own attachments" ON attachments FOR DELETE USING (
     EXISTS (SELECT 1 FROM journal_entries WHERE id = attachments.entry_id AND user_id = auth.uid())
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
journify/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── views/          # View components (Timeline, Calendar, etc.)
│   │   ├── dashboard.tsx   # Main dashboard
│   │   ├── entry-editor.tsx # Journal entry editor
│   │   ├── header.tsx      # App header
│   │   └── sidebar.tsx     # Navigation sidebar
│   ├── lib/                # Utility functions
│   │   ├── utils.ts        # General utilities
│   │   └── supabase.ts     # Supabase client
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Key Components

### EntryEditor
The heart of the app, featuring:
- Rich text editing with auto-save
- Mood selection with emoji indicators
- Tag management with custom tag creation
- AI prompt integration for writing inspiration
- Speech-to-text simulation
- Image upload capability
- Keyboard shortcuts (⌘S to save, Esc to cancel)
- Toast notifications for user feedback

### TimelineView
Chronological view of journal entries with:
- Entry previews
- Mood indicators
- Tag display
- Highlight toggles
- Quick actions

### CalendarView
Calendar-based entry browsing with:
- Monthly calendar layout
- Entry indicators on dates
- Date selection for detailed view
- Navigation between months

### GridView
Visual grid layout with:
- Multiple grid sizes
- Card-based entry display
- Responsive design
- Quick editing access

### StatsView
Analytics dashboard showing:
- Writing statistics
- Mood distribution
- Tag usage
- Writing insights
- Progress tracking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

### Phase 1 (Current)
- ✅ Basic journaling functionality
- ✅ Multiple view modes
- ✅ Mood tracking
- ✅ Tag system
- ✅ Search and filtering
- ✅ Dark/light mode

### Phase 2 (Planned)
- 🔄 User authentication
- 🔄 Cloud sync with Supabase
- 🔄 Real speech-to-text integration
- 🔄 Image/video upload
- 🔄 Export/import functionality
- 🔄 Mobile app (React Native)

### Phase 3 (Future)
- 🔄 AI-powered insights
- 🔄 Gamification system
- 🔄 Social features
- 🔄 Advanced analytics
- 🔄 API for third-party integrations

## Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/your-repo/journify/issues) page
2. Create a new issue if your problem isn't already listed
3. Join our community discussions

---

Built with ❤️ using Next.js, React, and Supabase 
