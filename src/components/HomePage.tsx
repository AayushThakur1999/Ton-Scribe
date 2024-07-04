const HomePage = () => {
  return (
    <main className="flex-1 flex flex-col text-center gap-3 sm:gap-4 md:gap-5 justify-center p-4 pb-20">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">Ton<span className="text-blue-400 bold">Scribe</span></h1>
      <h3 className="font-medium md:text-lg">Record <span className="text-blue-400">&rarr;</span> Transcribe <span className="text-blue-400">&rarr;</span> Translate</h3>
      <button className="flex specialBtn px-4 py-2 rounded-xl items-center justify-between gap-4 text-base w-72 max-w-full mx-auto my-4">
        <p className="text-blue-400">Record</p>
        <i className="fa-solid fa-microphone"></i>
      </button>
      <p className="text-base">Or <label className="text-blue-400 cursor-pointer hover:text-blue-600 duration-200">upload <input className="hidden" type="file" accept=".mp3, .wave"/></label> a mp3 file</p>
      <p className="italic text-slate-500">Free now free forever</p>
    </main>
  )
}

export default HomePage