'use client'

import { useRef, useState, useTransition } from 'react'
import { HiCursorClick } from 'react-icons/hi'
import { ImSpinner2 } from 'react-icons/im'

import { toast } from 'sonner'
import { FormElementInstance, FormElements } from '@/components/FormElements'
import { Button } from '@/components/ui/button'
import { SubmitForm } from '@/actions/form'

export default function FormSubmitComponent({ formUrl, content }: { formUrl: string; content: FormElementInstance[] }) {
    const formValues = useRef<{ [key: string]: string }>({})
    const formError = useRef<{ [key: string]: boolean }>({})
    const [renderKey, setRenderKey] = useState(new Date().getTime())

    const [submitted, setSubmitted] = useState(false)

    const [pending, startTransition] = useTransition()

    function validateForm() {
        for ( const field of content) {
            const actualValue = formValues.current[field.id] || ''
            const valid = FormElements[field.type].validate(field, actualValue)

            if (!valid) {
                formError.current[field.id] = true
            }
        }

        return Object.keys(formError.current).length <= 0
    }

    function submitValue(key: string, value: string) {
        formValues.current[key] = value
    }
    
    async function submitForm() {
        formError.current = {}
        const validForm = validateForm()
        if (!validForm) {
            setRenderKey(new Date().getTime())
            toast.error('Error', { description: 'please check the form for errors' })
            return
        }
        
        try {
            const jsonContent = JSON.stringify(formValues.current)
            await SubmitForm(formUrl, jsonContent)
            setSubmitted(true)
        } catch (error) {
            toast.error('Error', { description: 'Something went wrong' })
        }
    }

    if (submitted) {
        return (
            <div className='w-full h-full flex items-center justify-center p-8'>
                <div
                    className='max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8
                    overflow-y-auto border shadow-xl shadow-blue-700 rounded'
                >
                    <h1 className='text-2xl font-bold'>Form submitted</h1>
                    <p className='text-muted-foreground'>
                        Thank you for submitting the form, you can close this page.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex justify-center items-center h-full w-full p-8'>
            <div
                key={renderKey}
                className='max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8
                overflow-y-auto border shadow-xl shadow-blue-700 rounded'
            >
                {content.map(element => {
                    const FormElement = FormElements[element.type].formComponent
                    return (
                        <FormElement
                            key={element.id}
                            elementInstance={element}
                            submitValue={submitValue}
                            isInvalid={formError.current[element.id]}
                            defaultValue={formValues.current[element.id]}
                        />
                    )
                })}
                <Button
                    className='mt-8'
                    onClick={() => {
                        startTransition(submitForm)
                    }}
                    disabled={pending}
                >
                    {!pending &&
                        <>
                            <HiCursorClick className='mr-2' />
                            Submit
                        </>
                    }
                    {pending && <ImSpinner2 className='animate-spin' />}
                </Button>
            </div>
        </div>
    )
}

