import { useState } from "react";
import Header from "./components/Header"
import HomePage from "./components/HomePage"
import FileDisplay from "./components/FileDisplay";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [audioStream, setAudioStream] = useState<Blob | null>(null);

  const isAudioAvailable = file || audioStream;

  const handleAudioReset = () => {
    setFile(null)
    setAudioStream(null)
  }

  return (
    <div className='flex flex-col p-4 max-w-[1000px] mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header />
        {isAudioAvailable ? (
          <FileDisplay handleAudioReset={handleAudioReset} file={file} audioStream={audioStream} />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <footer></footer>
    </div>
  )
}

export default App
