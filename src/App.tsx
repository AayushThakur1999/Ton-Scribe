import { useEffect, useRef, useState } from "react";
import Header from "./components/Header"
import HomePage from "./components/HomePage"
import FileDisplay from "./components/FileDisplay";
import Information from "./components/Information";
import Transcribing from "./components/Transcribing";
import { MessageTypes } from './utils/presets'

export type OutputObject = {
  index: number;
  text: string;
  start: number;
  end: number;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [audioStream, setAudioStream] = useState<Blob | null>(null);
  const [output, setOutput] = useState<OutputObject[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const isAudioAvailable = file || audioStream;

  const handleAudioReset = () => {
    setFile(null)
    setAudioStream(null)
  }

  const worker = useRef<Worker | null>(null)

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/whisper.worker.ts', import.meta.url), {
        type: 'module'
      })
    }

    const onMessageReceived = async (e: MessageEvent) => {
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true)
          console.log('DOWNLOADING');
          break;
        case 'LOADING':
          setLoading(true)
          console.log('LOADING');
          break;
        case 'RESULT':
          setOutput(e.data.results)
          console.log(e.data.results);

          break;
        case 'INFERENCE_DONE':
          console.log('DONE');
          break;
      }
    }

    worker.current.addEventListener('message', onMessageReceived)

    return () => worker.current?.removeEventListener('message', onMessageReceived)
  })

  async function readAudioFrom(file: File | Blob) {
    const sampling_rate = 16000
    const audioCTX = new AudioContext({ sampleRate: sampling_rate })
    const response = await file.arrayBuffer()
    const decoded = await audioCTX.decodeAudioData(response)
    const audio = decoded.getChannelData(0)
    return audio
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) return

    const audioSource = file || audioStream;

    if (!audioSource) return;

    const audio = await readAudioFrom(audioSource)
    const model_name = `openai/whisper-tiny.en`

    worker.current?.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name
    })
  }

  return (
    <div className='flex flex-col p-4 max-w-[1000px] mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header />
        {output ? (
          <Information output={output} />
        ) : loading ? (
          <Transcribing downloading={downloading} />
        ) : isAudioAvailable ? (
          <FileDisplay handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} file={file} audioStream={audioStream} />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <footer></footer>
    </div>
  )
}

export default App
