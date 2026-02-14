import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Clock, Type, FileText, User } from 'lucide-react';
import { getAdminStore } from '../utils/adminStore';

const ExamDetail: React.FC = () => {
  const { id } = useParams();
  const store = getAdminStore();
  const exam = store.exams.find(e => e.id.toString() === id) || store.exams[0];

  const title = exam?.title || "RSSB LDC/Jr. Asst. Hindi Typing (Rajasthan)";
  const dateAdded = "Feb 22, 2025";

  return (
    <div className="bg-[#fcf8f2] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-bold text-gray-500 mb-4 tracking-wide uppercase">Date Added - {dateAdded}</p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight max-w-3xl">
              {title}
            </h1>
            <Link to="/exams" className="flex items-center gap-2 text-sm font-bold border-b-2 border-transparent hover:border-brand-black transition-all">
              Explore all exams <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="w-full h-px bg-gray-300 mb-12"></div>

        {/* Content Layout */}
        <div className="grid md:grid-cols-3 gap-12">

          {/* Main Info */}
          <div className="md:col-span-2 space-y-12">

            {/* About Section */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 text-brand-purple">About</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                RSSB / RSMSSB has released notification for recruitment on the posts of LDC Grade II and Junior Assistant in Rajasthan Public Service Commission (RPSC) and Rajasthan Secretariat. Advertisement for direct recruitment (Advertisement No. 06/2024) was released on 13 February 2024, detailing 4197 vacancies. The application process started on 20 February 2024...
              </p>
              <button className="bg-brand-yellow text-xs font-bold px-3 py-1 rounded-sm hover:bg-yellow-400 transition-colors">
                Read more
              </button>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <h3 className="text-xl font-display font-bold mb-2">Languages</h3>
                <p className="text-gray-600 font-medium">Hindi - DevLys</p>
              </div>

              <div>
                <h3 className="text-xl font-display font-bold mb-2">Students using this exam</h3>
                <p className="text-gray-600 font-medium">
                  {(() => {
                    // Stable random seed from ID
                    const idStr = (exam?.id || 1).toString();
                    let seed = 0;
                    for (let i = 0; i < idStr.length; i++) seed += idStr.charCodeAt(i);
                    // Base: stable random 3-digit number (100-999)
                    const baseOffset = 100 + (seed % 900);
                    // Reference: Feb 4, 10:45 PM
                    const referenceTime = 1738708500000;
                    const timePassed = Math.max(0, Date.now() - referenceTime);
                    const increment = Math.floor(timePassed / (2 * 60 * 1000));
                    return (baseOffset + increment).toLocaleString();
                  })()} times
                </p>
              </div>

              <div>
                <h3 className="text-xl font-display font-bold mb-2">Words</h3>
                <p className="text-gray-600 font-medium">400</p>
              </div>

              <div>
                <h3 className="text-xl font-display font-bold mb-2">Time duration</h3>
                <p className="text-gray-600 font-medium">15:00 min.</p>
              </div>

              <div>
                <h3 className="text-xl font-display font-bold mb-2">Total Tests</h3>
                <p className="text-gray-600 font-medium">1000+ Tests</p>
              </div>

              <div>
                <h3 className="text-xl font-display font-bold mb-2">Live Passages</h3>
                <p className="text-gray-600 font-medium">Daily 6 new Passages</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link to={`/test/${id}`}>
                <button className="bg-brand-black text-white px-8 py-4 rounded-md font-bold text-lg hover:shadow-neo hover:-translate-y-1 transition-all flex items-center gap-3">
                  Get Started <ArrowRight size={20} />
                </button>
              </Link>
            </div>

          </div>

          {/* Decorative / Sidebar */}
          <div className="relative hidden md:block">
            {/* Abstract loop graphic matching screenshot style */}
            <svg className="absolute top-0 right-0 w-64 h-64 text-brand-black" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 150 C 50 50, 150 50, 150 150" stroke="currentColor" strokeWidth="2" />
              <path d="M150 150 C 150 200, 100 200, 80 160" stroke="currentColor" strokeWidth="2" />
              <path d="M80 160 C 60 120, 180 100, 180 180" stroke="currentColor" strokeWidth="2" />
            </svg>

            <div className="mt-40 bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
              <h4 className="font-bold mb-2">Quick Tips</h4>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li>Sit straight and keep your feet flat.</li>
                <li>Keep your wrists up, not resting on the desk.</li>
                <li>Focus on accuracy over speed initially.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExamDetail;