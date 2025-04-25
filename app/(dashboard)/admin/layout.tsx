
export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <div className='flex flex-grow w-full justify-center'>
            {children}
        </div>
    )
}

