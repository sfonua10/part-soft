'use client'
import {
  EnvelopeIcon,
  HomeIcon,
  ListBulletIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { useState, useEffect, useMemo } from 'react'

const adminNavItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    current: true,
  },
  {
    name: 'Work Order Listings',
    href: '/dashboard/work-order-listings',
    icon: ListBulletIcon,
    current: false,
  },
  {
    name: 'Request Part',
    href: '/dashboard/request-part',
    icon: EnvelopeIcon,
    current: false,
  },
  {
    name: 'Manage Vendors',
    href: '/dashboard/manage-vendors',
    icon: UsersIcon,
    current: false,
  },
]

const userNavItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    current: true,
  },
  {
    name: 'Request Part',
    href: '/dashboard/request-part',
    icon: EnvelopeIcon,
  },
]

export function useNavigation(session, pathname) {
  const [navigation, setNavigation] = useState([])

  const baseNavigation = useMemo(() => {
    return session?.user?.role === 'admin' ? adminNavItems : userNavItems
  }, [session?.user?.role])

  useEffect(() => {
    setNavigation(baseNavigation)
  }, [baseNavigation])

  const isCurrent = (item, path) => {
    const isExactMatch = path === item.href
    const isSubpathOfAnother =
      item.href !== '/dashboard' && path.startsWith(item.href + '/')
    return isExactMatch || isSubpathOfAnother
  }
  const updatedNavigation = useMemo(() => {
    return navigation.map((item) => ({
      ...item,
      current: isCurrent(item, pathname),
    }))
  }, [navigation, pathname])

  return updatedNavigation
}
