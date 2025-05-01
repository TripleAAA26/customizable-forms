'use client'

import { RiSeparator } from 'react-icons/ri'

import { ElementsType, FormElement } from '@/components/FormElements'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'

const type: ElementsType = 'SeparatorField'

export const SeparatorFieldFormElement: FormElement = {
    type,
    construct: (id: string, formId: number, ordering: number) => ({
        id,
        type,
        formId,
        ordering,
    }),
    designerButtonElement: {
        icon: RiSeparator,
        label: 'Separator field',
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
}


function DesignerComponent() {
    const t = useTranslations('Fields')
    return (
        <div className='flex flex-col w-full gap-2'>
            <Label className='text-muted-foreground'>
                {t('Separator field')}
            </Label>
            <Separator />
        </div>
    )
}


function FormComponent() {
    return (
        <Separator />
    )
}


function PropertiesComponent() {
    const t = useTranslations('Fields.propertiesComponent')
    return (
        <p>{t('no-properties')}</p>
    )
}