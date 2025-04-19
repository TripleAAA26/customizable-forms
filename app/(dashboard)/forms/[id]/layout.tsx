
export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col flex-grow w-full mx-auto items-center'>
            {children}
        </div>
    )
}

