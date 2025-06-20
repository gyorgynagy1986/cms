"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Menu, 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Eye,
  Download,
  Upload,
  Bell,
  User,
  ChevronDown,
  Image,
  Video,
  MessageSquare,
  Heart,
  Share,
  MoreHorizontal,
  TrendingUp,
  Users2,
  ShoppingCart,
  DollarSign,
  Globe,
  Shield,
  Palette,
  Database,
  Mail,
  Lock,
  Monitor,
  Smartphone,
  Tablet,
  Activity,
  PieChart,
  LineChart,
  Server,
  Zap,
  Cloud,
  Code,
  Layers,
  Navigation,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Star,
  Flag,
  Tag,
  Link,
  ExternalLink,
  Save,
  Copy,
  Maximize2,
  Minimize2,
  Home,
  Archive,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart as RechartsBarChart, Bar, AreaChart, Area } from 'recharts';

// Mock data
const mockPosts = [
  {
    id: 1,
    title: "Új termékünk bemutatása",
    excerpt: "Izgalmas fejlesztésekkel készültünk az új évben. Termékünk forradalmi megoldásokat kínál...",
    author: "Kovács Anna",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    date: "2025-06-15",
    status: "published",
    views: 1234,
    comments: 15,
    likes: 89,
    shares: 23,
    readTime: 5,
    category: "Termékek",
    tags: ["új", "termék", "innováció"],
    featured: true,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    seoScore: 95,
    lastModified: "2025-06-16 10:30"
  },
  {
    id: 2,
    title: "Webfejlesztési trendek 2025-ben",
    excerpt: "Mit hozhat az új év a web világában? Áttekintjük a legfontosabb trendeket és technológiákat...",
    author: "Nagy Péter",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    date: "2025-06-12",
    status: "draft",
    views: 856,
    comments: 8,
    likes: 45,
    shares: 12,
    readTime: 8,
    category: "Teknológia",
    tags: ["webfejlesztés", "trendek", "2025"],
    featured: false,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
    seoScore: 78,
    lastModified: "2025-06-14 14:22"
  },
  {
    id: 3,
    title: "Ügyfélszolgálati újítások",
    excerpt: "Hogyan fejlesztettük szolgáltatásainkat az ügyfelek visszajelzései alapján. Új chatbot és AI...",
    author: "Szabó Mária",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    date: "2025-06-10",
    status: "published",
    views: 2103,
    comments: 23,
    likes: 156,
    shares: 34,
    readTime: 6,
    category: "Szolgáltatások",
    tags: ["ügyfélszolgálat", "AI", "chatbot"],
    featured: true,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop",
    seoScore: 88,
    lastModified: "2025-06-11 09:15"
  }
];

const mockUsers = [
  {
    id: 1,
    name: "Kovács Anna",
    email: "anna.kovacs@example.com",
    role: "Editor",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    lastLogin: "2025-06-20 09:30",
    posts: 12,
    status: "active",
    joinDate: "2024-03-15",
    permissions: ["create", "edit", "publish"],
    department: "Marketing",
    location: "Budapest"
  },
  {
    id: 2,
    name: "Nagy Péter",
    email: "peter.nagy@example.com",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    lastLogin: "2025-06-20 08:15",
    posts: 8,
    status: "active",
    joinDate: "2023-11-20",
    permissions: ["all"],
    department: "IT",
    location: "Debrecen"
  },
  {
    id: 3,
    name: "Szabó Mária",
    email: "maria.szabo@example.com",
    role: "Writer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    lastLogin: "2025-06-19 16:22",
    posts: 15,
    status: "active",
    joinDate: "2024-01-10",
    permissions: ["create", "edit"],
    department: "Content",
    location: "Szeged"
  }
];

const mockComments = [
  {
    id: 1,
    author: "Teszt User",
    email: "teszt@example.com",
    content: "Nagyon hasznos cikk! Köszönöm a megosztást. Mikor várható a következő rész?",
    postTitle: "Új termékünk bemutatása",
    postId: 1,
    date: "2025-06-19 14:30",
    status: "approved",
    ip: "192.168.1.100",
    userAgent: "Chrome 126.0",
    replies: 2
  },
  {
    id: 2,
    author: "Példa János",
    email: "pelda@example.com",
    content: "Mikor lesz elérhető ez a funkció? Nagyon várom már!",
    postTitle: "Webfejlesztési trendek 2025-ben",
    postId: 2,
    date: "2025-06-19 12:15",
    status: "pending",
    ip: "192.168.1.101",
    userAgent: "Firefox 115.0",
    replies: 0
  }
];

const analyticsData = [
  { name: 'Jan', látogatók: 4000, oldalmegtekintések: 12000, visszatérők: 2400 },
  { name: 'Feb', látogatók: 3000, oldalmegtekintések: 9800, visszatérők: 2210 },
  { name: 'Márc', látogatók: 2000, oldalmegtekintések: 7200, visszatérők: 2290 },
  { name: 'Ápr', látogatók: 2780, oldalmegtekintések: 8900, visszatérők: 2000 },
  { name: 'Máj', látogatók: 1890, oldalmegtekintések: 6500, visszatérők: 2181 },
  { name: 'Jún', látogatók: 2390, oldalmegtekintések: 8200, visszatérők: 2500 }
];

const deviceData = [
  { name: 'Desktop', value: 45, color: '#3B82F6' },
  { name: 'Mobil', value: 35, color: '#10B981' },
  { name: 'Tablet', value: 20, color: '#F59E0B' }
];

const trafficSources = [
  { name: 'Google', sessions: 3200, percentage: 45 },
  { name: 'Direkt', sessions: 2100, percentage: 30 },
  { name: 'Facebook', sessions: 980, percentage: 14 },
  { name: 'Twitter', sessions: 450, percentage: 6 },
  { name: 'Egyéb', sessions: 350, percentage: 5 }
];

// Components
const StatCard = ({ title, value, change, changeType, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp className={`mr-1 ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} size={16} />
          <span className={changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
            {changeType === 'positive' ? '+' : ''}{change}%
          </span>
          <span className="text-gray-500 ml-1">az elmúlt hónap</span>
        </div>
      )}
    </div>
  );
};

const QuickActions = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gyors műveletek</h3>
    <div className="grid grid-cols-2 gap-3">
      <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
        <Plus className="text-blue-600 mb-2" size={20} />
        <p className="font-medium text-gray-900">Új bejegyzés</p>
        <p className="text-xs text-gray-500">Tartalom létrehozása</p>
      </button>
      <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
        <Users className="text-green-600 mb-2" size={20} />
        <p className="font-medium text-gray-900">Felhasználó hozzáadása</p>
        <p className="text-xs text-gray-500">Új tag meghívása</p>
      </button>
      <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
        <Upload className="text-purple-600 mb-2" size={20} />
        <p className="font-medium text-gray-900">Fájl feltöltés</p>
        <p className="text-xs text-gray-500">Média hozzáadása</p>
      </button>
      <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
        <Settings className="text-orange-600 mb-2" size={20} />
        <p className="font-medium text-gray-900">Beállítások</p>
        <p className="text-xs text-gray-500">Rendszer konfiguráció</p>
      </button>
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Legutóbbi aktivitás</h3>
    <div className="space-y-4">
      {[
        { user: "Kovács Anna", action: "új bejegyzést publikált", time: "5 perce", color: "bg-green-100 text-green-800" },
        { user: "Nagy Péter", action: "felhasználót módosított", time: "12 perce", color: "bg-blue-100 text-blue-800" },
        { user: "Szabó Mária", action: "kommentet moderált", time: "23 perce", color: "bg-purple-100 text-purple-800" },
        { user: "System", action: "biztonsági mentés készült", time: "1 órája", color: "bg-gray-100 text-gray-800" }
      ].map((activity, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
            <Activity size={14} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{activity.user}</span> {activity.action}
            </p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SystemHealth = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendszer állapot</h3>
    <div className="space-y-4">
      {[
        { name: "Szerver", status: "online", value: "99.9%", color: "text-green-500" },
        { name: "Adatbázis", status: "online", value: "2.3s", color: "text-green-500" },
        { name: "Cache", status: "online", value: "89%", color: "text-yellow-500" },
        { name: "Backup", status: "online", value: "12h", color: "text-green-500" }
      ].map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${item.color === 'text-green-500' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-medium text-gray-900">{item.name}</span>
          </div>
          <span className="text-sm text-gray-500">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const SettingsSection = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const ToggleSwitch = ({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="font-medium text-gray-900">{label}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const CMS = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [posts, setPosts] = useState(mockPosts);
  const [users, setUsers] = useState(mockUsers);
  const [comments, setComments] = useState(mockComments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  
  // Settings states
  const [settings, setSettings] = useState({
    general: {
      siteName: 'AdminPanel CMS',
      tagline: 'Professzionális tartalomkezelő rendszer',
      language: 'hu',
      timezone: 'Europe/Budapest',
      dateFormat: 'Y-m-d',
      timeFormat: '24h'
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      accentColor: '#10B981',
      fontSize: 'medium',
      sidebarPosition: 'left',
      headerFixed: true,
      animations: true
    },
    security: {
      twoFactorAuth: true,
      passwordComplexity: true,
      sessionTimeout: 30,
      loginAttempts: 5,
      ipWhitelist: false,
      sslRequired: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      commentModeration: true,
      newUserRegistration: true,
      systemUpdates: true,
      backupAlerts: true
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      lazyLoading: true,
      imageOptimization: true,
      minifyCSS: true,
      minifyJS: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      cloudBackup: true,
      backupLocation: 'AWS S3'
    }
  });

  // Stats calculation
  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    draftPosts: posts.filter(p => p.status === 'draft').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0),
    totalComments: posts.reduce((sum, post) => sum + post.comments, 0),
    pendingComments: comments.filter(c => c.status === 'pending').length,
    approvedComments: comments.filter(c => c.status === 'approved').length,
    totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
    totalShares: posts.reduce((sum, post) => sum + post.shares, 0),
    avgReadTime: Math.round(posts.reduce((sum, post) => sum + post.readTime, 0) / posts.length),
    avgSeoScore: Math.round(posts.reduce((sum, post) => sum + post.seoScore, 0) / posts.length)
  };

  const navigation = [
    { name: 'Dashboard', icon: BarChart3, key: 'dashboard', badge: null },
    { name: 'Bejegyzések', icon: FileText, key: 'posts', badge: stats.draftPosts },
    { name: 'Felhasználók', icon: Users, key: 'users', badge: null },
    { name: 'Kommentek', icon: MessageSquare, key: 'comments', badge: stats.pendingComments },
    { name: 'Média', icon: Image, key: 'media', badge: null },
    { name: 'Analitika', icon: TrendingUp, key: 'analytics', badge: null },
    { name: 'Beállítások', icon: Settings, key: 'settings', badge: null }
  ];

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-gray-900 to-gray-800 h-screen transition-all duration-300 fixed left-0 top-0 z-30 shadow-2xl`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${!sidebarOpen && 'hidden'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="text-white" size={20} />
            </div>
            <h1 className="text-white font-bold text-xl">AdminPanel</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      <nav className="mt-8 px-2">
        {navigation.map((item) => (
          <button
            key={item.key}
            onClick={() => setCurrentView(item.key)}
            className={`w-full flex items-center justify-between px-3 py-3 mb-1 text-left rounded-lg hover:bg-gray-700 transition-colors ${
              currentView === item.key ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <item.icon size={20} />
              <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>{item.name}</span>
            </div>
            {item.badge && sidebarOpen && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-white text-sm font-medium">Rendszer OK</span>
            </div>
            <div className="text-xs text-gray-400">
              Utolsó frissítés: most
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const Header = () => (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 backdrop-blur-sm bg-white/95 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900 capitalize">
            {currentView === 'dashboard' ? 'Áttekintés' : 
             currentView === 'posts' ? 'Bejegyzések' :
             currentView === 'users' ? 'Felhasználók' :
             currentView === 'comments' ? 'Kommentek' :
             currentView === 'media' ? 'Média' : 
             currentView === 'analytics' ? 'Analitika' : 'Beállítások'}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>{new Date().toLocaleString('hu-HU')}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Keresés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt="Profile"
              className="w-8 h-8 rounded-full ring-2 ring-blue-500"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Nagy Péter</p>
              <p className="text-gray-500">Administrator</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );

  const Dashboard = () => (
    <div className="p-6 space-y-6">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Összes bejegyzés"
          value={stats.totalPosts}
          change={12}
          changeType="positive"
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Összes megtekintés"
          value={stats.totalViews.toLocaleString()}
          change={8}
          changeType="positive"
          icon={Eye}
          color="green"
        />
        <StatCard
          title="Aktív felhasználók"
          value={stats.activeUsers}
          change={5}
          changeType="positive"
          icon={Users2}
          color="purple"
        />
        <StatCard
          title="Függő kommentek"
          value={stats.pendingComments}
          change={-15}
          changeType="negative"
          icon={MessageSquare}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Összesen like"
          value={stats.totalLikes}
          change={18}
          changeType="positive"
          icon={Heart}
          color="red"
        />
        <StatCard
          title="Megosztások"
          value={stats.totalShares}
          change={22}
          changeType="positive"
          icon={Share}
          color="indigo"
        />
        <StatCard
          title="Átlag olvasási idő"
          value={`${stats.avgReadTime} perc`}
          change={3}
          changeType="positive"
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Átlag SEO pontszám"
          value={`${stats.avgSeoScore}%`}
          change={7}
          changeType="positive"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Látogatói statisztikák</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="látogatók" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="oldalmegtekintések" stroke="#10B981" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eszköz megoszlás</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Tooltip />
              <RechartsPieChart data={deviceData}>
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity and Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions />
        <RecentActivity />
        <SystemHealth />
      </div>
    </div>
  );

  const PostsView = () => {
    const filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-sm">
              <Plus size={16} />
              <span>Új bejegyzés</span>
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors">
              <Filter size={16} />
              <span>Szűrés</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Nézet:</span>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <BarChart3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Layers size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {filteredPosts.length} bejegyzés
            </span>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Upload size={16} />
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bejegyzés
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Szerző
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategória
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Státusz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statisztikák
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SEO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Műveletek
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {post.title}
                              {post.featured && <Star className="ml-2 text-yellow-500" size={14} />}
                            </div>
                            <div className="text-sm text-gray-500">{post.excerpt.substring(0, 50)}...</div>
                            <div className="flex items-center space-x-2 mt-1">
                              {post.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-900">{post.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${
                          post.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status === 'published' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                          {post.status === 'published' ? 'Közzétéve' : 'Piszkozat'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Eye size={14} className="mr-1" />
                              {post.views}
                            </div>
                            <div className="flex items-center">
                              <MessageSquare size={14} className="mr-1" />
                              {post.comments}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Heart size={14} className="mr-1" />
                              {post.likes}
                            </div>
                            <div className="flex items-center">
                              <Share size={14} className="mr-1" />
                              {post.shares}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            post.seoScore >= 90 ? 'bg-green-100 text-green-800' :
                            post.seoScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {post.seoScore}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                            <Edit size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                            <Eye size={16} />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded">
                            <Copy size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  {post.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Star size={12} className="mr-1" />
                      Kiemelt
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs ${
                    post.status === 'published' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {post.status === 'published' ? 'Élő' : 'Piszkozat'}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {post.category}
                    </span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      post.seoScore >= 90 ? 'bg-green-100 text-green-800' :
                      post.seoScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {post.seoScore}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-5 h-5 rounded-full mr-2"
                      />
                      {post.author}
                    </div>
                    <span>{post.date}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Eye size={12} className="mr-1" />
                      {post.views}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare size={12} className="mr-1" />
                      {post.comments}
                    </div>
                    <div className="flex items-center">
                      <Heart size={12} className="mr-1" />
                      {post.likes}
                    </div>
                    <div className="flex items-center">
                      <Share size={12} className="mr-1" />
                      {post.shares}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                        <Edit size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded">
                        <Copy size={16} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const UsersView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={16} />
            <span>Új felhasználó</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            <span>Szűrés</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Felhasználó
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Szerep
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Részleg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Helyszín
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utolsó bejelentkezés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktivitás
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div className={`absolute bottom-0 right-3 w-3 h-3 rounded-full border-2 border-white ${
                          user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">Csatlakozott: {user.joinDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'Admin' 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === 'Editor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.posts} bejegyzés</div>
                    <div className="text-xs text-gray-500">
                      {user.permissions.length} jogosultság
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                        <Edit size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                        <Mail size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="p-6 space-y-6">
      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Egyedi látogatók"
          value="24,847"
          change={12}
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Oldalmegtekintések"
          value="89,432"
          change={8}
          changeType="positive"
          icon={Eye}
          color="green"
        />
        <StatCard
          title="Átlagos tartózkodási idő"
          value="4:23"
          change={15}
          changeType="positive"
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="Visszafordulási arány"
          value="32.4%"
          change={-5}
          changeType="positive"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Látogatói forgalom</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="látogatók" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="visszatérők" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Forgalom források</h3>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    source.name === 'Google' ? 'bg-blue-500' :
                    source.name === 'Direkt' ? 'bg-green-500' :
                    source.name === 'Facebook' ? 'bg-blue-600' :
                    source.name === 'Twitter' ? 'bg-sky-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{source.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">{source.sessions.toLocaleString()}</span>
                  <span className="text-sm font-medium text-gray-900">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device and Location Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eszköz típusok</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Tooltip />
              <RechartsPieChart data={deviceData}>
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {deviceData.map((device, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }}></div>
                  <span>{device.name}</span>
                </div>
                <span className="font-medium">{device.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top országok</h3>
          <div className="space-y-3">
            {[
              { country: 'Magyarország', percentage: 78, flag: '🇭🇺' },
              { country: 'Németország', percentage: 12, flag: '🇩🇪' },
              { country: 'Ausztria', percentage: 5, flag: '🇦🇹' },
              { country: 'Románia', percentage: 3, flag: '🇷🇴' },
              { country: 'Egyéb', percentage: 2, flag: '🌍' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.flag}</span>
                  <span className="text-sm font-medium text-gray-900">{item.country}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Valós idejű</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Aktív felhasználók</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold text-gray-900">127</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Oldalak / munkamenet</span>
              <span className="text-lg font-semibold text-gray-900">3.2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Átlagos munkamenet</span>
              <span className="text-lg font-semibold text-gray-900">2:45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mai új látogatók</span>
              <span className="text-lg font-semibold text-gray-900">1,234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => {
    const updateSetting = (section, key, value) => {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    };

    return (
      <div className="p-6 max-w-4xl">
        {/* General Settings */}
        <SettingsSection title="Általános beállítások">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oldal neve
              </label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={settings.general.tagline}
                onChange={(e) => updateSetting('general', 'tagline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nyelv
              </label>
              <select
                value={settings.general.language}
                onChange={(e) => updateSetting('general', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hu">Magyar</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Időzóna
              </label>
              <select
                value={settings.general.timezone}
                onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Europe/Budapest">Budapest</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Berlin">Berlin</option>
                <option value="America/New_York">New York</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dátum formátum
              </label>
              <select
                value={settings.general.dateFormat}
                onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Y-m-d">2025-06-20</option>
                <option value="d/m/Y">20/06/2025</option>
                <option value="m/d/Y">06/20/2025</option>
                <option value="d.m.Y">20.06.2025</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idő formátum
              </label>
              <select
                value={settings.general.timeFormat}
                onChange={(e) => updateSetting('general', 'timeFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">24 órás (14:30)</option>
                <option value="12h">12 órás (2:30 PM)</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* Appearance Settings */}
        <SettingsSection title="Megjelenés">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téma
              </label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Világos</option>
                <option value="dark">Sötét</option>
                <option value="auto">Automatikus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elsődleges szín
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kiegészítő szín
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.appearance.accentColor}
                  onChange={(e) => updateSetting('appearance', 'accentColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.appearance.accentColor}
                  onChange={(e) => updateSetting('appearance', 'accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Betűméret
              </label>
              <select
                value={settings.appearance.fontSize}
                onChange={(e) => updateSetting('appearance', 'fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Kicsi</option>
                <option value="medium">Közepes</option>
                <option value="large">Nagy</option>
              </select>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <ToggleSwitch
              label="Fix fejléc"
              description="A fejléc mindig látható marad görgetéskor"
              enabled={settings.appearance.headerFixed}
              onChange={(value) => updateSetting('appearance', 'headerFixed', value)}
            />
            <ToggleSwitch
              label="Animációk"
              description="Smooth átmenetek és animációk engedélyezése"
              enabled={settings.appearance.animations}
              onChange={(value) => updateSetting('appearance', 'animations', value)}
            />
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection title="Biztonság">
          <div className="space-y-4">
            <ToggleSwitch
              label="Kétfaktoros hitelesítés"
              description="Extra biztonsági réteg a bejelentkezéshez"
              enabled={settings.security.twoFactorAuth}
              onChange={(value) => updateSetting('security', 'twoFactorAuth', value)}
            />
            <ToggleSwitch
              label="Jelszó komplexitás"
              description="Erős jelszavak megkövetelése"
              enabled={settings.security.passwordComplexity}
              onChange={(value) => updateSetting('security', 'passwordComplexity', value)}
            />
            <ToggleSwitch
              label="SSL kötelező"
              description="HTTPS kapcsolat kikényszerítése"
              enabled={settings.security.sslRequired}
              onChange={(value) => updateSetting('security', 'sslRequired', value)}
            />
            <ToggleSwitch
              label="IP whitelist"
              description="Csak engedélyezett IP címek hozzáférése"
              enabled={settings.security.ipWhitelist}
              onChange={(value) => updateSetting('security', 'ipWhitelist', value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Munkamenet időtúllépés (perc)
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="1440"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max. bejelentkezési kísérletek
              </label>
              <input
                type="number"
                value={settings.security.loginAttempts}
                onChange={(e) => updateSetting('security', 'loginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="3"
                max="10"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection title="Értesítések">
          <div className="space-y-4">
            <ToggleSwitch
              label="Email értesítések"
              description="Értesítések küldése emailben"
              enabled={settings.notifications.emailNotifications}
              onChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
            />
            <ToggleSwitch
              label="Push értesítések"
              description="Böngésző push értesítések"
              enabled={settings.notifications.pushNotifications}
              onChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
            />
            <ToggleSwitch
              label="Komment moderáció"
              description="Értesítés új kommenteknél"
              enabled={settings.notifications.commentModeration}
              onChange={(value) => updateSetting('notifications', 'commentModeration', value)}
            />
            <ToggleSwitch
              label="Új felhasználó regisztráció"
              description="Értesítés új regisztrációknál"
              enabled={settings.notifications.newUserRegistration}
              onChange={(value) => updateSetting('notifications', 'newUserRegistration', value)}
            />
            <ToggleSwitch
              label="Rendszer frissítések"
              description="Értesítés rendszer frissítésekről"
              enabled={settings.notifications.systemUpdates}
              onChange={(value) => updateSetting('notifications', 'systemUpdates', value)}
            />
            <ToggleSwitch
              label="Backup riasztások"
              description="Értesítés backup státuszról"
              enabled={settings.notifications.backupAlerts}
              onChange={(value) => updateSetting('notifications', 'backupAlerts', value)}
            />
          </div>
        </SettingsSection>

        {/* Performance Settings */}
        <SettingsSection title="Teljesítmény">
          <div className="space-y-4">
            <ToggleSwitch
              label="Cache engedélyezése"
              description="Gyorsabb oldal betöltés cache-sel"
              enabled={settings.performance.cacheEnabled}
              onChange={(value) => updateSetting('performance', 'cacheEnabled', value)}
            />
            <ToggleSwitch
              label="Tömörítés"
              description="Automatikus fájl tömörítés"
              enabled={settings.performance.compressionEnabled}
              onChange={(value) => updateSetting('performance', 'compressionEnabled', value)}
            />
            <ToggleSwitch
              label="Lazy loading"
              description="Képek késleltetett betöltése"
              enabled={settings.performance.lazyLoading}
              onChange={(value) => updateSetting('performance', 'lazyLoading', value)}
            />
            <ToggleSwitch
              label="Kép optimalizálás"
              description="Automatikus kép tömörítés és átméretezés"
              enabled={settings.performance.imageOptimization}
              onChange={(value) => updateSetting('performance', 'imageOptimization', value)}
            />
            <ToggleSwitch
              label="CSS minifikálás"
              description="CSS fájlok tömörítése"
              enabled={settings.performance.minifyCSS}
              onChange={(value) => updateSetting('performance', 'minifyCSS', value)}
            />
            <ToggleSwitch
              label="JavaScript minifikálás"
              description="JS fájlok tömörítése"
              enabled={settings.performance.minifyJS}
              onChange={(value) => updateSetting('performance', 'minifyJS', value)}
            />
          </div>
        </SettingsSection>

        {/* Backup Settings */}
        <SettingsSection title="Biztonsági mentés">
          <div className="space-y-4">
            <ToggleSwitch
              label="Automatikus backup"
              description="Rendszeres automatikus mentések"
              enabled={settings.backup.autoBackup}
              onChange={(value) => updateSetting('backup', 'autoBackup', value)}
            />
            <ToggleSwitch
              label="Felhő backup"
              description="Mentések tárolása a felhőben"
              enabled={settings.backup.cloudBackup}
              onChange={(value) => updateSetting('backup', 'cloudBackup', value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup gyakoriság
              </label>
              <select
                value={settings.backup.backupFrequency}
                onChange={(e) => updateSetting('backup', 'backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">Óránként</option>
                <option value="daily">Naponta</option>
                <option value="weekly">Hetente</option>
                <option value="monthly">Havonta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mentések megőrzése (nap)
              </label>
              <input
                type="number"
                value={settings.backup.backupRetention}
                onChange={(e) => updateSetting('backup', 'backupRetention', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="365"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup helyszín
              </label>
              <select
                value={settings.backup.backupLocation}
                onChange={(e) => updateSetting('backup', 'backupLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="local">Helyi szerver</option>
                <option value="AWS S3">AWS S3</option>
                <option value="Google Cloud">Google Cloud</option>
                <option value="Dropbox">Dropbox</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* Save Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Mégse
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Save size={16} />
            <span>Beállítások mentése</span>
          </button>
        </div>
      </div>
    );
  };

  const CommentsView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            <span>Szűrés</span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Státusz:</span>
            <select className="px-3 py-1 border border-gray-300 rounded text-sm">
              <option>Összes</option>
              <option>Jóváhagyva</option>
              <option>Függőben</option>
              <option>Spam</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Komment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bejegyzés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dátum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Státusz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">({comment.email})</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>IP: {comment.ip}</span>
                        <span>{comment.userAgent}</span>
                        {comment.replies > 0 && (
                          <span className="flex items-center">
                            <MessageSquare size={12} className="mr-1" />
                            {comment.replies} válasz
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href="#" className="text-blue-600 hover:text-blue-900 text-sm">
                      {comment.postTitle}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      comment.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : comment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {comment.status === 'approved' ? 'Jóváhagyva' : 
                       comment.status === 'pending' ? 'Függőben' : 'Spam'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {comment.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                        <Edit size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                        <MessageSquare size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const MediaView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <Upload size={16} />
            <span>Fájl feltöltés</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            <span>Szűrés</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Nézet:</span>
          <button className="p-2 bg-blue-100 text-blue-600 rounded">
            <Layers size={16} />
          </button>
          <button className="p-2 text-gray-400 rounded">
            <BarChart3 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { type: 'image', name: 'hero-image.jpg', size: '2.4 MB', date: '2025-06-20', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop' },
          { type: 'image', name: 'product-shot.png', size: '1.8 MB', date: '2025-06-19', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop' },
          { type: 'video', name: 'presentation.mp4', size: '45.2 MB', date: '2025-06-18', thumbnail: null },
          { type: 'document', name: 'report.pdf', size: '3.1 MB', date: '2025-06-17', thumbnail: null },
          { type: 'image', name: 'team-photo.jpg', size: '4.2 MB', date: '2025-06-16', thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200&h=200&fit=crop' },
          { type: 'image', name: 'logo-variants.svg', size: '156 KB', date: '2025-06-15', thumbnail: null }
        ].map((file, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {file.thumbnail ? (
                <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400">
                  {file.type === 'video' ? <Video size={48} /> :
                   file.type === 'document' ? <FileText size={48} /> :
                   <Image size={48} />}
                </div>
              )}
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-900 text-sm truncate">{file.name}</h4>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>{file.size}</span>
                <span>{file.date}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-1">
                  <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                    <Eye size={14} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                    <Download size={14} />
                  </button>
                  <button className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded">
                    <Copy size={14} />
                  </button>
                </div>
                <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'posts':
        return <PostsView />;
      case 'users':
        return <UsersView />;
      case 'comments':
        return <CommentsView />;
      case 'media':
        return <MediaView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <Header />
        <main>
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default CMS;