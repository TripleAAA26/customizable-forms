import useDesigner from '@/components/hooks/useDesigner'
import FormElementsSideBar from '@/components/builderPage/FormElementsSideBar'
import PropertiesFormSideBar from '@/components/builderPage/PropertiesFormSideBar'

export default function DesignerSideBar() {
    const { selectedElement } = useDesigner()

    return (
        <aside
            className='w-[400px] max-w-[400px] flex flex-col flex-grow gap-2
            border-l-2 border-muted p-4 bg-background overflow-y-auto h-full'
        >
            {!selectedElement && <FormElementsSideBar />}
            {selectedElement && <PropertiesFormSideBar />}
        </aside>
    )
}

