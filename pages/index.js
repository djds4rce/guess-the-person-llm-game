
// components/ClientOnlyComponent.js
import { useCallback, useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faUser, faPaperPlane } from "@fortawesome/free-solid-svg-icons";




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
    document.querySelector("body").classList.add("bg-gray-100");
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
<div class="container mx-auto px-4 py-8 pb-16 h-screen flex flex-col">  
  <div class="bg-white p-4 rounded-lg shadow-md mb-4">
        <h1 class="text-2xl font-bold text-gray-800">AI Charades</h1> 
        <p class="text-gray-600 text-sm">Play the AI guessing game.</p> 
    </div>   
    <div class="flex-grow overflow-y-auto bg-[#FAF9F6] border border-gray-400 rounded-lg shadow-md p-6 mb-4">
          {renderingHistory.map(render => {
            return render.role == "model" ? (<div class="mb-4">
              <div class="flex items-start justify-end">
                  <div class="bg-white rounded-lg p-4 mr-2 max-w-[80%]">
                      <p class="text-gray-800">{render.parts[0].text}</p>
                  </div>
                  <div class="bg-[#F2C94C] text-white rounded-full p-2"><FontAwesomeIcon icon={faRobot} className="fas fa-robot" 
                  ></FontAwesomeIcon></div> 
              </div>
          </div>) : (
             <div class="mb-4">
             <div class="flex items-start">
                 <div class="bg-gray-300 rounded-full p-2 mr-2"><FontAwesomeIcon className='fas fa-user' icon={faUser}/></div> 
                 <div class="bg-white rounded-lg p-4">
                     <p class="text-gray-800">{render.parts[0].text}</p>
                 </div>
             </div>
         </div>)
          })}
          <div ref={bottomRef}/>
      </div>
      <form  onSubmit={handleSubmit}>
       <div class="flex justify-center">
        
            <input
              id="chat-input"
              className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your guess or ask the AI for clues"
              required
              value={prompt}
              onChange={(e)=> setPrompt(e.target.value)}
              disabled={isSubmitting}
              onKeyDown={handleKeyDown}
              ref={textAreaRef}
            ></input>
            <button
              type="submit"
              className="bg-[#F2C94C] hover:bg-[#e6b836] text-white font-bold py-2 px-4 mx-2 rounded-r-md border-l border-gray-300"
              disabled={isSubmitting}
            >
              <FontAwesomeIcon className='fas fa-paper-plane' icon={faPaperPlane}/>
            </button>

        </div>
        </form>
      </div>
        )
}

export default Home
