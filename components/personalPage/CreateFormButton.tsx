'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { BsFileEarmarkPlus } from 'react-icons/bs'
import { ImSpinner2 } from 'react-icons/im'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { formSchema, formSchemaType } from '@/schemas/form'
import { CreateForm } from '@/actions/form'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'



export default function CreateFormButton() {
    const router = useRouter()
    const t = useTranslations('PersonalPage')
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    })

    async function onSubmit(values: formSchemaType) {
        try {
            const formId = await CreateForm(values)
            toast.success('Success', { description: 'Form created successfully' })
            router.push(`/builder/${formId}`)
        } catch (error) {
            toast.error('Error', {
                description: 'Something went wrong, please try again later'
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant='default'
                    className='flex justify-center items-center hover:cursor-pointer gap-4'
                >
                    <BsFileEarmarkPlus className='!h-4 !w-4' />
                    <p className='font-bold text-large'>
                        {t('create-form-button')}
                    </p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('create-dialog-title')}</DialogTitle>
                    <DialogDescription>
                        {t('create-dialog-header-description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t('create-dialog-name')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t('create-dialog-description')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className='field-sizing-fixed'
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className='w-full mt-4'
                        disabled={form.formState.isSubmitting}
                    >
                        {!form.formState.isSubmitting && <span>{t('create-dialog-save-button')}</span>}
                        {form.formState.isSubmitting && <ImSpinner2 className='animate-spin' />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

