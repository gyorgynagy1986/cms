"use client"

import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, Mail, MoreHorizontal, MapPin, Building } from "lucide-react"
import type { User } from "@/lib/types"

interface UsersTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: string) => void
}

export default function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "Admin":
        return "destructive"
      case "Editor":
        return "default"
      case "Writer":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[250px]">Felhasználó</TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">Szerep</TableHead>
              <TableHead className="min-w-[120px] hidden lg:table-cell">Részleg</TableHead>
              <TableHead className="min-w-[80px] hidden md:table-cell">Státusz</TableHead>
              <TableHead className="text-right min-w-[80px]">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {/* User Column - Always visible, comprehensive on mobile */}
                <TableCell>
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={user.avatar_url || `/placeholder.svg?width=40&height=40&query=avatar`}
                        alt={user.name || "Felhasználó"}
                        width={32}
                        height={32}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          user.status === "active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm md:text-base">
                        {user.name}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </div>
                      
                      {/* Mobile info - Role, Department, Location */}
                      <div className="flex flex-wrap items-center gap-2 mt-2 md:hidden">
                        {/* Role on mobile */}
                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                          {user.role}
                        </Badge>
                        
                        {/* Status on mobile */}
                        <Badge variant={user.status === "active" ? "default" : "outline"} className="text-xs">
                          {user.status === "active" ? "Aktív" : "Inaktív"}
                        </Badge>
                      </div>
                      
                      {/* Department and Location on mobile */}
                      <div className="flex items-center gap-3 mt-1 md:hidden text-xs text-gray-500">
                        {user.department && (
                          <div className="flex items-center">
                            <Building size={10} className="mr-1" />
                            <span className="truncate max-w-20">{user.department}</span>
                          </div>
                        )}
                        {user.location && (
                          <div className="flex items-center">
                            <MapPin size={10} className="mr-1" />
                            <span className="truncate max-w-20">{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                {/* Role Column - Hidden on mobile */}
                <TableCell className="hidden md:table-cell">
                  <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs md:text-sm">
                    {user.role}
                  </Badge>
                </TableCell>
                
                {/* Department Column - Hidden on mobile/tablet */}
                <TableCell className="hidden lg:table-cell">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {user.department || "-"}
                  </div>
                  {user.location && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <MapPin size={12} className="mr-1" />
                      {user.location}
                    </div>
                  )}
                </TableCell>
                
                {/* Status Column - Hidden on mobile */}
                <TableCell className="hidden md:table-cell">
                  <Badge variant={user.status === "active" ? "default" : "outline"} className="text-xs md:text-sm">
                    {user.status === "active" ? "Aktív" : "Inaktív"}
                  </Badge>
                </TableCell>
                
                {/* Actions Column - Always visible, responsive */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit size={14} className="mr-2" /> Szerkesztés
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail size={14} className="mr-2" /> Email küldése
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(user.id)} 
                        className="text-red-600 hover:!text-red-600"
                      >
                        <Trash2 size={14} className="mr-2" /> Törlés
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}