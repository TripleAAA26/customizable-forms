'use client'

import { useEffect, useState } from 'react'
import { BsFillCalendarDateFill } from 'react-icons/bs'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import useDesigner from '@/components/hooks/useDesigner'
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from '@/components/FormElements'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { useTranslations } from 'next-intl'

const type: ElementsType = 'DateField'


const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean(), //.default(false)
})

export const DateFieldFormElement: FormElement = {
    type,
    construct: (id: string, formId: number, ordering: number) => ({
        id,
        type,
        formId,
        label: 'Date field',
        helperText: 'Pick a date',
        required: false,
        ordering,
    }),
    designerButtonElement: {
        icon: BsFillCalendarDateFill,
        label: 'Date field',
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: (formElement: FormElementInstance, currentValue: string):boolean => {
        if (formElement.required) {
            return currentValue.length > 0
        }

        return true
    }
}


function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { label, helperText, required } = elementInstance

    return (
        <div className='flex flex-col w-full gap-2'>
            <Label>
                {label}
                {required && '*'}
            </Label>
            <Button
                variant='outline'
                className='w-full justify-start text-left font-normal'
            >
                <CalendarIcon className='mr-2 !h-4 !w-4' />
                <span>Pick a date</span>
            </Button>
            {helperText && <p className='text-muted-foreground text-[0.8rem]'>{helperText}</p> }
        </div>
    )
}


function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue,
}: {
    elementInstance: FormElementInstance,
    submitValue?: SubmitFunction,
    isInvalid?: boolean,
    defaultValue?: string,
}) {

    const [date, setDate] = useState<Date | undefined>(defaultValue ? new Date(defaultValue) : undefined)
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid])

    const { label, helperText, required } = elementInstance

    return (
        <div className='flex flex-col w-full gap-2'>
            <Label className={cn(error && 'text-red-500')}>
                {label}
                {required && '*'}
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        className={cn(
                            'w-full justify-start text-left font-normal ',
                            !date && 'text-muted-foreground',
                            error && 'border-red-500'
                        )}
                    >
                        <CalendarIcon className='mr-2 !h-4 !w-4' />
                        {date ? format(date, 'PPP') : <span>Pick a date</span> }
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                        mode='single'
                        selected={date}
                        onSelect={date => {
                            setDate(date)

                            if (!submitValue) return
                            const value = date?.toUTCString() || ''
                            const valid = DateFieldFormElement.validate(elementInstance, value)
                            setError(!valid)
                            submitValue(elementInstance.id, value)
                        }}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>
            {helperText &&
                <p
                    className={cn(
                        'text-muted-foreground text-[0.8rem]',
                        error && 'text-red-500'
                    )}
                >
                    {helperText}
                </p>
            }
        </div>
    )
}


type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { updateElement } = useDesigner()
    const t = useTranslations('Fields.propertiesComponent')

    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: 'onBlur',
        defaultValues: {
            label: elementInstance.label,
            helperText: elementInstance.helperText,
            required: elementInstance.required,
        }
    })

    useEffect(() => {
        form.reset({
            label: elementInstance.label,
            helperText: elementInstance.helperText,
            required: elementInstance.required,
        })
    },[elementInstance, form])

    function applyChanges(values: propertiesFormSchemaType) {
        updateElement(elementInstance.id, {
            ...elementInstance,
            ...values,
        })
    }

    return (
        <Form {...form}>
            <form
                onBlur={form.handleSubmit(applyChanges)}
                className='space-y-3'
                onSubmit={e=> e.preventDefault()}
            >
                <FormField
                    control={form.control}
                    name='label'
                    render={({field}) =>
                        <FormItem>
                            <FormLabel>
                                {t('form-label')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') e.currentTarget.blur()
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                {t('form-description-first')}<br/>{t('form-description-second')}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    }
                />

                <FormField
                    control={form.control}
                    name='helperText'
                    render={({field}) =>
                        <FormItem>
                            <FormLabel>
                                {t('form-helper-text-label')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') e.currentTarget.blur()
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                {t('form-helper-description-first')} <br/>
                                {t('form-helper-description-second')}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    }
                />

                <FormField
                    control={form.control}
                    name='required'
                    render={({field}) =>
                        <FormItem className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
                            <div className='space-y-0.5'>
                                <FormLabel>
                                    {t('form-required-label')}
                                </FormLabel>
                                <FormDescription>
                                    {t('form-required-description')}
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }
                />
            </form>
        </Form>
    )
}