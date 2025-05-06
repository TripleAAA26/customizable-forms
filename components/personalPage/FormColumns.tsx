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
import { Form } from '@prisma/client'
import { formatDistance } from 'date-fns'
import { BiRightArrowAlt } from 'react-icons/bi'
import { FaEdit } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import Link from 'next/link'
import { DeleteForm } from '@/actions/form'


export const columns: ColumnDef<Form>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Name
                    <ArrowUpDown/>
                </Button>
            )
        },
        cell: ({ row }) => <div className='lowercase'>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
            <div className='capitalize'>{row.getValue('description')}</div>
        ),
    },
    {
        accessorKey: 'createdAt',
        header: () => <div className='text-right'>Created at</div>,
        cell: ({ row }) => {
            const formattedDate = formatDistance(row.getValue('createdAt'), new Date(), { addSuffix: true })

            return <div className='text-right font-medium'>{formattedDate}</div>
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const form = row.original


            async function handleDelete() {
                await DeleteForm(form.id)
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
                        <DropdownMenuItem>
                            <Link
                                href={`/builder/${form.id}`}
                                className='w-full flex justify-between items-center'
                            >
                                Edit <FaEdit />
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link
                                href={`/forms/${form.id}`}
                                className='w-full flex justify-between items-center'
                            >
                                View <BiRightArrowAlt />
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            className='flex justify-between items-center'
                            variant='destructive'
                            onClick={handleDelete}
                        >
                            Delete <RiDeleteBin6Line />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]