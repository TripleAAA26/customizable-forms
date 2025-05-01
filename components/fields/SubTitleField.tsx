'use client'

import { useEffect } from 'react'
import { LuHeading2 } from 'react-icons/lu'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import useDesigner from '@/components/hooks/useDesigner'
import { ElementsType, FormElement, FormElementInstance } from '@/components/FormElements'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useTranslations } from 'next-intl'

const type: ElementsType = 'SubTitleField'


const propertiesSchema = z.object({
    title: z.string().min(2).max(50),
})

export const SubTitleFieldFormElement: FormElement = {
    type,
    construct: (id: string, formId: number, ordering: number) => ({
        id,
        type,
        formId,
        ordering,
        title: 'SubTitle field',
    }),
    designerButtonElement: {
        icon: LuHeading2,
        label: 'SubTitle field',
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
}


function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { title } = elementInstance
    const t = useTranslations('Fields')

    return (
        <div className='flex flex-col w-full gap-2'>
            <Label className='text-muted-foreground'>
                {t('SubTitle field')}
            </Label>
            <p className='text-lg'>{title}</p>
        </div>
    )
}


function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { title } = elementInstance


    return (
        <p className='text-lg'>{title}</p>
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
            title: elementInstance.title,
        }
    })

    useEffect(() => {
        form.reset({
            title: elementInstance.title,
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
                    name='title'
                    render={({field}) =>
                        <FormItem>
                            <FormLabel>
                                {t('form-title')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') e.currentTarget.blur()
                                    }}
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