const TempSection = ({ comment }) => {
    return (
        <div className='pt-24 pb-8'>
            <div className='mx-auto max-w-6xl px-4 sm:px-6'>
                <section className='rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm'>
                    <div className='mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-blue-600'>
                        T
                    </div>
                    <h1 className='text-2xl font-bold text-slate-900'>Temporary Component</h1>
                    {comment && <p className='mt-2 text-sm text-slate-500'>{comment}</p>}
                </section>
            </div>
        </div>
    )
}

export default TempSection
