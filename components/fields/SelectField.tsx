'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RxDropdownMenu } from 'react-icons/rx'

import useDesigner from '@/components/hooks/useDesigner'
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from '@/components/FormElements'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const type: ElementsType = 'SelectField'


const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean(), //.default(false)
    placeHolder: z.string().max(50),
    options: z.array(z.string()), //.default([])
})

export const SelectFieldFormElement: FormElement = {
    type,
    construct: (id: string, formId: number, ordering: number) => ({
        id,
        type,
        formId,
        ordering,
        label: 'Select field',
        helperText: 'Helper text',
        required: false,
        placeHolder: 'Value here',
        options: [],
    }),
    designerButtonElement: {
        icon: RxDropdownMenu,
        label: 'Select field',
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
    const { label, helperText, placeHolder, required } = elementInstance


    return (
        <div className='flex flex-col w-full gap-2'>
            <Label>
                {label}
                {required && '*'}
            </Label>
            <Select>
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder={placeHolder} />
                </SelectTrigger>
            </Select>
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

    const [value, setValue] = useState(defaultValue || '')
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid])

    const { label, helperText, placeHolder, required, options } = elementInstance

    return (
        <div className='flex flex-col w-full gap-2'>
            <Label className={cn(error && 'text-red-500')}>
                {label}
                {required && '*'}
            </Label>
            <Select
                defaultValue={value}
                onValueChange={value => {
                    setValue(value)
                    if (!submitValue) return

                    const valid = SelectFieldFormElement.validate(elementInstance, value)
                    setError(!valid)
                    submitValue(elementInstance.id, value)
                }}
            >
                <SelectTrigger
                    className={cn(
                        'w-full',
                        error && 'border-red-500',
                    )}
                >
                    <SelectValue placeholder={placeHolder} />
                </SelectTrigger>
                <SelectContent>
                    {options?.map(option =>
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
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
    const { updateElement, setSelectedElement } = useDesigner()
    const t = useTranslations('Fields.propertiesComponent')

    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: 'onSubmit',
        defaultValues: {
            label: elementInstance.label,
            helperText: elementInstance.helperText,
            required: elementInstance.required,
            placeHolder: elementInstance.placeHolder,
            options: elementInstance.options,
        }
    })

    useEffect(() => {
        form.reset({
            label: elementInstance.label,
            helperText: elementInstance.helperText,
            required: elementInstance.required,
            placeHolder: elementInstance.placeHolder,
            options: elementInstance.options,
        })
    },[elementInstance, form])

    function applyChanges(values: propertiesFormSchemaType) {
        updateElement(elementInstance.id, {
            ...elementInstance,
            ...values,
        })

        toast.success('Success', { description: 'Properties saved successfully' })

        setSelectedElement(null)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(applyChanges)}
                className='space-y-3'
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
                                {t('form-description-first')} <br/> {t('form-description-second')}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    }
                />

                <FormField
                    control={form.control}
                    name='placeHolder'
                    render={({field}) =>
                        <FormItem>
                            <FormLabel>
                                {t('form-placeholder-label')}
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
                                {t('form-placeholder-description')}
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

                <Separator />
                <FormField
                    control={form.control}
                    name='options'
                    render={({field}) =>
                        <FormItem>
                            <div className='flex justify-between items-center'>
                                <FormLabel>
                                    {t('form-options-label')}
                                </FormLabel>
                                <Button
                                    variant='outline'
                                    className='gap-2'
                                    onClick={e => {
                                        e.preventDefault()
                                        form.setValue('options', field.value.concat('New option'))
                                    }}
                                >
                                    <AiOutlinePlus />
                                    {t('form-options-button')}
                                </Button>
                            </div>
                            <div className='flex flex-col gap-2'>
                                {form.watch('options').map((option, index) =>
                                    <div key={index} className='flex justify-between items-center gap-1'>
                                        <Input
                                            placeholder=''
                                            value={option}
                                            onChange={e => {
                                                field.value[index] = e.target.value
                                                field.onChange(field.value)
                                            }}
                                        />
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={e => {
                                                e.preventDefault()
                                                const newOptions = [...field.value]
                                                newOptions.splice(index, 1)
                                                field.onChange(newOptions)
                                            }}
                                        >
                                            <AiOutlineClose />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <FormDescription>
                                {t('form-helper-description-first')} <br/>
                                {t('form-helper-description-second')}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    }
                />

                <Separator />
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
                <Separator />
                <Button className='w-full' type='submit'>{t('form-save-button')}</Button>
            </form>
        </Form>
    )
}