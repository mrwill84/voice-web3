"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const BookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

interface Contact {
  name: string
  address: string
}

const ADDRESS_BOOK_KEY = "voice-web3-address-book"

export function AddressManagement() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: "", address: "" })

  useEffect(() => {
    const stored = localStorage.getItem(ADDRESS_BOOK_KEY)
    if (stored) {
      setContacts(JSON.parse(stored))
    }
  }, [])

  const saveContacts = (newContacts: Contact[]) => {
    localStorage.setItem(ADDRESS_BOOK_KEY, JSON.stringify(newContacts))
    setContacts(newContacts)
  }

  const handleAdd = () => {
    const newContact = { name: formData.name, address: formData.address }
    saveContacts([...contacts, newContact])
    setFormData({ name: "", address: "" })
    setIsAdding(false)
  }

  const handleEdit = () => {
    if (editingIndex === null) return
    const updated = [...contacts]
    updated[editingIndex] = { name: formData.name, address: formData.address }
    saveContacts(updated)
    setEditingIndex(null)
    setFormData({ name: "", address: "" })
  }

  const handleDelete = () => {
    if (deleteIndex === null) return
    const updated = contacts.filter((_, i) => i !== deleteIndex)
    saveContacts(updated)
    setDeleteIndex(null)
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setFormData(contacts[index])
    setIsAdding(false)
  }

  const cancelForm = () => {
    setIsAdding(false)
    setEditingIndex(null)
    setFormData({ name: "", address: "" })
  }

  const isFormValid = formData.name.trim() && formData.address.trim()

  return (
    <div className="space-y-2">
      {/* Address Book Header - matches other menu items style */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start bg-transparent"
          onClick={() => setIsAdding(true)}
        >
          <BookIcon className="w-4 h-4 mr-2" />
          地址簿
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingIndex !== null) && (
        <div className="space-y-3 p-4 rounded-lg bg-muted/50">
          <div className="space-y-2">
            <Label htmlFor="contact-name" className="text-sm font-medium">
              联系人名称
            </Label>
            <Input
              id="contact-name"
              placeholder="输入联系人姓名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-address" className="text-sm font-medium">
              钱包地址
            </Label>
            <Input
              id="contact-address"
              placeholder="输入钱包地址"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="h-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={editingIndex !== null ? handleEdit : handleAdd}
              disabled={!isFormValid}
              className="flex-1"
            >
              {editingIndex !== null ? "保存" : "添加"}
            </Button>
            <Button size="sm" variant="outline" onClick={cancelForm} className="flex-1">
              取消
            </Button>
          </div>
        </div>
      )}

      {/* Contacts List */}
      {contacts.length > 0 && (
        <div className="space-y-2">
          <ScrollArea className="max-h-[200px]">
            <div className="space-y-1">
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {contact.address}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => startEdit(index)}
                    >
                      <PencilIcon className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteIndex(index)}
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Empty State */}
      {contacts.length === 0 && !isAdding && (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
            <BookIcon className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">暂无联系人</p>
          <p className="text-xs text-muted-foreground mt-1">点击上方"地址簿"按钮添加联系人</p>
        </div>
      )}

      <AlertDialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除联系人 "{deleteIndex !== null ? contacts[deleteIndex]?.name : ""}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

