import { AiOutlineClose } from 'react-icons/ai'

import useDesigner from '@/components/hooks/useDesigner'
import { FormElements } from '@/components/FormElements'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'

export default function PropertiesFormSideBar() {
    const { selectedElement, setSelectedElement } = useDesigner()
    const t = useTranslations('BuilderPage.propertiesFormSideBarComponent')
    if (!selectedElement) return null

    const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent

    return (
        <div className='flex flex-col p-2'>
            <div className='flex justify-between items-center'>
                <p className='text-sm text-foreground/70'>{t('element-properties')}</p>
                <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => {
                        setSelectedElement(null)
                    }}
                >
                    <AiOutlineClose />
                </Button>
            </div>
            <Separator className='mb-4' />
            <PropertiesForm elementInstance={selectedElement} />
        </div>
    )
}

