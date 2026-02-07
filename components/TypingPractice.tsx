import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';

// --- DATA SOURCE ---

const ENGLISH_ARTICLES = [
  "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human being what one wants the computer to do. Clean code always looks like it was written by someone who cares.",
  "Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them daily.",
  "The beauty of nature is everywhere to be seen. From the towering mountains to the deep blue oceans, the world is filled with wonder. Trees provide us with oxygen.",
  "Technology has transformed the way we live and work. Smartphones allow us to connect with anyone, anywhere in the world instantly. The internet provides access to infinite knowledge.",
  "Reading is to the mind what exercise is to the body. It expands our horizons and improves our focus. Through books, we can travel to different worlds and eras.",
  "Maintaining good health requires a balanced diet and regular exercise. Drinking plenty of water is essential for hydration. Sleep plays a vital role in mental and physical recovery.",
  "Space exploration challenges us to push the boundaries of what is possible. It drives innovation in technology and science. Looking up at the stars reminds us of how vast the universe is.",
  "The internet started as a small network for researchers and has grown into a global nervous system. It connects billions of people and devices. Information travels at the speed of light.",
  "Mindfulness is the practice of being present in the moment. It reduces stress and anxiety by calming the mind. Simple breathing exercises can help restore balance instantly.",
  "True leadership is not about being in charge, but about taking care of those in your charge. A good leader inspires others to achieve their best potential.",
  "Communication is the bridge between confusion and clarity. Effective communication involves listening as much as speaking. It helps in building strong relationships personally and professionally.",
  "Sustainable living means making choices that reduce our environmental impact. Using renewable energy, recycling, and reducing waste are small steps with big impacts for our planet.",
  "Artificial Intelligence is changing the landscape of every industry. From healthcare diagnostics to autonomous driving, AI is everywhere. While it automates mundane tasks, human creativity remains unique.",
  "Cultural diversity enriches our lives by introducing us to new ideas and perspectives. Food, music, and art from different cultures broaden our understanding of the world.",
  "Traveling opens our eyes to the beauty of the world. It teaches us adaptability and patience. Meeting new people and experiencing different cultures creates lasting memories.",
  "Financial literacy is an essential life skill. Understanding how to save, invest, and manage debt secures your future. Money should be a tool to achieve freedom.",
  "Sleep is often undervalued in our busy society. It is the time when the body repairs itself and the brain consolidates memories. Lack of sleep affects mood.",
  "Creative thinking allows us to solve problems in innovative ways. It is not limited to artists; engineers and business leaders need it too. Curiosity fuels creativity.",
  "Public speaking is a fear for many, but a valuable skill to master. It builds confidence and leadership abilities. Structuring your thoughts and speaking clearly influences others.",
  "The future of work is hybrid and flexible. Remote work has proven that productivity is not tied to a specific location. Digital skills are becoming mandatory.",
  "Global warming is a pressing issue that affects every living being on this planet. Rising temperatures lead to melting ice caps and extreme weather patterns globally.",
  "The ocean covers more than 70 percent of our planet's surface. It is home to diverse marine life and regulates the global climate system effectively.",
  "Renewable energy sources like solar and wind power are key to a sustainable future. They reduce our dependence on fossil fuels and lower carbon emissions.",
  "Smart cities use technology to improve the quality of life for their citizens. From efficient traffic management to waste disposal, data drives urban development.",
  "Cyber security is critical in the digital age. Protecting personal data and financial information from hackers requires robust systems and constant vigilance from users.",
  "Mental health awareness is breaking the stigma surrounding psychological well-being. It is okay to seek help and talk about feelings. Emotional health is as important as physical health.",
  "Time management is the art of planning your day effectively. Prioritizing tasks helps in achieving goals without stress. It leads to higher productivity and better work-life balance.",
  "Critical thinking involves analyzing facts to form a judgment. It is essential for problem-solving and making informed decisions in both personal and professional life.",
  "Teamwork dynamics play a crucial role in the success of any project. Collaboration, trust, and clear communication are the pillars of a high-performing team.",
  "Emotional intelligence is the ability to understand and manage your own emotions. It also involves recognizing and influencing the emotions of others around you.",
  "The history of aviation is filled with daring pioneers. From the Wright brothers to modern supersonic jets, the dream of flight has revolutionized transportation.",
  "Deep sea mysteries continue to fascinate scientists. The ocean floor remains largely unexplored, hiding species and geological features that are yet to be discovered.",
  "Ancient civilizations like Egypt and Rome laid the foundations of modern society. Their contributions to architecture, law, and governance influence us even today.",
  "Modern architecture blends functionality with aesthetics. Sustainable materials and energy-efficient designs are becoming the standard for new buildings in urban areas.",
  "Digital marketing has changed how businesses reach customers. Social media and search engines offer targeted advertising that is more effective than traditional methods.",
  "E-commerce growth has transformed the retail industry. Shopping online offers convenience and variety, forcing traditional brick-and-mortar stores to adapt or perish.",
  "Remote work culture emphasizes results over hours spent at a desk. It requires self-discipline and effective communication tools to collaborate with distributed teams.",
  "Blockchain basics involve a decentralized ledger that records transactions. It ensures transparency and security, forming the backbone of cryptocurrencies like Bitcoin.",
  "Quantum computing promises to solve problems that are currently impossible for classical computers. It uses the principles of quantum mechanics to process information.",
  "Space tourism is no longer science fiction. Private companies are developing spacecraft to take civilians into orbit, opening a new frontier for human travel.",
  "Urban gardening is a growing trend in cities. It allows people to grow fresh produce in limited spaces, promoting self-sufficiency and green living.",
  "Minimalist living focuses on keeping only what adds value to your life. It reduces clutter and stress, allowing you to focus on what truly matters.",
  "Photography basics include understanding light, composition, and exposure. A good photograph tells a story and captures a moment in time perfectly.",
  "Music therapy uses sound to improve mental and physical health. It can reduce stress, alleviate pain, and improve cognitive function in patients.",
  "Culinary arts is the practice of preparing and cooking food. It combines creativity with technique to create dishes that delight the senses.",
  "Sports psychology helps athletes improve their performance through mental training. Visualization, focus, and confidence are key components of achieving success in sports.",
  "Yoga benefits both the body and the mind. Regular practice improves flexibility, strength, and balance while reducing stress and promoting relaxation.",
  "Meditation techniques vary, but all aim to calm the mind. Focusing on the breath or a mantra helps to achieve a state of inner peace.",
  "Personal branding is about managing how others perceive you. It helps in career advancement and building a professional reputation in your industry.",
  "Lifelong learning is the continuous pursuit of knowledge. In a rapidly changing world, staying curious and updating your skills is essential for growth."
];

const HINDI_ARTICLES = [
  "भारत एक विशाल और महान देश है। यहाँ की संस्कृति और परंपराएँ पूरी दुनिया में प्रसिद्ध हैं। हमें अपने देश पर गर्व है। विविधता में एकता हमारी पहचान है।",
  "समय का सदुपयोग करना सफलता की कुंजी है। जो लोग समय की कदर नहीं करते, वे जीवन में पीछे रह जाते हैं। विद्यार्थी जीवन में समय प्रबंधन बहुत महत्वपूर्ण है।",
  "स्वास्थ्य ही सबसे बड़ा धन है। अच्छा भोजन और नियमित व्यायाम शरीर को स्वस्थ रखते हैं। सुबह की सैर ताजी हवा और ऊर्जा देती है। हमें अपने स्वास्थ्य का ध्यान रखना चाहिए।",
  "अनुशासन जीवन का आधार है। यह हमें सही मार्ग पर चलने की प्रेरणा देता है। छात्र जीवन में अनुशासन का विशेष महत्व है। जो अनुशासित रहता है, वह सफल होता है।",
  "भारत त्यौहारों का देश है। यहाँ होली, दिवाली, ईद और क्रिसमस जैसे त्यौहार धूमधाम से मनाए जाते हैं। त्यौहार हमारे जीवन में खुशियाँ लाते हैं।",
  "वृक्ष हमारे मित्र हैं। वे हमें छाया, फल, और ऑक्सीजन देते हैं। हमें अधिक से अधिक पेड़ लगाने चाहिए। पर्यावरण की रक्षा करना हमारा कर्तव्य है।",
  "शिक्षा का उद्देश्य केवल नौकरी पाना नहीं, बल्कि एक अच्छा इंसान बनना है। शिक्षा हमें ज्ञान और विनम्रता देती है। यह समाज में जागरूकता फैलाती है।",
  "विज्ञान ने हमारे जीवन को बहुत आसान बना दिया है। बिजली, यातायात, और संचार के साधन विज्ञान की देन हैं। हमें विज्ञान का उपयोग मानव कल्याण के लिए करना चाहिए।",
  "सच्ची मित्रता एक अनमोल रत्न है। एक अच्छा मित्र सुख-दुःख में हमेशा साथ देता है। मित्रता में विश्वास और ईमानदारी होनी चाहिए। कृष्ण और सुदामा की मित्रता आदर्श है।",
  "परोपकार की भावना मनुष्य को महान बनाती है। दूसरों की मदद करने से आत्मिक शांति मिलती है। हमें गरीबों और असहायों की सहायता करनी चाहिए। यही मानवता है।",
  "डिजिटल इंडिया भारत सरकार की एक प्रमुख पहल है। इसका उद्देश्य देश को तकनीकी रूप से सशक्त बनाना है। ऑनलाइन सेवाओं से समय और धन की बचत होती है।",
  "योग भारतीय संस्कृति की प्राचीन धरोहर है। यह शरीर और मन को संतुलित रखता है। नियमित योग करने से तनाव कम होता है। स्वास्थ्य के लिए योग लाभकारी है।",
  "हमें अपने राष्ट्र से प्रेम करना चाहिए। राष्ट्रभक्ति की भावना हमें एकजुट रखती है। स्वतंत्रता सेनानियों ने देश के लिए अपने प्राण न्योछावर कर दिए।",
  "पुस्तकें हमारी सबसे अच्छी मित्र होती हैं। वे ज्ञान का भंडार हैं। अच्छी पुस्तकें पढ़ने से विचार शुद्ध होते हैं। पुस्तकालय ज्ञान का मंदिर है।",
  "जल ही जीवन है। इसके बिना जीवन की कल्पना नहीं की जा सकती। हमें पानी बर्बाद नहीं करना चाहिए। वर्षा जल संचयन एक अच्छी विधि है।",
  "स्वच्छता अभियान में हम सबको योगदान देना चाहिए। अपने आसपास की सफाई रखना हमारा कर्तव्य है। गंदे वातावरण से बीमारियाँ फैलती हैं। स्वच्छ भारत स्वस्थ भारत।",
  "आत्मनिर्भर भारत का सपना हमें साकार करना है। हमें स्वदेशी वस्तुओं का उपयोग करना चाहिए। इससे देश की अर्थव्यवस्था मजबूत होगी। लघु उद्योगों को बढ़ावा देना आवश्यक है।",
  "मोबाइल फोन आज की जरूरत बन गया है। इससे संचार बहुत तेज और आसान हो गया है। लेकिन इसका अत्यधिक उपयोग हानिकारक भी हो सकता है।",
  "भारत की आत्मा गांवों में बसती है। ग्रामीण जीवन सरल और शांत होता है। यहाँ की हवा शुद्ध और वातावरण प्रदूषण मुक्त होता है। किसान हमारे अन्नदाता हैं।",
  "समाचार पत्र ज्ञान और सूचना का अच्छा माध्यम है। यह हमें देश-विदेश की घटनाओं से अवगत कराता है। सुबह अखबार पढ़ने की आदत बहुत अच्छी है।",
  "भारतीय संविधान विश्व का सबसे बड़ा लिखित संविधान है। यह हमें मौलिक अधिकार और कर्तव्य प्रदान करता है। लोकतंत्र की मजबूती के लिए संविधान का पालन आवश्यक है।",
  "गणतंत्र दिवस 26 जनवरी को मनाया जाता है। इस दिन भारत का संविधान लागू हुआ था। यह राष्ट्रीय पर्व हमें देशप्रेम और एकता का संदेश देता है।",
  "स्वतंत्रता संग्राम में अनेक वीरों ने बलिदान दिया। महात्मा गांधी, भगत सिंह, और सुभाष चंद्र बोस जैसे नेताओं ने देश को आजाद कराने में मुख्य भूमिका निभाई।",
  "महात्मा गांधी सत्य और अहिंसा के पुजारी थे। उन्होंने सादा जीवन और उच्च विचार का संदेश दिया। बापू के आदर्श आज भी हमारे लिए प्रेरणा स्रोत हैं।",
  "स्वामी विवेकानंद ने भारतीय संस्कृति का डंका पूरे विश्व में बजाया। उन्होंने युवाओं को उठो, जागो और लक्ष्य प्राप्ति तक मत रुको का संदेश दिया।",
  "भगत सिंह एक महान क्रांतिकारी थे। उन्होंने देश की आजादी के लिए हंसते-हंसते फांसी का फंदा चूम लिया। उनका बलिदान युवाओं में जोश भर देता है।",
  "सुभाष चंद्र बोस ने तुम मुझे खून दो, मैं तुम्हें आजादी दूंगा का नारा दिया। उन्होंने आजाद हिंद फौज का गठन किया और अंग्रेजों के खिलाफ लड़ाई लड़ी।",
  "सरदार पटेल को लौह पुरुष कहा जाता है। उन्होंने भारत की रियासतों का एकीकरण किया। उनकी दृढ़ इच्छाशक्ति और नेतृत्व क्षमता अद्भुत थी।",
  "डॉ. भीमराव अंबेडकर को संविधान का निर्माता कहा जाता है। उन्होंने समाज में समानता और न्याय के लिए संघर्ष किया। वे दलितों और पिछड़ों के मसीहा थे।",
  "डॉ. ए.पी.जे. अब्दुल कलाम भारत के मिसाइल मैन थे। वे एक महान वैज्ञानिक और राष्ट्रपति थे। उनका जीवन सादगी और परिश्रम की मिसाल है।",
  "हिमालय पर्वत भारत का प्रहरी है। यह उत्तर दिशा में स्थित है और हमें ठंडी हवाओं से बचाता है। यहाँ से अनेक पवित्र नदियाँ निकलती हैं।",
  "गंगा नदी भारत की सबसे पवित्र नदी है। इसे माँ का दर्जा दिया गया है। इसका जल अमृत समान माना जाता है। हमें इसे प्रदूषित होने से बचाना चाहिए।",
  "ताजमहल दुनिया के सात अजूबों में से एक है। यह आगरा में यमुना नदी के किनारे स्थित है। इसे शाहजहाँ ने मुमताज की याद में बनवाया था।",
  "लाल किला दिल्ली में स्थित एक ऐतिहासिक इमारत है। यहाँ हर साल स्वतंत्रता दिवस पर प्रधानमंत्री झंडा फहराते हैं। यह मुगल वास्तुकला का अद्भुत नमूना है।",
  "भारतीय संस्कृति विश्व की प्राचीनतम संस्कृतियों में से एक है। यहाँ अनेक धर्म, भाषाएँ और वेशभूषाएँ हैं। वसुधैव कुटुम्बकम हमारी संस्कृति का मूल मंत्र है।",
  "आयुर्वेद भारत की प्राचीन चिकित्सा पद्धति है। यह जड़ी-बूटियों और प्राकृतिक उपचार पर आधारित है। इसका उद्देश्य स्वस्थ जीवन और रोगों का निवारण है।",
  "संतुलित आहार स्वास्थ्य के लिए आवश्यक है। इसमें प्रोटीन, विटामिन, और मिनरल्स सही मात्रा में होने चाहिए। हरी सब्जियाँ और फल खाना बहुत फायदेमंद होता है।",
  "खेलकूद हमारे शारीरिक और मानसिक विकास के लिए जरूरी है। इससे टीम भावना और अनुशासन का विकास होता है। स्वस्थ शरीर में ही स्वस्थ मस्तिष्क रहता है।",
  "इंटरनेट आज के युग की सबसे बड़ी क्रांति है। इसने सूचना और संचार को बहुत तेज कर दिया है। शिक्षा और व्यापार में इसका बहुत बड़ा योगदान है।",
  "सोशल मीडिया ने लोगों को एक-दूसरे से जोड़ दिया है। यह विचारों के आदान-प्रदान का सशक्त माध्यम है। इसका सही उपयोग समाज में सकारात्मक बदलाव ला सकता है।",
  "प्रदूषण आज की सबसे बड़ी समस्या है। हवा, पानी और मिट्टी का प्रदूषण हमारे स्वास्थ्य के लिए हानिकारक है। हमें प्लास्टिक का उपयोग कम करना चाहिए।",
  "ग्लोबल वार्मिंग धरती के बढ़ते तापमान की समस्या है। इसके कारण ग्लेशियर पिघल रहे हैं और मौसम बदल रहा है। पेड़ लगाना इसका एकमात्र उपाय है।",
  "सौर ऊर्जा एक नवीकरणीय ऊर्जा स्रोत है। सूर्य की रोशनी से बिजली बनाई जाती है। यह प्रदूषण मुक्त और सस्ती होती है। हमें इसका अधिक उपयोग करना चाहिए।",
  "वर्षा जल संचयन पानी बचाने का एक तरीका है। बारिश के पानी को इकट्ठा करके उसे उपयोग में लाया जा सकता है। यह जल संकट को कम करने में मदद करता है।",
  "जैविक खेती में रासायनिक खादों का प्रयोग नहीं होता। इसमें गोबर की खाद और प्राकृतिक चीजों का उपयोग होता है। इससे पैदा हुआ अनाज स्वास्थ्यवर्धक होता है।",
  "महिला सशक्तिकरण का अर्थ महिलाओं को आत्मनिर्भर बनाना है। उन्हें शिक्षा और रोजगार के समान अवसर मिलने चाहिए। एक शिक्षित महिला पूरे परिवार को शिक्षित करती है।",
  "बेटी बचाओ बेटी पढ़ाओ सरकार की एक योजना है। इसका उद्देश्य कन्या भ्रूण हत्या रोकना और लड़कियों को शिक्षा देना है। लड़कियाँ आज हर क्षेत्र में आगे हैं।",
  "दहेज प्रथा समाज के लिए एक अभिशाप है। यह महिलाओं के सम्मान के खिलाफ है। हमें इस कुप्रथा का विरोध करना चाहिए और विवाह को सरल बनाना चाहिए।",
  "बाल श्रम एक अपराध है। बच्चों को काम पर नहीं, स्कूल भेजना चाहिए। उनका बचपन छीनना मानवता के खिलाफ है। हर बच्चे को शिक्षा का अधिकार है।",
  "भ्रष्टाचार मुक्त भारत हम सबका सपना है। इसके लिए हमें ईमानदार बनना होगा। रिश्वत लेना और देना दोनों अपराध हैं। पारदर्शिता से ही देश आगे बढ़ सकता है।"
];

const TypingPractice: React.FC = () => {
  const { lang, id } = useParams();
  const isHindi = lang === 'hindi';
  
  // Logic to fetch unique article based on ID
  const getPracticeText = () => {
    const articlesList = isHindi ? HINDI_ARTICLES : ENGLISH_ARTICLES;
    
    // Select article based on ID. 
    // Uses modulo to cycle through list if ID exceeds list length (e.g. ID 21 uses article index 0)
    const articleIndex = (Number(id) - 1) % articlesList.length;
    let baseText = articlesList[articleIndex];
    
    // Process text to limit to ~50 words as per requirement
    const words = baseText.split(/\s+/);
    
    // If article is short (unlikely with new data, but safe to keep), repeat it
    let resultWords = [...words];
    while(resultWords.length < 50) {
        resultWords = [...resultWords, ...words];
    }
    
    // Slice exactly 50 words for consistency
    return resultWords.slice(0, 50).join(' ');
  };

  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(getPracticeText());
    reset();
  }, [id, lang]);

  const reset = () => {
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setIsFinished(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    
    const val = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Only allow typing if length is within bounds
    if (val.length <= text.length) {
      setInput(val);
      
      if (val.length === text.length) {
        setEndTime(Date.now());
        setIsFinished(true);
      }
    }
  };

  // Stats
  const getStats = () => {
    if (!startTime) return { wpm: 0, accuracy: 100 };
    const timeEnd = endTime || Date.now();
    const durationMin = (timeEnd - startTime) / 60000;
    const words = input.length / 5;
    const wpm = Math.round(words / (durationMin || 0.001)); // avoid div by 0

    let errors = 0;
    input.split('').forEach((char, i) => {
      if (char !== text[i]) errors++;
    });
    const accuracy = Math.max(0, ((input.length - errors) / (input.length || 1)) * 100).toFixed(1);

    return { wpm, accuracy };
  };

  const stats = getStats();
  const currentNextChar = text[input.length] || '';

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/practice" className="flex items-center gap-2 text-gray-600 hover:text-brand-purple font-bold">
            <ArrowLeft size={20} /> Back to Library
          </Link>
          <div className="text-center">
            <h1 className="font-display font-bold text-xl">
               {isHindi ? 'Hindi' : 'English'} Practice #{id}
            </h1>
            <span className="text-xs font-normal text-gray-500 block">50 Words Challenge</span>
          </div>
          <button onClick={reset} className="flex items-center gap-2 text-gray-600 hover:text-brand-black">
            <RefreshCw size={18} /> Restart
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center p-4 sm:p-8 gap-8 max-w-5xl mx-auto w-full">
        
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-3xl">
          <div className="bg-white p-4 rounded-lg border-2 border-brand-black shadow-neo text-center">
            <div className="text-gray-500 text-xs font-bold uppercase">WPM</div>
            <div className="text-3xl font-display font-bold text-brand-purple">{stats.wpm}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-brand-black shadow-neo text-center">
             <div className="text-gray-500 text-xs font-bold uppercase">Accuracy</div>
            <div className="text-3xl font-display font-bold text-green-600">{stats.accuracy}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-brand-black shadow-neo text-center">
             <div className="text-gray-500 text-xs font-bold uppercase">Progress</div>
            <div className="text-3xl font-display font-bold text-blue-600">{Math.round((input.length / text.length) * 100)}%</div>
          </div>
        </div>

        {/* Text Area */}
        <div className="w-full relative">
          {/* Text Overlay for styling */}
          <div className={`bg-white border-2 border-gray-300 rounded-lg p-6 text-xl sm:text-2xl leading-relaxed min-h-[200px] whitespace-pre-wrap select-none shadow-inner ${isHindi ? 'font-mangal' : 'font-mono'}`}>
            {text.split('').map((char, i) => {
              let className = "text-gray-300";
              if (i < input.length) {
                className = input[i] === char ? "text-brand-black" : "text-red-500 bg-red-100";
              }
              if (i === input.length) {
                className = "bg-brand-yellow text-brand-black outline outline-2 outline-brand-black -outline-offset-2 animate-pulse"; // Current cursor
              }
              return <span key={i} className={className}>{char}</span>;
            })}
          </div>

          {/* Invisible Input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-default resize-none"
            autoFocus
          />
        </div>

        {/* Virtual Keyboard */}
        <div className="w-full">
           <VirtualKeyboard 
              activeChar={isFinished ? '' : currentNextChar} 
              language={isHindi ? 'hindi' : 'english'}
              layout={isHindi ? 'inscript' : 'qwerty'}
            />
        </div>

        {/* Completion Modal */}
        {isFinished && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-neo-lg animate-in zoom-in duration-300">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle size={32} className="text-green-600" />
               </div>
               <h2 className="text-2xl font-bold font-display mb-2">Practice Complete!</h2>
               <p className="text-gray-600 mb-8">Great job working on your typing skills.</p>
               
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded">
                     <div className="text-sm text-gray-500">Speed</div>
                     <div className="text-2xl font-bold">{stats.wpm} WPM</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                     <div className="text-sm text-gray-500">Accuracy</div>
                     <div className="text-2xl font-bold">{stats.accuracy}%</div>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                 <button onClick={reset} className="w-full bg-brand-black text-white py-3 rounded-lg font-bold hover:bg-gray-800">Try Again</button>
                 <Link to="/practice" className="w-full border-2 border-gray-200 py-3 rounded-lg font-bold hover:bg-gray-50">Back to Library</Link>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TypingPractice;