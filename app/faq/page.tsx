'use client';

import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQPage = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "আপনারা কোথায় ডেলিভারি করেন?",
      answer: "আমরা সারা বাংলাদেশে ডেলিভারি সেবা প্রদান করি। ঢাকার মধ্যে ১-২ দিন এবং অন্যান্য জেলায় ২-৫ দিনের মধ্যে ডেলিভারি হয়।"
    },
    {
      id: 2,
      question: "ডেলিভারি চার্জ কত?",
      answer: "ঢাকার মধ্যে ৬০ টাকা এবং অন্যান্য জেলায় ১০০-১৫০ টাকা ডেলিভারি চার্জ। ৫০০০ টাকার উপরে অর্ডারে ফ্রি ডেলিভারি পাবেন।"
    },
    {
      id: 3,
      question: "পণ্য রিটার্ন করতে পারব?",
      answer: "হ্যাঁ, ডেলিভারির ৭ দিনের মধ্যে অব্যবহৃত এবং আসল প্যাকেজিংয়ে থাকা পণ্য রিটার্ন করতে পারবেন। রিটার্ন শিপিং চার্জ আপনাকে বহন করতে হবে।"
    },
    {
      id: 4,
      question: "পেমেন্ট পদ্ধতি কী কী?",
      answer: "আমরা ক্যাশ অন ডেলিভারি, বিকাশ, নগদ, রকেট এবং ক্রেডিট/ডেবিট কার্ড গ্রহণ করি।"
    },
    {
      id: 5,
      question: "অর্ডার ট্র্যাক করতে পারব?",
      answer: "হ্যাঁ, আপনার অর্ডার নম্বর দিয়ে আমাদের 'অর্ডার ট্র্যাক' পেজে অর্ডার ট্র্যাক করতে পারবেন।"
    },
    {
      id: 6,
      question: "পণ্য খাঁটি তো?",
      answer: "হ্যাঁ, আমরা শুধুমাত্র প্রামাণিক এবং খাঁটি পণ্য বিক্রয় করি। আমাদের সরাসরি সরবরাহকারীদের কাছ থেকে পণ্য সংগ্রহ করি।"
    },
    {
      id: 7,
      question: "বাল্ক অর্ডারে ছাড় পাব?",
      answer: "হ্যাঁ, বড় পরিমাণে অর্ডারের জন্য বিশেষ ছাড় পাওয়া যায়। আমাদের সাথে যোগাযোগ করুন বিস্তারিত জানতে।"
    },
    {
      id: 8,
      question: "ক্ষতিগ্রস্ত পণ্য পেলে কী করব?",
      answer: "ডেলিভারির সময় পণ্য ক্ষতিগ্রস্ত থাকলে অবিলম্বে আমাদের জানান। আমরা তাৎক্ষণিক প্রতিস্থাপন বা রিফান্ড প্রদান করব।"
    },
    {
      id: 9,
      question: "নিউজলেটার সাবস্ক্রাইব করলে কী সুবিধা?",
      answer: "নিউজলেটার সাবস্ক্রাইবাররা নতুন পণ্য, বিশেষ অফার এবং এক্সক্লুসিভ ডিল সম্পর্কে প্রথম জানতে পারেন।"
    },
    {
      id: 10,
      question: "কাস্টমার সাপোর্ট কখন পাব?",
      answer: "আমরা সোমবার থেকে শুক্রবার সকাল ৯টা থেকে সন্ধ্যা ৬টা পর্যন্ত সেবা প্রদান করি। ফোন, ইমেইল বা হোয়াটসঅ্যাপের মাধ্যমে যোগাযোগ করুন।"
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-white pt-24 md:pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-lipstick-dark mb-4">
            সাধারণ প্রশ্নোত্তর
          </h1>
          <p className="text-lg text-gray-600">
            আপনার সমস্ত প্রশ্নের উত্তর এখানে পাবেন
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-lipstick/5 to-transparent hover:from-lipstick/10 transition-all duration-300"
              >
                <span className="text-left font-semibold text-gray-800 flex-1">
                  {item.question}
                </span>
                <span
                  className={`text-lipstick-dark text-2xl transition-transform duration-300 ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {openId === item.id && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Help Section */}
        <div className="mt-12 bg-gradient-to-r from-lipstick/10 to-transparent rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-lipstick-dark mb-4">
            আরও সাহায্য প্রয়োজন?
          </h2>
          <p className="text-gray-700 mb-6">
            আপনার প্রশ্নের উত্তর এখানে না পেলে, আমাদের সাথে যোগাযোগ করুন।
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="tel:01931866636"
              className="inline-block bg-gradient-to-r from-lipstick to-lipstick-dark text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              📞 ফোন করুন
            </a>
            <a
              href="/contact"
              className="inline-block bg-white text-lipstick-dark border-2 border-lipstick px-8 py-3 rounded-full font-semibold hover:bg-lipstick/5 transition-all duration-300"
            >
              📧 বার্তা পাঠান
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FAQPage;

