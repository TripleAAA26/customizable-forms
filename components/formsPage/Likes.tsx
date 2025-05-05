'use client'

import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Like } from '@prisma/client'
import { AddLike, DeleteLike } from '@/actions/form'

export default function Likes({ likes, formId, userId }:{ likes: Like[], formId: number, userId: string }) {
    const isLiked =
        likes.find(like => like.userId === userId)

    const [ value, setValue ] = useState(!!isLiked)

    async function handleLike() {
        if (isLiked) {
            await DeleteLike(isLiked.id)
            setValue(false)
        } else {
            await AddLike(formId, userId)
            setValue(true)
        }
    }

    return (
        <div className='flex items-center gap-2'>
            <Button
                variant='ghost'
                onClick={() => handleLike()}
                className='hover:scale-100 active:scale-125 transition-all duration-200'
            >
                {value
                    ?
                    <AiFillLike className='!h-6 !w-6'/>
                    :
                    <AiOutlineLike className='!h-6 !w-6' />
                }
            </Button>
            <p className='font-bold'>{likes.length}</p>
        </div>
    )
}

