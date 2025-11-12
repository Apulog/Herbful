"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react"
import { useAuth } from "@/components/admin/auth-provider"
import { toast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"

export default function AccountPage() {
  const { user, updateUsername, updateEmail, updatePassword } = useAuth()
  const [showUsernameForm, setShowUsernameForm] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<"username" | "email" | "password" | null>(null)

  // Username change state
  const [newUsername, setNewUsername] = useState("")
  const [currentPasswordForUsername, setCurrentPasswordForUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [usernameLoading, setUsernameLoading] = useState(false)

  // Email change state
  const [newEmail, setNewEmail] = useState("")
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  const validateUsername = () => {
    if (!newUsername.trim()) {
      setUsernameError("Username is required")
      return false
    }
    if (newUsername.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters")
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setUsernameError("Username can only contain letters, numbers, and underscores")
      return false
    }
    if (!currentPasswordForUsername) {
      setUsernameError("Current password is required to change username")
      return false
    }
    return true
  }

  const validateEmail = () => {
    if (!newEmail.trim()) {
      setEmailError("Email is required")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail.trim())) {
      setEmailError("Please enter a valid email address")
      return false
    }
    if (newEmail.trim().toLowerCase() === user?.email.toLowerCase()) {
      setEmailError("New email must be different from current email")
      return false
    }
    if (!currentPasswordForEmail) {
      setEmailError("Current password is required to change email")
      return false
    }
    return true
  }

  const validatePassword = () => {
    if (!currentPassword) {
      setPasswordError("Current password is required")
      return false
    }
    if (!newPassword) {
      setPasswordError("New password is required")
      return false
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters")
      return false
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError("New password must contain at least one uppercase letter")
      return false
    }
    if (!/[0-9]/.test(newPassword)) {
      setPasswordError("New password must contain at least one number")
      return false
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return false
    }
    if (newPassword === currentPassword) {
      setPasswordError("New password must be different from current password")
      return false
    }
    return true
  }

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUsernameError("")

    if (!validateUsername()) {
      return
    }

    setPendingAction("username")
    setShowConfirmDialog(true)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")

    if (!validateEmail()) {
      return
    }

    setPendingAction("email")
    setShowConfirmDialog(true)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (!validatePassword()) {
      return
    }

    setPendingAction("password")
    setShowConfirmDialog(true)
  }

  const confirmUsernameChange = async () => {
    setUsernameLoading(true)

    try {
      const success = await updateUsername(newUsername, currentPasswordForUsername)

      if (success) {
        toast({
          title: "Success",
          description: "Username updated successfully. Please login again with your new username.",
        })
        setShowConfirmDialog(false)
        // Logout will happen automatically via the auth provider
      } else {
        toast({
          title: "Error",
          description: "Failed to update username. Please check your password.",
          variant: "destructive",
        })
        setShowConfirmDialog(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating username.",
        variant: "destructive",
      })
      setShowConfirmDialog(false)
    } finally {
      setUsernameLoading(false)
    }
  }

  const confirmEmailChange = async () => {
    setEmailLoading(true)

    try {
      const success = await updateEmail(newEmail.trim(), currentPasswordForEmail)

      if (success) {
        toast({
          title: "Success",
          description: "Email updated successfully.",
        })
        setShowConfirmDialog(false)
        resetEmailForm()
      } else {
        toast({
          title: "Error",
          description: "Failed to update email. Please check your password.",
          variant: "destructive",
        })
        setShowConfirmDialog(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating email.",
        variant: "destructive",
      })
      setShowConfirmDialog(false)
    } finally {
      setEmailLoading(false)
    }
  }

  const confirmPasswordChange = async () => {
    setPasswordLoading(true)

    try {
      const success = await updatePassword(currentPassword, newPassword)

      if (success) {
        toast({
          title: "Success",
          description: "Password updated successfully. Please login again with your new password.",
        })
        setShowConfirmDialog(false)
        // Logout will happen automatically via the auth provider
      } else {
        toast({
          title: "Error",
          description: "Failed to update password. Please check your current password.",
          variant: "destructive",
        })
        setShowConfirmDialog(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating password.",
        variant: "destructive",
      })
      setShowConfirmDialog(false)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleConfirm = () => {
    if (pendingAction === "username") {
      confirmUsernameChange()
    } else if (pendingAction === "email") {
      confirmEmailChange()
    } else if (pendingAction === "password") {
      confirmPasswordChange()
    }
  }

  const resetUsernameForm = () => {
    setNewUsername("")
    setCurrentPasswordForUsername("")
    setUsernameError("")
    setShowUsernameForm(false)
  }

  const resetEmailForm = () => {
    setNewEmail("")
    setCurrentPasswordForEmail("")
    setEmailError("")
    setShowEmailForm(false)
  }

  const resetPasswordForm = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setShowPasswordForm(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Manage your admin account credentials</p>
      </div>

      {/* Current User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium text-lg">{user?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Username */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Change Username
          </CardTitle>
          <CardDescription>Update your admin username</CardDescription>
        </CardHeader>
        <CardContent>
          {!showUsernameForm ? (
            <Button onClick={() => setShowUsernameForm(true)} variant="outline">
              Change Username
            </Button>
          ) : (
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              {usernameError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{usernameError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="newUsername">New Username</Label>
                <Input
                  id="newUsername"
                  type="text"
                  placeholder="Enter new username"
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value)
                    setUsernameError("")
                  }}
                  required
                />
                <p className="text-xs text-gray-500">
                  Username must be at least 3 characters and contain only letters, numbers, and underscores
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPasswordUsername">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentPasswordUsername"
                    type="password"
                    placeholder="Verify with current password"
                    value={currentPasswordForUsername}
                    onChange={(e) => {
                      setCurrentPasswordForUsername(e.target.value)
                      setUsernameError("")
                    }}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={usernameLoading}>
                  {usernameLoading ? "Updating..." : "Update Username"}
                </Button>
                <Button type="button" variant="outline" onClick={resetUsernameForm}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Change Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Change Email
          </CardTitle>
          <CardDescription>Update your admin email address</CardDescription>
        </CardHeader>
        <CardContent>
          {!showEmailForm ? (
            <Button onClick={() => setShowEmailForm(true)} variant="outline">
              Change Email
            </Button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {emailError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{emailError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="Enter new email address"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value)
                    setEmailError("")
                  }}
                  required
                />
                <p className="text-xs text-gray-500">Enter a valid email address</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPasswordEmail">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentPasswordEmail"
                    type="password"
                    placeholder="Verify with current password"
                    value={currentPasswordForEmail}
                    onChange={(e) => {
                      setCurrentPasswordForEmail(e.target.value)
                      setEmailError("")
                    }}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={emailLoading}>
                  {emailLoading ? "Updating..." : "Update Email"}
                </Button>
                <Button type="button" variant="outline" onClick={resetEmailForm}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your admin password</CardDescription>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button onClick={() => setShowPasswordForm(true)} variant="outline">
              Change Password
            </Button>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value)
                      setPasswordError("")
                    }}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      setPasswordError("")
                    }}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setPasswordError("")
                    }}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                <p className="font-semibold mb-2">Password Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li className={newPassword.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>One uppercase letter</li>
                  <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>One number</li>
                  <li className={newPassword === confirmPassword && newPassword ? "text-green-600" : ""}>
                    Passwords match
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
                <Button type="button" variant="outline" onClick={resetPasswordForm}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Security Notice:</strong> After changing your username or password, you will be automatically logged
          out and must sign in again with your new credentials. Email changes take effect immediately without requiring
          a logout.
        </AlertDescription>
      </Alert>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirm}
        title={
          pendingAction === "username"
            ? "Confirm Username Change"
            : pendingAction === "email"
              ? "Confirm Email Change"
              : "Confirm Password Change"
        }
        description={
          pendingAction === "username"
            ? `Are you sure you want to change your username to "${newUsername}"? You will be logged out and must sign in again.`
            : pendingAction === "email"
              ? `Are you sure you want to change your email to "${newEmail}"?`
              : "Are you sure you want to change your password? You will be logged out and must sign in again with your new password."
        }
        customContent={
          pendingAction !== "email" ? (
            <Alert className="bg-blue-50 border-blue-200">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                You will be automatically logged out after this change is complete.
              </AlertDescription>
            </Alert>
          ) : undefined
        }
      />
    </div>
  )
}
