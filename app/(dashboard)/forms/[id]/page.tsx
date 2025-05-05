import { GetFormById } from '@/actions/form'
import VisitButton from '@/components/formsPage/VisitButton'
import FormLinkShare from '@/components/formsPage/FormLinkShare'
import StatsCards from '@/components/StatsCards'
import SubmissionsTable from '@/components/formsPage/SubmissionsTable'
import Comments from '@/components/formsPage/Comments'
import Likes from '@/components/formsPage/Likes'

export default async function FormDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const form = await GetFormById(Number(id))
    if (!form) {
        throw new Error(`form not found`)
    }

    const { visits, submissions, comments } = form

    let submissionRate = 0

    if (visits > 0) {
        submissionRate = (submissions / visits) * 100
    }

    const bounceRate = 100 - submissionRate

    return (
        <>
            <div className='py-10 border-t border-b border-muted container'>
                <div className='flex justify-between container'>
                    <div className='flex items-center gap-8'>
                        <h1 className='text-4xl font-bold truncate'>{form.name}</h1>
                        <Likes likes={form.likes} formId={form.id} userId={form.userId} />
                    </div>
                    <VisitButton shareUrl={form.shareURL}/>
                </div>
            </div>
            <div className='py-4 border-b border-muted container'>
                <div className='container flex gap-2 justify-between items-center'>
                    <FormLinkShare shareUrl={form.shareURL}/>
                </div>
            </div>
            <div className='container'>
                <StatsCards
                    loading={false}
                    data={{
                        visits,
                        submissions,
                        submissionRate,
                        bounceRate,
                    }}
                />
            </div>
            <div className='container pt-10'>
                <SubmissionsTable id={form.id} />
            </div>
            <div className='container pt-10'>
                <Comments comments={comments} formId={form.id} />
            </div>
        </>
    )
}

