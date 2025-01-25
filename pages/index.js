
// components/ClientOnlyComponent.js
import { useCallback, useEffect, useState, useRef } from 'react'


function Home() {
  const token = useRef(null);
  const [history, setHistory] = useState([ //Model complains if first message is not from user. Mocking user message.
    { "role": "user", "parts": [{ "text": "Hello" }] },
    {
      "role": "model",
      "parts": [{ "text": "Hello! Welcome to the fun AI game of guess the person. I have randomly choosen a public personality in my brain(Yea i know i got no real brain but lets assume for now). The way you win the game is by guessing who the person is. But it is not so easy, I will not reveal the name of the person but you can talk to me and ask information about the person and see if you can guess who it is. All the best" }]
    }])
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const renderingHistory = history.slice(1);
  const bottomRef = useRef(null);
  const textAreaRef = useRef(null);

  const handleSubmit = async (e) => {
    const promptTemp = prompt;
    e.preventDefault();
    setIsSubmitting(true);  
    setPrompt("");
    const requestHistory = [
      ...history
    ];
    setHistory((oldValue)=> {
      return [
        ...oldValue,
        {"role": "user", "parts": [{"text": prompt}]},
        {"role": "model", "parts": [{"text": "......"}]}
      ]
    });
    try {
      const data = {
        token: token.current,
        prompt: promptTemp,
        history:requestHistory
      }
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      const result = await res.json();
      setHistory((oldValue)=> {
        const arrayToSlice = oldValue.slice(0, oldValue.length - 1);
        return [
          ...arrayToSlice,
          {"role": "model", "parts": [{"text": result.message}]}
        ]
      });
    } catch (err) {
    } finally {
      setIsSubmitting(false);  // Reset the submission state
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Prevent the default Enter key behavior (creating a new line)
      e.preventDefault();
      handleSubmit(e); // Call the form submit handler
    }
  };
  useEffect(() => {
    token.current = crypto.randomUUID();
  },[token]);

  useEffect(() => {
    // Scroll to bottom of the container only if there are messages
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    if(textAreaRef.current){
      textAreaRef.current.focus();
    }
  }, [history]);
  return (
    <main className="m-4" suppressHydrationWarning>
      <div className="flex h-[97vh] w-full flex-col" >
        <div
          className="flex-1 space-y-6 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-300 sm:text-base sm:leading-7"
        >
          {renderingHistory.map(render => {
            return render.role == "model" ? (<div className="flex items-start">
              <div
                className="flex rounded-b-xl rounded-tr-xl bg-slate-50 p-4 dark:bg-slate-800 sm:max-w-md md:max-w-2xl"
              >
                 {render.parts[0].text}
              </div>
            </div>) : (<div className="flex flex-row-reverse items-start">
              <div
                className="flex min-h-[85px] rounded-b-xl rounded-tl-xl bg-slate-50 p-4 dark:bg-slate-800 sm:min-h-0 sm:max-w-md md:max-w-2xl"
              >
                <p>
                 {render.parts[0].text}
                </p>
              </div>
            </div>)
          })}
          <div ref={bottomRef}/>

        </div>
        <form className="mt-2" onSubmit={handleSubmit}>
        <label htmlFor="chat-input" className="sr-only">Enter your guess or ask the AI for clues</label>

          <div className="relative">
            <textarea
              id="chat-input"
              className="block w-full resize-none rounded-xl border-none bg-slate-200 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-600 sm:text-base"
              placeholder="Enter your guess or ask the AI for clues"
              rows="1"
              required
              value={prompt}
              onChange={(e)=> setPrompt(e.target.value)}
              disabled={isSubmitting}
              onKeyDown={handleKeyDown}
              ref={textAreaRef}
            ></textarea>
            <button
              type="submit"
              className="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base"
              disabled={isSubmitting}
            >
              Send <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Home
