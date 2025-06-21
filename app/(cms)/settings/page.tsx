"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SettingsSection, ToggleSwitch } from "@/components/cms/settings-components"
import { Save, Moon, Sun, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { SettingsIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SettingsState {
  general: {
    siteName: string
    tagline: string
    language: string
    timezone: string
    dateFormat: string
    timeFormat: string
  }
  appearance: {
    primaryColor: string
    accentColor: string
    fontSize: string
    headerFixed: boolean
    animations: boolean
  }
  security: {
    twoFactorAuth: boolean
    passwordComplexity: boolean
    sessionTimeout: number
    loginAttempts: number
    ipWhitelist: boolean
    sslRequired: boolean
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    commentModeration: boolean
    newUserRegistration: boolean
    systemUpdates: boolean
    backupAlerts: boolean
  }
  performance: {
    cacheEnabled: boolean
    compressionEnabled: boolean
    lazyLoading: boolean
    imageOptimization: boolean
    minifyCSS: boolean
    minifyJS: boolean
  }
  backup: {
    autoBackup: boolean
    backupFrequency: string
    backupRetention: number
    cloudBackup: boolean
    backupLocation: string
  }
}

export default function SettingsPage() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["general"]))
  
  const [settings, setSettings] = useState<SettingsState>({
    general: {
      siteName: "AdminPanel CMS",
      tagline: "Professzionális tartalomkezelő rendszer",
      language: "hu",
      timezone: "Europe/Budapest",
      dateFormat: "Y-m-d",
      timeFormat: "24h",
    },
    appearance: {
      primaryColor: "#3B82F6",
      accentColor: "#10B981",
      fontSize: "medium",
      headerFixed: true,
      animations: true,
    },
    security: {
      twoFactorAuth: true,
      passwordComplexity: true,
      sessionTimeout: 30,
      loginAttempts: 5,
      ipWhitelist: false,
      sslRequired: true,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      commentModeration: true,
      newUserRegistration: true,
      systemUpdates: true,
      backupAlerts: true,
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      lazyLoading: true,
      imageOptimization: true,
      minifyCSS: true,
      minifyJS: true,
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      backupRetention: 30,
      cloudBackup: true,
      backupLocation: "AWS S3",
    },
  })

  useEffect(() => {
    setMounted(true)
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const updateSetting = (section: keyof SettingsState, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: value,
      },
    }))
  }

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const handleSaveSettings = () => {
    console.log("Settings saved:", settings)
    toast({
      title: "Beállítások mentve",
      description: "A módosítások sikeresen mentésre kerültek.",
    })
  }

  const MobileSettingsSection = ({ 
    id, 
    title, 
    children, 
    defaultOpen = false 
  }: { 
    id: string
    title: string
    children: React.ReactNode
    defaultOpen?: boolean 
  }) => {
    const isOpen = openSections.has(id)
    
    return (
      <Collapsible open={isOpen} onOpenChange={() => toggleSection(id)}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="flex w-full justify-between items-center p-4 h-auto text-left"
          >
            <span className="font-medium text-base">{title}</span>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg p-4 space-y-4">
          {children}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  const DesktopSettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <SettingsSection title={title}>{children}</SettingsSection>
  )

  const SectionWrapper = isMobile ? MobileSettingsSection : DesktopSettingsSection

  // Prevent hydration mismatch by not rendering theme-related content until mounted
  // if (!mounted) {
  //   return (
  //     <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
  //       <div className="animate-pulse space-y-4">
  //         <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
  //         <div className="space-y-3">
  //           <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
  //           <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
  //           <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  //         </div>
  //         <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-8"></div>
  //         <div className="space-y-3">
  //           <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
  //           <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
      {/* General Settings */}
      <SectionWrapper id="general" title="Általános beállítások">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Oldal neve</label>
            <Input
              value={settings.general.siteName}
              onChange={(e) => updateSetting("general", "siteName", e.target.value)}
              className="text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tagline</label>
            <Input
              value={settings.general.tagline}
              onChange={(e) => updateSetting("general", "tagline", e.target.value)}
              className="text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nyelv</label>
            <Select
              value={settings.general.language}
              onValueChange={(value) => updateSetting("general", "language", value)}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Nyelv" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hu">Magyar</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Időzóna</label>
            <Select
              value={settings.general.timezone}
              onValueChange={(value) => updateSetting("general", "timezone", value)}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Időzóna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Budapest">Budapest</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Berlin">Berlin</SelectItem>
                <SelectItem value="America/New_York">New York</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Dátum formátum</label>
            <Select
              value={settings.general.dateFormat}
              onValueChange={(value) => updateSetting("general", "dateFormat", value)}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Dátum formátum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Y-m-d">2025-06-20</SelectItem>
                <SelectItem value="d/m/Y">20/06/2025</SelectItem>
                <SelectItem value="m/d/Y">06/20/2025</SelectItem>
                <SelectItem value="d.m.Y">20.06.2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Idő formátum</label>
            <Select
              value={settings.general.timeFormat}
              onValueChange={(value) => updateSetting("general", "timeFormat", value)}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Idő formátum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 órás (14:30)</SelectItem>
                <SelectItem value="12h">12 órás (2:30 PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionWrapper>

      {/* Appearance Settings */}
      <SectionWrapper id="appearance" title="Megjelenés">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Téma</label>
            {mounted ? (
              <Select value={theme || "system"} onValueChange={(value) => setTheme(value)}>
                <SelectTrigger className="text-sm md:text-base">
                  <SelectValue placeholder="Téma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Sun className="mr-2 h-4 w-4" /> Világos
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="mr-2 h-4 w-4" /> Sötét
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center">
                      <SettingsIcon className="mr-2 h-4 w-4" /> Rendszer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Betűméret</label>
            <Select
              value={settings.appearance.fontSize}
              onValueChange={(value) => updateSetting("appearance", "fontSize", value)}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Betűméret" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Kicsi</SelectItem>
                <SelectItem value="medium">Közepes</SelectItem>
                <SelectItem value="large">Nagy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Elsődleges szín</label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={settings.appearance.primaryColor}
                onChange={(e) => updateSetting("appearance", "primaryColor", e.target.value)}
                className="w-12 h-10 p-1 flex-shrink-0"
              />
              <Input
                value={settings.appearance.primaryColor}
                onChange={(e) => updateSetting("appearance", "primaryColor", e.target.value)}
                className="text-sm md:text-base"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-6 space-y-3">
          <ToggleSwitch
            label="Fix fejléc"
            description="A fejléc mindig látható marad görgetéskor"
            enabled={settings.appearance.headerFixed}
            onChange={(value) => updateSetting("appearance", "headerFixed", value)}
          />
          <ToggleSwitch
            label="Animációk"
            description="Smooth átmenetek és animációk engedélyezése"
            enabled={settings.appearance.animations}
            onChange={(value) => updateSetting("appearance", "animations", value)}
          />
        </div>
      </SectionWrapper>

      {/* Security Settings */}
      <SectionWrapper id="security" title="Biztonság">
        <div className="space-y-3">
          <ToggleSwitch
            label="Kétfaktoros hitelesítés"
            description="Extra biztonsági réteg a bejelentkezéshez"
            enabled={settings.security.twoFactorAuth}
            onChange={(value) => updateSetting("security", "twoFactorAuth", value)}
          />
          <ToggleSwitch
            label="Jelszó komplexitás"
            description="Erős jelszavak megkövetelése"
            enabled={settings.security.passwordComplexity}
            onChange={(value) => updateSetting("security", "passwordComplexity", value)}
          />
          <ToggleSwitch
            label="SSL kötelező"
            description="HTTPS kapcsolat kikényszerítése"
            enabled={settings.security.sslRequired}
            onChange={(value) => updateSetting("security", "sslRequired", value)}
          />
          <ToggleSwitch
            label="IP whitelist"
            description="Csak engedélyezett IP címek hozzáférése"
            enabled={settings.security.ipWhitelist}
            onChange={(value) => updateSetting("security", "ipWhitelist", value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Munkamenet időtúllépés (perc)
            </label>
            <Input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSetting("security", "sessionTimeout", Number.parseInt(e.target.value))}
              min="5"
              max="1440"
              className="text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Max. bejelentkezési kísérletek
            </label>
            <Input
              type="number"
              value={settings.security.loginAttempts}
              onChange={(e) => updateSetting("security", "loginAttempts", Number.parseInt(e.target.value))}
              min="3"
              max="10"
              className="text-sm md:text-base"
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Notifications Settings */}
      <SectionWrapper id="notifications" title="Értesítések">
        <div className="space-y-3">
          <ToggleSwitch
            label="Email értesítések"
            description="Értesítések küldése emailben"
            enabled={settings.notifications.emailNotifications}
            onChange={(value) => updateSetting("notifications", "emailNotifications", value)}
          />
          <ToggleSwitch
            label="Push értesítések"
            description="Böngésző push értesítések"
            enabled={settings.notifications.pushNotifications}
            onChange={(value) => updateSetting("notifications", "pushNotifications", value)}
          />
          <ToggleSwitch
            label="Komment moderáció"
            description="Értesítés új kommenteknél"
            enabled={settings.notifications.commentModeration}
            onChange={(value) => updateSetting("notifications", "commentModeration", value)}
          />
          <ToggleSwitch
            label="Új felhasználó regisztráció"
            description="Értesítés új regisztrációknál"
            enabled={settings.notifications.newUserRegistration}
            onChange={(value) => updateSetting("notifications", "newUserRegistration", value)}
          />
          <ToggleSwitch
            label="Rendszer frissítések"
            description="Értesítés rendszer frissítésekről"
            enabled={settings.notifications.systemUpdates}
            onChange={(value) => updateSetting("notifications", "systemUpdates", value)}
          />
          <ToggleSwitch
            label="Backup riasztások"
            description="Értesítés backup státuszról"
            enabled={settings.notifications.backupAlerts}
            onChange={(value) => updateSetting("notifications", "backupAlerts", value)}
          />
        </div>
      </SectionWrapper>

      {/* Performance Settings */}
      <SectionWrapper id="performance" title="Teljesítmény">
        <div className="space-y-3">
          <ToggleSwitch
            label="Cache engedélyezése"
            description="Gyorsabb oldal betöltés cache-sel"
            enabled={settings.performance.cacheEnabled}
            onChange={(value) => updateSetting("performance", "cacheEnabled", value)}
          />
          <ToggleSwitch
            label="Tömörítés"
            description="Automatikus fájl tömörítés"
            enabled={settings.performance.compressionEnabled}
            onChange={(value) => updateSetting("performance", "compressionEnabled", value)}
          />
          <ToggleSwitch
            label="Lazy loading"
            description="Képek késleltetett betöltése"
            enabled={settings.performance.lazyLoading}
            onChange={(value) => updateSetting("performance", "lazyLoading", value)}
          />
          <ToggleSwitch
            label="Kép optimalizálás"
            description="Automatikus kép tömörítés és átméretezés"
            enabled={settings.performance.imageOptimization}
            onChange={(value) => updateSetting("performance", "imageOptimization", value)}
          />
          <ToggleSwitch
            label="CSS minifikálás"
            description="CSS fájlok tömörítése"
            enabled={settings.performance.minifyCSS}
            onChange={(value) => updateSetting("performance", "minifyCSS", value)}
          />
          <ToggleSwitch
            label="JavaScript minifikálás"
            description="JS fájlok tömörítése"
            enabled={settings.performance.minifyJS}
            onChange={(value) => updateSetting("performance", "minifyJS", value)}
          />
        </div>
      </SectionWrapper>

      {/* Backup Settings */}
      <SectionWrapper id="backup" title="Biztonsági mentés">
        <div className="space-y-3">
          <ToggleSwitch
            label="Automatikus backup"
            description="Rendszeres automatikus mentések"
            enabled={settings.backup.autoBackup}
            onChange={(value) => updateSetting("backup", "autoBackup", value)}
          />
          <ToggleSwitch
            label="Felhő backup"
            description="Mentések tárolása a felhőben"
            enabled={settings.backup.cloudBackup}
            onChange={(value) => updateSetting("backup", "cloudBackup", value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Backup gyakoriság</label>
            <Select
              value={settings.backup.backupFrequency}
              onValueChange={(value) => updateSetting("backup", "backupFrequency", value)}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Gyakoriság" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Óránként</SelectItem>
                <SelectItem value="daily">Naponta</SelectItem>
                <SelectItem value="weekly">Hetente</SelectItem>
                <SelectItem value="monthly">Havonta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mentések megőrzése (nap)
            </label>
            <Input
              type="number"
              value={settings.backup.backupRetention}
              onChange={(e) => updateSetting("backup", "backupRetention", Number.parseInt(e.target.value))}
              min="1"
              max="365"
              className="text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Backup helyszín</label>
            <Select
              value={settings.backup.backupLocation}
              onValueChange={(value) => updateSetting("backup", "backupLocation", value)}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Helyszín" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Helyi szerver</SelectItem>
                <SelectItem value="AWS S3">AWS S3</SelectItem>
                <SelectItem value="Google Cloud">Google Cloud</SelectItem>
                <SelectItem value="Dropbox">Dropbox</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionWrapper>

      {/* Save Button - Sticky on Mobile */}
      <div className={`
        flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 
        pt-4 md:pt-6 mt-4 md:mt-6 border-t border-gray-200 dark:border-gray-700
        ${isMobile ? 'sticky bottom-0 bg-background/95 backdrop-blur-sm pb-4' : ''}
      `}>
        <Button variant="outline" className="w-full sm:w-auto">
          Mégse
        </Button>
        <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
          <Save size={16} className="mr-2" />
          Beállítások mentése
        </Button>
      </div>
    </div>
  )
}