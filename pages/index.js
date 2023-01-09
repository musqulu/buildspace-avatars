import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  //create state property
  const [input, setInput] = useState('');

  // Create new state property
  const [img, setImg] = useState('');

  const onChange = (event) => {
    setInput(event.target.value);
  };
  // Add generateAction
  const generateAction = async (req, res) => {
    console.log('Received request');

    const input = JSON.parse(req.body).input;

    const response = await fetch(
      `https://api-inference.huggingface.co/models/buildspace/ai-avatar-generator`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: input,
        }),
      }
    );

    // Check for different statuses to send proper payload
    if (response.ok) {
      const buffer = await response.buffer();
      res.status(200).json({ image: buffer });
    } else if (response.status === 503) {
      const json = await response.json();
      res.status(503).json(json);
    } else {
      const json = await response.json();
      res.status(response.status).json({ error: response.statusText });
    }
  };

  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Random photo generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Turn me into anyone you want! Make sure you refer to me as "tgp" in the prompt</h2>
          </div>
          <div className="prompt-container">
            {/* Add onChange property */}
            <input className="prompt-box" value={input} onChange={onChange} />
            <div className="prompt-buttons">
              <a className="generate-button" onClick={generateAction}>
                <div className="generate">
                  <p>Generate</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-avatar"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
