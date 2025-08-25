"use client";

import React, { useState } from "react";
import Link from 'next/link';
import Reveal from './Reveal';

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-5">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full border ${
            isOpen
              ? "bg-orange-500 border-orange-500"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="white"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="gray"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
        </span>
      </button>

      {isOpen && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{answer}</p>
      )}
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "Will this help me bypass AI detectors like Turnitin or GPTZero?",
      answer:
        "Yes, our AI humanizer is designed to help you bypass even the most advanced AI detectors, including Turnitin and GPTZero.",
    },
    {
      question: "Do you store my content?",
      answer:
        "No, we do not store your content. Your privacy is our top priority. All content is processed and then immediately deleted from our servers.",
    },
    {
      question: "Do I need to create an account to use the tool?",
      answer:
        "You can use our basic tools without an account. For advanced features and higher usage limits, creating a free account is recommended.",
    },
    {
      question: "What if the rewrite still sounds robotic?",
      answer:
        "Our rewriting system is built to produce natural, human-like text. If it still sounds robotic, you can run it through the tool again or tweak it manually.",
    },
    {
      question: "Can it rewrite essays, emails, or marketing copy?",
      answer:
        "Absolutely. Whether you're working with essays, blog posts, emails, or ChatGPT output, our tool helps you humanize AI text and refine it for tone, clarity, and detection safety.",
    },
    {
      question: "Does this pass Turnitin AI detection?",
      answer:
        "Our paraphrasing and humanizing technology is specifically engineered to produce content that is not flagged by Turnitin's AI detection system.",
    },
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Have questions? We've got answers. If you can't find what you're looking for, feel free to <Link href="/contact" className="text-orange-500 hover:underline">contact us</Link>.
            </p>
          </div>
        </Reveal>
        <div className="mt-12">
          {faqData.map((faq, index) => (
            <Reveal key={index} delay={index * 0.05}>
              <FaqItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
