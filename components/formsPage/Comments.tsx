'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { AddComment } from '@/actions/form'
import { Comment } from '@prisma/client'
import { useState, useTransition } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { formatDistance } from 'date-fns'

export default function Comments({ comments, formId }: { comments: Comment[], formId: number }) {
    const [ value, setValue ] = useState('')
    const [ loading, startTransition ] = useTransition()

    async function handleAddComment() {
        if (value.length === 0) return

        await AddComment(formId, value)
        setValue('')
    }

    return (
        <div className='mx-auto max-w-2xl space-y-8 py-8'>
            <div className='space-y-4'>
                <h2 className='text-2xl font-bold'>Comments</h2>
                <div className='grid gap-2'>
                    <Textarea
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder='Write your comment...'
                        className='resize-none rounded-md border border-input bg-background p-3 text-sm shadow-sm'
                    />
                    <Button
                        disabled={value.length === 0 || loading}
                        className='justify-center'
                        onClick={() => startTransition(handleAddComment)}
                    >
                        Submit
                        {loading && <FaSpinner className='animate-spin' />}
                    </Button>
                </div>
            </div>
            <div className='space-y-6'>
                {comments.length > 0
                    ?
                    comments.map(comment =>
                        <div key={comment.id} className='flex items-start gap-4'>
                            <Avatar className='h-10 w-10 border'>
                                <AvatarImage src='/placeholder-user.jpg' alt='@shadcn'/>
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div className='grid gap-1.5'>
                                <div className='flex items-center gap-2'>
                                    <div className='font-medium'>{comment.userName}</div>
                                    <div className='text-xs text-muted-foreground'>
                                        {formatDistance(comment.createdAt, new Date(), { addSuffix: true })}
                                    </div>
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    {comment.text}
                                </div>
                            </div>
                        </div>
                    )
                    :
                    <p>There is no comment yet.</p>
                }
            </div>
        </div>
    )
}