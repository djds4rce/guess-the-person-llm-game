
// components/ClientOnlyComponent.js
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faUser, faPaperPlane } from "@fortawesome/free-solid-svg-icons";




function Home() {
  const token = useRef(null);
  const [history, setHistory] = useState([ //Model complains if first message is not from user. Mocking user message.
    {
      "role": "user", "parts": [{ "text": "Hello" }],
    }, {
      "role": "model", "parts": [{ "text": "....." }],
    }]);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState("landing");
  const [finalMessage, setFinalMessage] = useState("");
  const [finalState, setFinalState] = useState(false);


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
    setHistory((oldValue) => {
      return [
        ...oldValue,
        { "role": "user", "parts": [{ "text": prompt }] },
        { "role": "model", "parts": [{ "text": "......" }] }
      ]
    });
    try {
      const data = {
        token: token.current,
        prompt: promptTemp,
        history: requestHistory
      }
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      const result = await res.json();
      handleResponse(result, setHistory);
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

  const init = (token, history, setHistory, setIsSubmitting, view) => {
    if (view == "landing") {
      loadFirstPrompt(token, history, setHistory, setIsSubmitting);
    }
  }

  const loadFirstPrompt = async(token, history, setHistory, setIsSubmitting) =>{
    const data = {
      token: token.current,
      prompt: "hello",
      history: []
    }
    setIsSubmitting(true);
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    }).then(async (res) => {
      const result = await res.json();
      setIsSubmitting(false);
      setHistory(() => {
        return [
          { "role": "user", "parts": [{ "text": prompt }] },
          { "role": "model", "parts": [{ "text": result.message }] }
        ]
      });
    });
  }

  const handleResponse = (result, setHistory) => {
    const text = result.message;
 
    if (text.includes("END_OF_ROUND") || text.includes("END_OF_ROUND_FAIL")) {
        const isPass = text.includes("END_OF_ROUND") && ! text.includes("END_OF_ROUND_FAIL");
        let cleanedText = text.replace(/END_OF_ROUND/g, '');
        cleanedText = cleanedText.replace(/_FAIL/g, '');
        setFinalMessage(cleanedText);
        setFinalState(isPass);
        setView("end");
    } else {
      setHistory((oldValue) => {
        const arrayToSlice = oldValue.slice(0, oldValue.length - 1);
        return [
          ...arrayToSlice,
          { "role": "model", "parts": [{ "text": result.message }] }
        ]
      });
    }
  }

  useEffect(() => {
    token.current = crypto.randomUUID();
    init(token, history, setHistory, setIsSubmitting, view);
  }, []);

  const startGame = () => {
    setView("chat");
  };

  useEffect(() => {
    // Scroll to bottom of the container only if there are messages
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [history]);

  const restartGame = () => {
    setView("chat");
    setHistory([{
      "role": "user", "parts": [{ "text": "Hello" }],
    }, {
      "role": "model", "parts": [{ "text": "....." }],
    }]);
    token.current = crypto.randomUUID();
    loadFirstPrompt(token, history, setHistory, setIsSubmitting);
  }


  return (
    <React.Fragment>

      {view === "landing" ? (<div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-transparent bg-[#4a8394] bg-clip-text bg-gradient-to-r mb-4">
            AI Charades
          </h1>
          <p className="text-lg text-gray-600 mb-8">Welcome, detective! Prepare yourself for a thrilling game of "Guess the Personality." I'm a famous person, and it's your job to figure out who I am. </p>
          <p className="text-lg text-gray-600 mb-8">I am powered by AI to answer your questions in the character of the person you are trying to guess. Use your wits to uncover my secret identity through our chat. Let the games begin!</p>

          <a onClick={startGame} className="inline-block bg-[#4a8394] text-white px-6 py-3 rounded-lg text-lg font-medium">
            Play Now!
          </a>
        </div>
      </div>) : null}
      {view === "chat" ? <div className="container mx-auto h-[88vh] sm:h-[85vh] flex flex-col">
        <div className="p-4 rounded-lg shadow-md mb-2">
          <h1 className="text-xl font-bold text-[#4a8394]">AI Charades</h1>
        </div>
        <div className="flex-grow overflow-y-auto border-gray-900 p-4 mb-2">
          {renderingHistory.map(render => {
            return render.role == "model" ? (<div className="mb-4">
              <div className="flex items-start justify-end">
                <div className="bg-white rounded-lg p-4 mr-2 max-w-[80%] border-2">
                  <p className="text-gray-800">{render.parts[0].text}</p>
                </div>
                <div className="bg-[#4a8394] text-white rounded-full p-2"><FontAwesomeIcon icon={faRobot} className="fas fa-robot"
                ></FontAwesomeIcon></div>
              </div>
            </div>) : (
              <div className="mb-4">
                <div className="flex items-start">
                  <div className="bg-[#add2e4] rounded-full p-2 mr-2"><FontAwesomeIcon className='fas fa-user' icon={faUser} /></div>
                  <div className="bg-white rounded-lg p-4 border-1">
                    <p className="text-gray-800">{render.parts[0].text}</p>
                  </div>
                </div>
              </div>)
          })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center rounded-lg shadow-xl border-gray-500 p-6 mb-4">

            <input
              id="chat-input"
              className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your guess or ask me clues"
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isSubmitting}
              onKeyDown={handleKeyDown}
              ref={textAreaRef}
            ></input>
            <button
              type="submit"
              className="bg-[#4a8394] hover:bg-[#e6b836] text-white font-bold py-2 px-4 mx-2 rounded-r-md border-l border-gray-300"
              disabled={isSubmitting}
            >
              <FontAwesomeIcon className='fas fa-paper-plane' icon={faPaperPlane} />
            </button>

          </div>
        </form>
      </div> : null}
      { view==="end" ? (<div className="container mx-auto p-8">
        <div className="bg-white flex flex-col items-center rounded-lg shadow-md p-6 ">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r bg-[#4a8394] mb-4">{ finalState ? "You guessed correctly!" : "You gave up :(" }</h1>
            <p className="text-lg mb-6">{finalMessage}</p>
            <p className="text-lg mb-6">Thank you for playing. We hope you had fun!</p>

            <div onClick={restartGame} className="flex justify-center">
                <a className="inline-block bg-[#4a8394] text-white px-6 py-3 rounded-lg text-lg font-medium">
                    Play Again!
                </a>
            </div>
        </div>
    </div>) : null}
    </React.Fragment>
  )
}

export default Home
