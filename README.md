# Collaborative Whiteboard Platform

A real-time collaborative whiteboard application built with Next.js 15, enabling teams to brainstorm, plan, and visualize ideas together regardless of location.

🔗 **[Live Demo](https://real-time-board-app.vercel.app/)**

## 🖥️ Demo

Visit the live application: [https://real-time-board-app.vercel.app/](https://real-time-board-app.vercel.app/)

![Whiteboard Demo](https://via.placeholder.com/800x400)

Try out the collaborative features by opening the application in multiple browser windows or devices!

## 🌟 Features

- **Real-time Collaboration**: Multiple users can work on the same board simultaneously with Liveblocks
- **Team Organizations**: Create and manage team spaces for different projects or departments
- **Drawing Tools**: Comprehensive set of drawing and annotation tools for expressing ideas
- **Board Management**: Create, save, and organize multiple boards with Convex backend
- **Modern UI**: Clean, responsive interface built with Shadcn UI components
- **Authentication**: Secure user authentication through Clerk
- **User-friendly Interface**: Intuitive design for both technical and non-technical users

## 📋 Table of Contents

- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Authentication](#authentication)
- [Team Management](#team-management)
- [Board Creation](#board-creation)
- [Contributing](#contributing)
- [License](#license)

## 💻 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/whiteboard-platform.git

# Navigate to project directory
cd whiteboard-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Configure your environment variables for Clerk, Convex, and Liveblocks

# Start development server
npm run dev

# In a separate terminal, start the Convex development server
npx convex dev
```

## 🚀 Usage

After installation, the application will be available at `http://localhost:3000`. Alternatively, you can use the [live deployment](https://real-time-board-app.vercel.app/).

### Basic Workflow:

1. Sign in with your account using Clerk authentication
2. Create or join an organization
3. Create a new board or access existing ones
4. Use the drawing tools to collaborate in real-time
5. All changes are automatically saved to the Convex database and synchronized across users via Liveblocks

## ⚙️ Configuration

The application can be configured through environment variables in your `.env.local` file:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
CONVEX_DEPLOYMENT=your_convex_deployment_id

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
```

## 🔐 Authentication

The platform uses Clerk for authentication, which supports:
- Email/password authentication
- Social logins (Google, GitHub, etc.)
- Multi-factor authentication
- Organization-based access control
- User profile management

## 👥 Team Management

### Creating an Organization:
1. Navigate to the team boards page
2. Click "Create organization"
3. Upload a logo (optional)
4. Enter organization name and slug
5. Click "Create organization"

### Managing Team Members:
- Use the "Invite members" button to add new team members
- Assign different roles (Admin, Editor, Viewer)
- Manage access permissions for specific boards

## 📝 Board Creation

### Creating a New Board:
1. Navigate to your team boards dashboard
2. Click on the "New board" card
3. Start collaborating immediately with the drawing tools
4. All changes are automatically synchronized with other users in real-time through Liveblocks

### Drawing Tools:
- Selection tool
- Text tool
- Shape tools (rectangle, circle, line)
- Freehand drawing
- Sticky notes
- Color selector
- Undo/redo functionality

## 👨‍💻 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

### Development Setup:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Tech Stack Overview:
- **Frontend**: Next.js 15 (App Router)
- **UI Components**: Shadcn UI (Tailwind CSS)
- **Authentication**: Clerk
- **Database & Backend**: Convex
- **Real-time Collaboration**: Liveblocks


## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.dev/) - Authentication provider
- [Convex](https://www.convex.dev/) - Backend platform
- [Liveblocks](https://liveblocks.io/) - Real-time collaboration
- [Shadcn UI](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 🚀 Deployment

This application is deployed on Vercel. You can view the live version at:
[https://real-time-board-app.vercel.app/](https://real-time-board-app.vercel.app/)

To deploy your own instance:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel
```

Make sure to configure the necessary environment variables in your Vercel project settings.

---

Made with ❤️ by Aryan Kumar
