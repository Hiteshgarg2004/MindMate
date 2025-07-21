import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 text-gray-800">
      <div className="flex items-center space-x-3 mb-6">
        <ShieldCheck className="text-blue-600" size={32} />
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
      </div>

      <p className="text-lg mb-8 text-gray-600">
        Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
        <p className="text-gray-700">
          We collect basic information such as your email and journal entries to personalize your experience. All entries are stored securely and are only accessible to you.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
        <p className="text-gray-700">
          Your data is used to provide insights, track mood patterns, and enhance your journaling experience. We never sell your information to third parties.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">3. Data Security</h2>
        <p className="text-gray-700">
          We use industry-standard encryption and security practices to keep your data safe. Access to your journal is restricted and protected.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">4. Your Rights</h2>
        <p className="text-gray-700">
          You can request to view or delete your data at any time. Simply contact our support team, and we will assist you promptly.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">5. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions or concerns about this Privacy Policy, please email us at{' '}
          <a href="mailto:support@mindmate.com" className="text-blue-600 underline hover:text-blue-800">
            support@mindmate.com
          </a>.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-12 text-center">
        &copy; {new Date().getFullYear()} MindMate. All rights reserved.
      </p>
    </div>
  );
}
