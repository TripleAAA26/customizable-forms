'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import * as React from 'react'
import { format } from 'date-fns'
import { activateUser, blockUser, deleteUser, setRoleAdmin, setRoleUser } from '@/actions/admin_actions'
import { toast } from 'sonner'

export type UserList = {
    id: string
    lastLoginTime: number
    status: 'active' | 'blocked'
    email: string
    role: string
}

export const columns: ColumnDef<UserList>[] = [
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <div className='capitalize'>{row.getValue('status')}</div>
        ),
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
            <div className='capitalize'>{row.getValue('role')}</div>
        ),
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Email
                    <ArrowUpDown/>
                </Button>
            )
        },
        cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'lastLoginTime',
        header: () => <div className='text-right'>Last seen</div>,
        cell: ({ row }) => {
            const amount = row.getValue('lastLoginTime') as number

            // Format the date
            const formatted = format(amount, 'Pp')

            return <div className='text-right font-medium'>{formatted}</div>
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const users = row.original

            async function handleRole() {
                if (users.role === 'admin') {
                    const res = await setRoleUser(users.id)
                    if (res.message instanceof Error) toast.error('Can not remove admin role')
                    if (res.message === 'ok') toast.success('Admin role has been removed')
                } else {
                    const res = await setRoleAdmin(users.id)
                    if (res.message instanceof Error) toast.error('Can not add admin role')
                    if (res.message === 'ok') toast.success('Admin role has been added')
                }
            }

            async function handleBlock() {
                if (users.status === 'active') {
                    const res = await blockUser(users.id)
                    if (res.message instanceof Error) toast.error('Can not block the account')
                    if (res.message === 'ok') toast.success('Account has been blocked')
                } else {
                    const res = await activateUser(users.id)
                    if (res.message instanceof Error) toast.error('Can not unblock the account')
                    if (res.message === 'ok') toast.success('Account has been unblocked')
                }
            }

            async function handleDelete() {
                const res = await deleteUser(users.id)
                if (res.message instanceof Error) toast.error('Can not delete the account')
                if (res.message === 'ok') toast.success('Account has been deleted')
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={handleRole}
                        >
                            {users.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleBlock}
                        >
                            {users.status === 'active' ? 'Block' : 'UnBlock'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            variant='destructive'
                            onClick={handleDelete}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]