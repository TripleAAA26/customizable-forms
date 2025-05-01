'use client'

import { useEffect, useState } from 'react'
import { IoMdCheckbox } from 'react-icons/io'
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
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslations } from 'next-intl'

const type: ElementsType = 'CheckboxField'


const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean(), //.default(false)
})

export const CheckboxFieldFormElement: FormElement = {
    type,
    construct: (id: string, formId: number, ordering: number) => ({
        id,
        type,
        formId,
        ordering,
        label: 'Checkbox field',
        helperText: 'Helper text',
        required: false,
    }),
    designerButtonElement: {
        icon: IoMdCheckbox,
        label: 'Checkbox field',
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: (formElement: FormElementInstance, currentValue: string):boolean => {
        if (formElement.required) {
            return currentValue === 'true'
        }

        return true
    }
}


function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { label, helperText, required } = elementInstance
    const id = `checkbox-${elementInstance.id}`

    return (
        <div className='flex items-start space-x-2'>
            <Checkbox id={id} />
            <div className='grid gap-1.5 leading-none'>
                <Label htmlFor={id}>
                    {label}
                    {required && '*'}
                </Label>
                {helperText && <p className='text-muted-foreground text-[0.8rem]'>{helperText}</p> }
            </div>
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

    const [value, setValue] = useState<boolean>(defaultValue === 'true')
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid])

    const { label, helperText, required } = elementInstance

    const id = `checkbox-${elementInstance.id}`

    return (
        <div className='flex items-start space-x-2'>
            <Checkbox
                id={id}
                checked={value}
                onCheckedChange={checked => {
                    let value = false
                    if (checked === true) value = true

                    setValue(value)
                    if (!submitValue) return
                    const stringValue = value ? 'true' : 'false'
                    const valid = CheckboxFieldFormElement.validate(elementInstance, stringValue)
                    setError(!valid)
                    submitValue(elementInstance.id, stringValue)
                }}
                className={cn(error && 'border-red-500')}
            />
            <div className='grid gap-1.5 leading-none'>
                <Label
                    className={cn(error && 'text-red-500')}
                    htmlFor={id}
                >
                    {label}
                    {required && '*'}
                </Label>
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