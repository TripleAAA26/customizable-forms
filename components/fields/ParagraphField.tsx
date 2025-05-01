'use client'

import { useEffect } from 'react'
import { BsTextParagraph } from 'react-icons/bs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import useDesigner from '@/components/hooks/useDesigner'
import { ElementsType, FormElement, FormElementInstance } from '@/components/FormElements'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'

const type: ElementsType = 'ParagraphField'


const propertiesSchema = z.object({
    text: z.string().min(2).max(500),
})

export const ParagraphFieldFormElement: FormElement = {
    type,
    construct: (id: string, formId: number, ordering: number) => ({
        id,
        type,
        formId,
        ordering,
        text: 'Text here',
    }),
    designerButtonElement: {
        icon: BsTextParagraph,
        label: 'Paragraph field',
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
}


function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { text } = elementInstance


    return (
        <div className='flex flex-col w-full gap-2'>
            <Label className='text-muted-foreground'>
                Paragraph field
            </Label>
            <p>{text}</p>
        </div>
    )
}


function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {

    const { text } = elementInstance

    return (
        <p>{text}</p>
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
            text: elementInstance.text,
        }
    })

    useEffect(() => {
        form.reset({
            text: elementInstance.text,
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
                    name='text'
                    render={({field}) =>
                        <FormItem>
                            <FormLabel>
                                {t('form-text')}
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className='field-sizing-fixed'
                                    rows={5}
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