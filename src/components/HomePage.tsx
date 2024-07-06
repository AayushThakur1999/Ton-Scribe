import { useState, useEffect, useRef } from 'react';

interface HomePageProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setAudioStream: React.Dispatch<React.SetStateAction<Blob | null>>
}

const HomePage = ({ setFile, setAudioStream }: HomePageProps) => {
  const [recordingStatus, setRecordingStatus] = useState<'recording' | 'inactive'>('inactive')
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [duration, setDuration] = useState(0)

  const mediaRecorder = useRef<MediaRecorder | null>(null)

  const mimeType = 'audio/webm'

  const startRecording = async () => {
    let tempStream: MediaStream
    console.log('Start Recording');

    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
      tempStream = streamData
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('An unknown error occurred');
      }
      return;
    }
    setRecordingStatus('recording')

    // create new Media recorder instance using the stream
    const media = new MediaRecorder(tempStream, { mimeType })
    mediaRecorder.current = media

    mediaRecorder.current.start()
    const localAudioChunks: Blob[] = []
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return
      if (event.data.size === 0) return
      localAudioChunks.push(event.data)
    }
    setAudioChunks(localAudioChunks)
  }

  const stopRecording = async () => {
    setRecordingStatus('inactive')
    console.log('Stop Recording');
    if (mediaRecorder.current) {
      mediaRecorder.current.stop()
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType })
        setAudioStream(audioBlob)
        setAudioChunks([])
        setDuration(0)
      }
    }
  }

  useEffect(() => {
    if (recordingStatus === 'inactive') return

    const interval = setInterval(() => {
      setDuration(curr => curr + 1)
    }, 1000)

    return () => clearInterval(interval)
  })

  return (
    <main className="flex-1 flex flex-col text-center gap-3 sm:gap-4 md:gap-5 justify-center p-4 pb-20">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">Ton<span className="text-blue-400 bold">Scribe</span></h1>
      <h3 className="font-medium md:text-lg">Record <span className="text-blue-400">&rarr;</span> Transcribe <span className="text-blue-400">&rarr;</span> Translate</h3>
      <button
        onClick={recordingStatus === 'recording' ? stopRecording : startRecording}
        className="flex specialBtn px-4 py-2 rounded-xl items-center justify-between gap-4 text-base w-72 max-w-full mx-auto my-4"
      >
        <p className="text-blue-400">
          {recordingStatus === 'inactive' ? 'Record' : 'Stop Recording'}
        </p>
        <div className="flex items-center gap-2">
          {duration !== 0 && (
            <p className='text-sm'>{duration}s</p>
          )}
          <i className={"fa-solid duration-200 fa-microphone " + (recordingStatus === 'recording' && 'text-rose-300')}></i>
        </div>
      </button>
      <p className="text-base">Or <label className="text-blue-400 cursor-pointer hover:text-blue-600 duration-200">upload <input onChange={(e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          const tempFile = files[0];
          setFile(tempFile);
        }
      }} className="hidden" type="file" accept=".mp3, .wave" /></label> a mp3 file</p>
      <p className="italic text-slate-400">Free now free forever</p>
    </main>
  )
}

export default HomePage