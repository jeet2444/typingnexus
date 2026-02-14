import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getAdminStore, Passage } from '../utils/adminStore';
import { useAuth } from '../context/AuthContext';

const ExamInstructions: React.FC = () => {
    const { type, id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Params from Setup Page
    const passageId = searchParams.get('passageId');
    const limit = searchParams.get('limit') || '600';
    const lang = searchParams.get('lang') || 'English';
    const date = searchParams.get('date');

    const [passage, setPassage] = useState<Passage | null>(null);

    useEffect(() => {
        if (passageId) {
            const store = getAdminStore();
            const p = store.passages?.find(px => px.id === parseInt(passageId));
            setPassage(p || null);
        }
    }, [passageId]);

    const handleStart = () => {
        if (type === 'word' || type === 'excel') {
            navigate(`/test/${type}/${id}`);
        } else {
            navigate(`/test/custom?${searchParams.toString()}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Top Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Personal Info */}
                    <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Personal Information</div>
                        <div className="font-bold text-xl text-gray-800">{currentUser?.name || "Guest User"}</div>
                    </div>

                    {/* Card 2: Test Description */}
                    <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Test Description</div>
                        <div className="font-bold text-xl text-gray-800">
                            {type === 'word' ? 'Word Formatting Test' : type === 'excel' ? 'Excel Efficiency Test' : `${lang} Typing Test`} <br />
                            <span className="text-sm font-normal text-gray-600">({type ? 'Full Marks: 50' : `${limit} Words Limit`})</span>
                        </div>
                    </div>

                    {/* Card 3: Test Details */}
                    <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">{type ? 'Test Id' : 'Passage Detail'}</div>
                        <div className="font-bold text-xl text-gray-800">
                            {type ? `Test #${id || 1}` : `Id- ${passageId} - ${passage?.title || "Loading..."}`}
                        </div>
                    </div>
                </div>

                {/* Instructions Section */}
                <div>
                    <h1 className="text-4xl font-bold mb-6 text-black">Instructions:</h1>

                    <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
                        <div className="space-y-4 text-sm md:text-base text-gray-800 leading-relaxed font-medium">
                            {(type === 'word' || type === 'excel') ? (
                                <>
                                    <p>1. This is a computer proficiency test focusing on <span className="font-bold">{type === 'word' ? 'Document Formatting' : 'Excel Spreadsheet Efficiency'}.</span></p>
                                    <p>2. You will be given {type === 'word' ? 'formatting tasks' : 'data entry and formula tasks'} to complete within the time limit.</p>
                                    <p>3. Total duration of this test is <span className="font-bold">10:00 minutes.</span></p>
                                    <p>4. Total marks for this test is <span className="font-bold">50.</span> Each task carries specific weightage.</p>
                                    <p>5. The counting timer in the top right corner of the screen will display the remaining time.</p>
                                    <p>6. For Word: Ensure you follow the instructions for Font, Bold, Italic, Tables, and Alignment exactly as mentioned.</p>
                                    <p>7. For Excel: accurately type data into the specified columns and use the correct formulas (SUM, AVG, etc.) where required.</p>
                                    <p>8. Click 'Submit' when you have finished all tasks. Assessment is automatic.</p>
                                </>
                            ) : (
                                <>
                                    <p>1. The candidates will be provided with the master text passage of about <span className="font-bold">{limit} words in {lang}.</span></p>
                                    <p>2. The typing can be of either word based typing or key strokes based typing.</p>
                                    <p>3. For example, 35 w.p.m. is about 10500 key depressions per hour and 30 w.p.m. corresponds to about 9000 key depression per hour.</p>
                                    <p>4. Time duration of <span className="font-bold">{lang} typing test is 10:00 minute.</span></p>
                                    <p>5. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer, reaches zero, the examination will end by itself with typed passage, you are not required to end or submit your test.</p>
                                    <p>6. <span className="font-bold">Candidates are not required to repeat the passage</span>, if he/she has completed the passage once and has time in his/her disposal, however they are allowed to revise and correct their mistakes and inaccuracies, if any, during the prescribed time</p>
                                    <p>7. After every Punctuation mark, only One space is to be inserted, e.g. after comma, full stop, mark of interrogation etc. However, candidates are advised to follow the Question paper scrupulously in this regard.</p>
                                    <p>8. The combination of alphanumeric keys followed by one space is termed as one "Word".</p>
                                    <p>9. Once you have completed typing of the given passage and you do not find any errors or mistakes in it, you may submit it by pressing the submit button. After submission no editing or change in the typed passage is possible.</p>
                                    <p>10. If, your computer is locked/switched off or for any type of technical help, please inform a nearby invigilator immediately.</p>
                                    <p>11. In any case of auto restart of the computer, you will be again provided with the full time to type the given passage.</p>
                                    <p>12. After typing given number of words in the master text passage the space bar will not allow further typing of additional words.</p>
                                </>
                            )}
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={handleStart}
                                className="bg-black text-white px-8 py-3 rounded font-bold hover:bg-gray-800 transition-colors"
                            >
                                {type ? 'Start Test' : 'Start Typing'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExamInstructions;
