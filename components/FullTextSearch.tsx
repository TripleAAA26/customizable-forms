'use client'

import { useState } from 'react'
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'


export default function FullTextSearch() {
    const [ open, setOpen ] = useState(false)



    return (
        <>
            <Button
                className='flex justify-start text-muted-foreground bg-muted w-48'
                variant='outline'
                onClick={() => setOpen(true)}
            >
                Search form...
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder='Search...'/>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        <CommandItem>item 1</CommandItem>
                        <CommandItem>item 2</CommandItem>
                    </CommandGroup>
                    <CommandSeparator/>
                    <CommandGroup>
                        <CommandItem>item 3</CommandItem>
                        <CommandItem>item 4</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}

