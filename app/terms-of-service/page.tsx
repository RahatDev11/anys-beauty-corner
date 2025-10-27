'use client';

import React from 'react';

const TermsOfServicePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-white pt-24 md:pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-lipstick-dark mb-12">
          সেবার শর্তাবলী
        </h1>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-2xl font-bold text-lipstick-dark mb-4">১. সাধারণ শর্তাবলী</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              এই ওয়েবসাইট এবং এর সমস্ত সামগ্রী Any's Beauty Corner দ্বারা পরিচালিত হয়। আমাদের ওয়েবসাইট ব্যবহার করে, আপনি এই শর্তাবলী মেনে চলতে সম্মত হচ্ছেন।
            </p>
            <p className="text-gray-700 leading-relaxed">
              আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করি। পরিবর্তনগুলি অবিলম্বে কার্যকর হবে এবং আপনার ওয়েবসাইট ব্যবহার অব্যাহত রাখা মানে আপডেট করা শর্তাবলী গ্রহণ করা।
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-2xl font-bold text-lipstick-dark mb-4">২. পণ্য এবং মূল্য</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>আমরা আমাদের ওয়েবসাইটে প্রদর্শিত সমস্ত পণ্যের উপলব্ধতা গ্যারান্টি দিই না।</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>মূল্য যেকোনো সময় পরিবর্তন হতে পারে কোনো পূর্ব বিজ্ঞপ্তি ছাড়াই।</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>আমরা ত্রুটিপূর্ণ মূল্য নির্ধারণের জন্য দায়বদ্ধ নই।</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>সমস্ত পণ্য বর্ণনা অনুমানমূলক এবং সম্পূর্ণ নির্ভুলতার জন্য গ্যারান্টিযুক্ত নয়।</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-2xl font-bold text-lipstick-dark mb-4">৩. অর্ডার এবং পেমেন্ট</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>আপনার অর্ডার একটি আইনি অফার যা আমরা গ্রহণ বা প্রত্যাখ্যান করতে পারি।</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>পেমেন্ট অর্ডার নিশ্চিত করার আগে প্রক্রিয়া করা হবে।</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>আমরা সমস্ত প্রধান পেমেন্ট পদ্ধতি গ্রহণ করি।</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>আপনি আপনার পেমেন্ট তথ্যের গোপনীয়তা বজায় রাখতে দায়বদ্ধ।</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-2xl font-bold text-lipstick-dark mb-4">৪. ডেলিভারি এবং রিটার্ন</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>ডেলিভারির সময় অনুমানমূলক এবং গ্যারান্টিযুক্ত নয়।</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>ক্ষতিগ্রস্ত পণ্য ডেলিভারির ৭ দিনের মধ্যে রিপোর্ট করতে হবে।</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>রিটার্ন নীতি আমাদের রিটার্ন পেজে বিস্তারিতভাবে বর্ণিত।</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark font-bold mr-3">•</span>
                <span>ডেলিভারি সম্পর্কিত সমস্যার জন্য আমাদের সাথে যোগাযোগ করুন।</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-2xl font-bold text-lipstick-dark mb-4">৫. দায়বদ্ধতা সীমাবদ্ধতা</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Any's Beauty Corner এবং এর মালিক, কর্মচারী এবং এজেন্টরা কোনো পরোক্ষ, আকস্মিক, বিশেষ বা ফলাফলমূলক ক্ষতির জন্য দায়বদ্ধ নয়।
            </p>
            <p className="text-gray-700 leading-relaxed">
              আমাদের মোট দায়বদ্ধতা আপনার দ্বারা প্রদত্ত পণ্যের মূল্যের সীমাবদ্ধ।
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-2xl font-bold text-lipstick-dark mb-4">৬. বৌদ্ধিক সম্পত্তি</h2>
            <p className="text-gray-700 leading-relaxed">
              এই ওয়েবসাইটের সমস্ত সামগ্রী, লোগো, ছবি এবং পাঠ্য Any's Beauty Corner এর সম্পত্তি এবং আইন দ্বারা সুরক্ষিত। অনুমতি ছাড়া কোনো অংশ পুনরুত্পাদন করা যায় না।
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-2xl font-bold text-lipstick-dark mb-4">৭. আইনি সম্মতি</h2>
            <p className="text-gray-700 leading-relaxed">
              আপনি এই ওয়েবসাইট ব্যবহার করে সমস্ত প্রযোজ্য আইন এবং প্রবিধান মেনে চলতে সম্মত হচ্ছেন। আপনি এই শর্তাবলী লঙ্ঘন করে এমন কোনো কার্যকলাপে জড়িত হবেন না।
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-2xl font-bold text-lipstick-dark mb-4">৮. যোগাযোগ</h2>
            <p className="text-gray-700 leading-relaxed">
              এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:
            </p>
            <p className="text-gray-700 mt-4">
              <strong>ফোন:</strong> 01931866636<br />
              <strong>ইমেইল:</strong> info@anysbeautycorner.com
            </p>
          </section>

          {/* Last Updated */}
          <div className="text-center text-gray-600 text-sm mt-12">
            <p>সর্বশেষ আপডেট: অক্টোবর ২০২৫</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsOfServicePage;

