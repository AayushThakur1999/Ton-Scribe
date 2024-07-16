import { LANGUAGES } from "../utils/presets"

interface TranslationProps {
  textElement: string;
  toLanguage: string;
  translating: boolean;
  setToLanguage: (lang: string) => void;
  generateTranslation: () => void;
}

const Translation = ({
  textElement,
  toLanguage,
  translating,
  setToLanguage,
  generateTranslation
}: TranslationProps) => {
  return (
    <div className='flex flex-col gap-2 max-w-[400px] mx-auto'>
      {!translating && (<div className="flex flex-col gap-1">
        <p className="text-sm sm:text-sm font-medium text-slate-500 mx-auto">To language</p>
        <div className="flex items-stretch gap-2">
          <select value={toLanguage} className="flex-1 outline-none bg-white focus:outline-none border border-solid border-transparent hover:border-blue-300 duration-200 p-2 rounded" onChange={(e) => setToLanguage(e.target.value)}>
            <option value={'Select language'}>Select language</option>
            {Object.entries(LANGUAGES).map(([key, value]) => {
              return (
                <option key={key} value={value}>{key}</option>
              )
            })}
          </select>
          <button onClick={generateTranslation} className="specialBtn px-3 py-2 rounded-lg text-blue-400 hover:text-blue-600 duration-200">Translate</button>
        </div>
      </div>)}
      {(textElement && !translating) && (
        <p>{textElement}</p>
      )}
      {translating && (
        <div className="grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin"></i>
        </div>
      )}
    </div>
  )
}

export default Translation