'use client'

import { useEffect } from 'react'
import { LuSeparatorHorizontal } from 'react-icons/lu'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import useDesigner from '@/components/hooks/useDesigner'
import { ElementsType, FormElement, FormElementInstance } from '@/components/FormElements'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Slider } from '@/components/ui/slider'
import { useTranslations } from 'next-intl'

const type: ElementsType = 'SpacerField'


const propertiesSchema = z.object({
    height: z.number().min(5).max(200),
})

export const SpacerFieldFormElement: FormElement = {
    type,
    construct: (id: string, formId: number, ordering: number) => ({
        id,
        type,
        formId,
        ordering,
        height: 20, // px
    }),
    designerButtonElement: {
        icon: LuSeparatorHorizontal,
        label: 'Spacer field',
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
}


function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { height } = elementInstance
    const t = useTranslations('Fields')

    return (
        <div className='flex flex-col w-full gap-2 items-center'>
            <Label className='text-muted-foreground'>
                {t('Spacer field')}: {height}px
            </Label>
            <LuSeparatorHorizontal className='h-8 w-8' />
        </div>
    )
}


function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { height } = elementInstance

    return (
        <div style={{ height, width: '100%' }} />
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
            height: elementInstance.height,
        }
    })

    useEffect(() => {
        form.reset({
            height: elementInstance.height,
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
                    name='height'
                    render={({field}) =>
                        <FormItem>
                            <FormLabel>
                                {t('form-height')} (px): {form.watch('height')}
                            </FormLabel>
                            <FormControl className='pt-2'>
                                <Slider
                                    min={5}
                                    max={200}
                                    step={1}
                                    defaultValue={[field.value]}
                                    onValueChange={value => field.onChange(value[0])}
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