import { redirect } from 'next/navigation'
import { clerkClient } from '@clerk/nextjs/server'
import { checkRole } from '@/lib/roles'
import { DataTable } from '@/components/adminPage/data-table'
import { columns, UserList } from '@/components/adminPage/columns'


export default async function AdminDashboard() {
    const isAdmin = await checkRole('admin')
    if (!isAdmin) {
        redirect('/')
    }

    const client = await clerkClient()
    const users =(await client.users.getUserList()).data || []
    const realData: UserList[] = users.map(user => {
        return {
            id: user.id,
            lastLoginTime: user.lastSignInAt as number,
            status: user.banned ? 'blocked' : 'active',
            role: user.publicMetadata.role as string,
            email: user.primaryEmailAddress?.emailAddress as string,
        }
    })

    return (
        <div className='container pt-4'>
            <p className='text-2xl font-bold'>Admin Dashboard</p>

            <DataTable columns={columns} data={realData} />
        </div>
    )
}