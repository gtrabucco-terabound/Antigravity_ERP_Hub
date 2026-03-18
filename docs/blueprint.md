# **App Name**: TerraLink Hub

## Core Features:

- Secure Authentication & Session Management: Handles user login/logout via Firebase Authentication, validates Firebase Custom Claims (tenantId, role, modules), and ensures secure, tenant-isolated access to application features.
- Dynamic Module Orchestration: Dynamically constructs the application's navigation and provides a module launcher based on the user's enabled modules and optional global module catalog metadata.
- Global Notifications Center: Displays tenant-wide notifications fetched from Firestore (_tn_notifications) with filtering and read/unread status management.
- Documents Management: Provides a central hub for viewing, filtering, and accessing tenant-specific documents from Firestore (_tn_documents).
- Activity & Audit Log Viewer: Presents a chronological view of recent tenant audit logs (_tn_audit_logs), showcasing actions, users, and timestamps.
- User Profile & Preferences: Allows users to customize UI settings (language, theme), manage their profile, and store preferences in Firestore (_hb_user_settings).
- Audit Log Insight Tool: An AI tool to analyze and categorize audit log entries or flag unusual activity patterns for enhanced visibility within the activity view.

## Style Guidelines:

- Primary color: A sophisticated, muted corporate blue (#37608C) to convey stability and professionalism, suitable for a light background.
- Background color: A very light, desaturated blue-grey (#EBF1F5) providing a clean, expansive, and enterprise-ready feel.
- Accent color: A vibrant yet professional cyan (#61DBDB) for clear call-to-actions, interactive elements, and highlights, offering strong contrast.
- Headlines and body text: 'Inter', a grotesque sans-serif with a modern, objective, and neutral aesthetic, suitable for enterprise applications.
- Use a consistent set of minimalist and professional icons that align with modern admin dashboard aesthetics.
- Clean, structured enterprise shell featuring a persistent left sidebar for navigation, a top header for tenant context and global actions (notifications, profile), and responsive design for various screen sizes.
- Implement subtle and functional animations for transitions, data loading, and interactive elements to enhance the user experience without distraction.