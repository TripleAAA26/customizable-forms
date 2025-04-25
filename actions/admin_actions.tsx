'use server'

import { checkRole } from '@/lib/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function setRoleAdmin(id: string) {
    const isAdmin = await checkRole('admin')
    if (!isAdmin) {
        return { message: 'Not Authorized' }
    }

    const client = await clerkClient()

    try {
        const res = await client.users.updateUserMetadata(id as string, {
            publicMetadata: { role: 'admin' },
        })
        revalidatePath('/admin')
        return { message: 'ok' }
    } catch (err) {
        return { message: err }
    }
}

export async function setRoleUser(id: string) {
    const isAdmin = await checkRole('admin')
    if (!isAdmin) {
        return { message: 'Not Authorized' }
    }

    const client = await clerkClient()

    try {
        const res = await client.users.updateUserMetadata(id as string, {
            publicMetadata: { role: 'user' },
        })

        revalidatePath('/admin')
        return { message: 'ok' }
    } catch (err) {
        return { message: err }
    }
}

export async function deleteUser(id: string) {
    const isAdmin = await checkRole('admin')
    if (!isAdmin) {
        return { message: 'Not Authorized' }
    }

    const client = await clerkClient()

    try {
        const res = await client.users.deleteUser(id)

        revalidatePath('/admin')
        return { message: 'ok' }
    } catch (err) {
        return { message: err }
    }
}

export async function blockUser(id: string) {
    const isAdmin = await checkRole('admin')
    if (!isAdmin) {
        return { message: 'Not Authorized' }
    }

    const client = await clerkClient()

    try {
        const res = await client.users.banUser(id)

        revalidatePath('/admin')
        return { message: 'ok' }
    } catch (err) {
        return { message: err }
    }
}

export async function activateUser(id: string) {
    const isAdmin = await checkRole('admin')
    if (!isAdmin) {
        return { message: 'Not Authorized' }
    }

    const client = await clerkClient()

    try {
        const res = await client.users.unbanUser(id)

        revalidatePath('/admin')
        return { message: 'ok' }
    } catch (err) {
        return { message: err }
    }
}