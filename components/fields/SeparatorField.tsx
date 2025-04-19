'use client'

import { RiSeparator } from 'react-icons/ri'

import { ElementsType, FormElement } from '@/components/FormElements'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const type: ElementsType = 'SeparatorField'

export const SeparatorFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
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
    return (
        <div className='flex flex-col w-full gap-2'>
            <Label className='text-muted-foreground'>
                Separator field
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
    return (
        <p>No properties for this element</p>
    )
}