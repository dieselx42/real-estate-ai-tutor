'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // To navigate back to the test page

export default function Profile() {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('English');
  const [education, setEducation] = useState('');
  const [knowledgeLevel, setKnowledgeLevel] = useState('Beginner');
  const [learningStyle, setLearningStyle] = useState('Textual');

  // Load saved data from localStorage when the page loads
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setName(parsedProfile.name || '');
      setLanguage(parsedProfile.language || 'English');
      setEducation(parsedProfile.education || '');
      setKnowledgeLevel(parsedProfile.knowledgeLevel || 'Beginner');
      setLearningStyle(parsedProfile.learningStyle || 'Textual');
    }
  }, []);

  // Save the data to localStorage when the form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData = { name, language, education, knowledgeLevel, learningStyle };
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    alert('Profile saved successfully!');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Profile Page</h1>
      <p className="mb-4 text-lg">Set up your profile here!</p>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Name (Optional):</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">First Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Education Background:</label>
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
            placeholder="Enter your education background"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Real Estate Knowledge Level:</label>
          <select
            value={knowledgeLevel}
            onChange={(e) => setKnowledgeLevel(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Preferred Learning Style:</label>
          <select
            value={learningStyle}
            onChange={(e) => setLearningStyle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
          >
            <option value="Textual">Textual</option>
            <option value="Visual">Visual</option>
            <option value="Interactive">Interactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full"
        >
          Save Profile
        </button>
      </form>

      {/* Add a link to go back to the test page */}
      <div className="mt-6">
        <Link href="/" legacyBehavior>
          <a className="text-blue-500 hover:underline">Go back to take the test</a>
        </Link>
      </div>
    </div>
  );
}
