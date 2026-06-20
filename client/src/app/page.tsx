"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [longURL, setLongUrl] = useState("");
  const [shortURL, setShortUrl] = useState("");
  const [generatedShortUrl, setGeneratedShortUrl] = useState("");
  const [retreivedLongUrl, setRetreivedLongUrl] = useState("");
  const [error, setError] = useState("");

  const handleGenerateShortUrl = async () => { };

  const handleRetreiveLongUrl = async () => { };




  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 font-serif">
        Welcome to microURL SaaS
      </h1>

      {/* generate a new short url*/}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4 font-serif">
          Generate New Short URL
        </h2>

        <input type="text"
          placeholder="Enter long URL"
          value={longURL}
          onChange={(e) => setLongUrl(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-200" />

        <button onClick={handleGenerateShortUrl} className="w-full mt-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white transition-colors">
          Generate Short URL
        </button>

        {generatedShortUrl && (
          <p className="mt-4 text-green-500">
            Short URL: <a href={`/${generatedShortUrl}`} target="_blank"></a>
          </p>
        )}
      </div>

      {/* retreive long url from short url */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 font-serif">
          Get your Long URL
        </h2>
        <input type="text"
          placeholder="Enter short URL ID"
          value={shortURL}
          onChange={(e) => setShortUrl(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-200" />

        <button onClick={handleRetreiveLongUrl} className="w-full mt-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-white transition-colors">
          Get Long URL
        </button>

        {retreivedLongUrl && (
          <p className="mt-4 text-green-500">
            Long URL: <a href={retreivedLongUrl} target="_blank">{retreivedLongUrl}</a>
          </p>
        )}
      </div>

    </div>
  );
}
