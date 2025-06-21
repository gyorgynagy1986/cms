// lib/types.ts

export interface Profile {
  id: string // uuid, from auth.users
  name: string | null
  email: string | null // from auth.users, can be synced to profiles
  role: "Admin" | "Editor" | "Writer" | null
  avatar_url: string | null
  department: string | null
  location: string | null
  status: "active" | "inactive" | null
}

export interface Post {
  id: number // bigserial
  created_at: string // timestamptz
  last_modified: string // timestamptz
  author_id: string // uuid, FK to profiles.id
  title: string
  excerpt: string | null
  content?: string // Teljes tartalom, ha szükséges
  image: string | null
  status: "published" | "draft"
  views: number
  comments_count: number
  likes: number
  read_time: number | null
  category: string | null
  tags: string[] | null
  featured: boolean
  seo_score: number | null
  profiles?: {
    // Szerző adatai
    name: string | null
    avatar_url: string | null
  } | null
}

export type Comment = {
  id: number
  content: string
  created_at: string
  status: "approved" | "pending" | "spam"
  profiles?: {
    name?: string | null
    email?: string | null
    avatar_url?: string | null
  } | null
  posts?: {
    id: number
    title: string | null
  } | null
}

export interface Review {
  id: number // bigserial
  created_at: string // timestamptz
  author_id: string | null // uuid, FK to profiles.id
  rating: 1 | 2 | 3 | 4 | 5
  title: string | null
  content: string
  product_name: string | null
  product_id: string | null
  status: "approved" | "pending" | "rejected"

  // Joinolt adatok
  profiles?: {
    // Szerző adatai
    name: string | null
    avatar_url: string | null
  } | null
}

export interface AnalyticsChartData {
  name: string
  látogatók: number
  oldalmegtekintések?: number
  visszatérők?: number
}

export interface DeviceChartData {
  name: string
  value: number
  color: string
}

export interface TrafficSource {
  name: string
  sessions: number
  percentage: number
}

export interface FileObjectMetadata {
  size: number
  mimetype: string
  cacheControl: string
  // eTag, lastModified, httpStatusCode is available on FileObject, but might not be needed directly in MediaFile
}

export interface MediaFile {
  name: string // File name, e.g., "image.png"
  id: string | null // Bucket ID + file path, e.g., "media_library/image.png" - Supabase FileObject.id is usually null for listFiles
  path?: string // The actual path within the bucket, useful for deletion/URL generation
  url?: string // Public URL
  type?: string // Mimetype, e.g., "image/png", "video/mp4"
  size?: number // File size in bytes
  created_at?: string // ISO string
  updated_at?: string // ISO string
  last_accessed_at?: string // ISO string
  metadata?: FileObjectMetadata // Full metadata from Supabase
  thumbnail?: string // Could be same as url for images, or a placeholder/icon path
}

export interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalUsers: number
  activeUsers: number
  totalViews: number
  pendingComments: number
}

export type PostFormData = {
  title: string
  excerpt: string
  author: string
  date: string
  status: "published" | "draft"
  readTime: number
  category: string
  tags: string[]
  featured: boolean
  image?: string | null
  content?: string
}

export interface Profile {
  id: string
  name: string | null
  email: string | null
  role: "Admin" | "Editor" | "Writer" | null
  avatar_url: string | null
  department: string | null
  location: string | null
  status: "active" | "inactive" | null
}

// User type ami kompatibilis a Profile-lal
export interface User {
  id: string
  name: string | null
  email: string | null
  role: "Admin" | "Editor" | "Writer" | null
  avatar_url: string | null
  department: string | null
  location: string | null
  status: "active" | "inactive" | null
  password?: string // Csak új user létrehozáskor
}

export interface QuickActionsProps {
  openAddPostDialog: () => void
  disabled?: boolean
}


// Ha a komponens nem használja a típust, akkor:
interface AddPostDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: PostFormData) => Promise<void>
  // isLoading?: boolean <- ez hiányzik a tényleges komponensből
}