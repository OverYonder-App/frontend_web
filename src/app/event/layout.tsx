'use client'

import React from 'react'
import { useUser } from '@/context/UserContext'
import { UserRole } from '@/constants/roles'
import StudentLayout from '@/app/dashboard/StudentLayout'
import AdminLayout from '@/app/dashboard/institution-admin/layout'
import OYAdminLayout from '@/app/dashboard/oy/layout'
import EventSkeleton from '@/features/events/components/EventSkeleton'

export default function EventLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()

  if (loading) return <EventSkeleton />

  const role = user?.role_type as UserRole | undefined

  switch (role) {
    case UserRole.INSTITUTION_ADMIN:
      return <AdminLayout>{children}</AdminLayout>
    case UserRole.OY_ADMIN:
      return <OYAdminLayout>{children}</OYAdminLayout>
    case UserRole.STUDENT:
    case UserRole.STUDENT_LEADER:
    case UserRole.FACULTY:
    default:
      return <StudentLayout>{children}</StudentLayout>
  }
}

