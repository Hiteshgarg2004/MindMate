import React from 'react';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 text-gray-800">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="text-blue-600" size={32} />
        <h1 className="text-4xl font-bold">Terms of Service</h1>
      </div>

      <p className="text-lg mb-8 text-gray-600">
        Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p className="text-gray-700">
          By using MindMate, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the application.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">2. User Responsibilities</h2>
        <p className="text-gray-700">
          You are responsible for the accuracy of the information you provide and for keeping your login credentials secure. Any misuse of the platform may result in suspension of your account.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">3. Intellectual Property</h2>
        <p className="text-gray-700">
          All content and materials available on MindMate, including branding and software, are the intellectual property of MindMate and protected by applicable laws.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">4. Termination</h2>
        <p className="text-gray-700">
          We reserve the right to suspend or terminate your access to the app at any time, with or without notice, if we believe you have violated these terms.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">5. Modifications</h2>
        <p className="text-gray-700">
          MindMate reserves the right to update or change these Terms of Service at any time. Continued use of the platform after changes indicates your acceptance.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">6. Contact Information</h2>
        <p className="text-gray-700">
          For any questions about these terms, please contact us at{' '}
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
