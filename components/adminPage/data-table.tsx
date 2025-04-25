'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ChevronDown, Lock, LockOpen, Trash2 } from 'lucide-react'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserList } from '@/components/adminPage/columns'
import { activateUser, blockUser, deleteUser } from '@/actions/admin_actions'


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends UserList, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [ sorting, setSorting ] = useState<SortingState>([])
    const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([])
    const [ columnVisibility, setColumnVisibility ] = useState<VisibilityState>({})
    const [ rowSelection, setRowSelection ] = useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const selectedIds = table.getSelectedRowModel().rows.map(item => item.original.id)

    async function handleActive() {
        if (selectedIds.length === 0) return
        //await activateUser(selectedIds[0])
        setRowSelection({})
        toast.success('Users activated')
    }

    async function handleBlock() {
        if (selectedIds.length === 0) return
        await blockUser(selectedIds[0])
        //setRowSelection({})
        toast.success('Users blocked')
    }

    async function handleDelete() {
        if (selectedIds.length === 0) return
        //await deleteUser(selectedIds)
        setRowSelection({})
        toast.success('Users deleted')
    }

    return (
        <div className='w-full'>
            <div className='flex items-center py-4 gap-4'>
                <div className='flex items-center space-x-2'>
                    <Button
                        variant='outline'
                        onClick={handleBlock}
                    >
                        <Lock className='h-4 w-4'/>
                        Block
                    </Button>
                    <Button
                        variant='outline'
                        onClick={handleActive}
                    >
                        <LockOpen className='h-4 w-4'/>
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={handleDelete}
                    >
                        <Trash2 className='h-4 w-4'/>
                    </Button>
                </div>
                <Input
                    placeholder='Filter emails...'
                    value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('email')?.setFilterValue(event.target.value)
                    }
                    className='max-w-sm ml-auto'
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' className='ml-auto'>
                            Columns <ChevronDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className='capitalize'
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex items-center justify-end space-x-2 py-4'>
                <div className='flex-1 text-sm text-muted-foreground'>
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className='space-x-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
