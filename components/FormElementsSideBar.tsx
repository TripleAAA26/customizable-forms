import SideBarButtonElement from '@/components/SideBarButtonElement'
import { FormElements } from '@/components/FormElements'
import { Separator } from '@/components/ui/separator'

export default function FormElementsSideBar() {
    return (
        <div>
            <p className='text-sm text-foreground/70'>Drag and drop elements</p>
            <Separator className='my-2' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center'>
                <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>
                    Layout elements
                </p>
                <SideBarButtonElement formElement={FormElements.TitleField} />
                <SideBarButtonElement formElement={FormElements.SubTitleField} />
                <SideBarButtonElement formElement={FormElements.ParagraphField} />
                <SideBarButtonElement formElement={FormElements.SeparatorField} />
                <SideBarButtonElement formElement={FormElements.SpacerField} />

                <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>
                    Form elements
                </p>
                <SideBarButtonElement formElement={FormElements.TextField} />
                <SideBarButtonElement formElement={FormElements.NumberField} />
                <SideBarButtonElement formElement={FormElements.TextAreaField} />
                <SideBarButtonElement formElement={FormElements.DateField} />
                <SideBarButtonElement formElement={FormElements.SelectField} />
                <SideBarButtonElement formElement={FormElements.CheckboxField} />
            </div>
        </div>
    )
}

