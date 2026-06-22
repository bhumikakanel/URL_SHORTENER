"use client";
import { useState } from "react";


export default function Home() {
  const [longURL, setLongUrl] = useState("");
  const [shortURL, setShortUrl] = useState("");
  const [generatedShortUrl, setGeneratedShortUrl] = useState("");
  const [retreivedLongUrl, setRetreivedLongUrl] = useState("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleGenerateShortUrl = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ originalUrl: longURL })
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setError("");
        setRetreivedLongUrl("");
        setGeneratedShortUrl(data.shortUrl);
      } else {
        setError(data.error || "Failed to generate URL");
      }
    }
    catch (error) {
      console.log(error);
      setGeneratedShortUrl("");
      setError("Failed to generate short URL");
    }
  };

  const handleRetreiveLongUrl = async () => {

    try {
      const shortId = shortURL.split("/").pop();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lookup/${shortId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (response.ok) {
        setError("");
        setRetreivedLongUrl(data.data);
      } else {
        setError(data.error || "URL not found");
      }
    }
    catch (error) {
      console.log(error);
      setError("Failed to retrieve long URL");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedShortUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to copy URL");
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 font-serif">
        Welcome to microURL SaaS
      </h1>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-900 text-red-300 rounded-lg">
          {error}
        </div>
      )}

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
          <div className="mt-4">
            <p className="text-green-500 break-all">
              Short URL:
              <a
                href={generatedShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 underline"
              >
                {generatedShortUrl}
              </a>
            </p>

            <button
              onClick={handleCopy}
              className="mt-2 px-3 py-1 bg-green-600 rounded hover:bg-green-700"
            >
              Copy URL
            </button>
            {copied && (
              <p className="text-green-400 mt-2">
                Copied successfully!
              </p>
            )}
          </div>
        )}
      </div>

      {/* retreive long url from short url */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 font-serif">
          Get your Long URL
        </h2>
        <input type="text"
          placeholder="Enter short URL or ID"
          value={shortURL}
          onChange={(e) => setShortUrl(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-200" />

        <button onClick={handleRetreiveLongUrl} className="w-full mt-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-white transition-colors">
          Get Long URL
        </button>

        {retreivedLongUrl && (
          <p className="mt-4 text-green-500">
            Long URL: <a href={retreivedLongUrl} target="_blank" rel="noopener noreferrer">{retreivedLongUrl}</a>
          </p>
        )}
      </div>

    </div>
  );
}
