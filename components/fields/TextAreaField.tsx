'use client'

import { useEffect, useState } from 'react'
import { BsTextareaResize } from 'react-icons/bs'
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
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { useTranslations } from 'next-intl'

const type: ElementsType = 'TextAreaField'


const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean(), //.default(false)
    placeHolder: z.string().max(50),
    rows: z.number().min(1).max(10),
})

export const TextAreaFieldFormElement: FormElement = {
    type,
    construct: (id: string, formId: number, ordering: number) => ({
        id,
        type,
        formId,
        ordering,
        label: 'TextArea field',
        helperText: 'Helper text',
        required: false,
        placeHolder: 'Value here',
        rows: 3,
    }),
    designerButtonElement: {
        icon: BsTextareaResize,
        label: 'TextArea field',
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
            <Textarea readOnly disabled placeholder={placeHolder} />
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

    const { label, helperText, placeHolder, required, rows } = elementInstance

    return (
        <div className='flex flex-col w-full gap-2'>
            <Label className={cn(error && 'text-red-500')}>
                {label}
                {required && '*'}
            </Label>
            <Textarea
                rows={rows}
                className={cn(error && 'border-red-500', 'field-sizing-fixed')}
                value={value}
                onChange={e => setValue(e.target.value)}
                onBlur={e => {
                    if (!submitValue) return
                    const valid = TextAreaFieldFormElement.validate(elementInstance, e.target.value)
                    setError(!valid)
                    //if (!valid) return
                    submitValue(elementInstance.id, e.target.value)
                }}
                placeholder={placeHolder}
            />
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
            placeHolder: elementInstance.placeHolder,
            rows: elementInstance.rows,
        }
    })

    useEffect(() => {
        form.reset({
            label: elementInstance.label,
            helperText: elementInstance.helperText,
            required: elementInstance.required,
            placeHolder: elementInstance.placeHolder,
            rows: elementInstance.rows,
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

                <FormField
                    control={form.control}
                    name='rows'
                    render={({field}) =>
                        <FormItem>
                            <FormLabel>
                                {t('form-rows')} {form.watch('rows')}
                            </FormLabel>
                            <FormControl>
                                <Slider
                                    min={1}
                                    max={10}
                                    step={1}
                                    defaultValue={[field.value]}
                                    onValueChange={value => field.onChange(value[0])}
                                />
                            </FormControl>
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