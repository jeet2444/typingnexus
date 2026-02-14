
// Key Drill Exercises - Focused short drills
export const KEY_DRILLS = {
    english: {
        articles: {
            title: "Articles",
            description: "Practice typing full paragraphs.",
            icon: "📄",
            drills: [
                { id: "art-1", name: "The Quick Brown Fox", keys: "All", content: "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet." },
                { id: "art-2", name: "Typing Skills", keys: "All", content: "Typing is a skill that takes patience and practice. Regular training helps build muscle memory and speed." },
                { id: "art-3", name: "Healthy Living", keys: "All", content: "Eating a balanced diet and exercising regularly are key components of a healthy lifestyle." },
                { id: "art-4", name: "Technology", keys: "All", content: "Technology has revolutionized the way we communicate and work. The internet connects people globally." },
                { id: "art-5", name: "Nature", keys: "All", content: "The beauty of nature can be seen in the mountains, oceans, and forests. We must protect our environment." },
                { id: "art-6", name: "Music", keys: "All", content: "Music has the power to evoke emotions and bring people together across different cultures." },
                { id: "art-7", name: "Travel", keys: "All", content: "Traveling to new places opens our minds to different perspectives and experiences." },
                { id: "art-8", name: "Books", keys: "All", content: "Reading books expands our knowledge and stimulates the imagination." },
                { id: "art-9", name: "Space", keys: "All", content: "Space exploration continues to fascinate humanity as we search for knowledge beyond our planet." },
                { id: "art-10", name: "History", keys: "All", content: "Studying history helps us understand the past and make better decisions for the future." },
                { id: "art-11", name: "Science", keys: "All", content: "Science relies on observation and experimentation to describe and explain natural phenomena." },
                { id: "art-12", name: "Art", keys: "All", content: "Art expressions allows individuals to convey their thoughts and feelings creatively." },
                { id: "art-13", name: "Sports", keys: "All", content: "Participating in sports teaches teamwork, discipline, and resilience." },
                { id: "art-14", name: "Friendship", keys: "All", content: "A true friend supports you through good times and bad, offering honest advice and companionship." },
                { id: "art-15", name: "Success", keys: "All", content: "Success is often the result of hard work, learning from failure, and persistence." }
            ]
        },
        rawSessions: {
            title: "Raw Sessions",
            description: "Intensive key pattern repetitions.",
            icon: "⌨️",
            drills: [
                { id: "raw-1", name: "Home Row Basics", keys: "gh hg", content: "gh gh gh hg hg hg tg tg tg hy hy hy gy gy gy ht ht ht gt gt gt yt yt sl sl sl ls ls ls" },
                { id: "raw-2", name: "Top Row Mix", keys: "qw er", content: "qw qw er er ty ty ui ui op op po po iu iu yt yt re re wq wq qa qa ws ws ed ed rf rf" },
                { id: "raw-3", name: "Bottom Row Mix", keys: "zx cv", content: "zx zx cv cv bn bn nm nm mn mn nb nb vc vc xz xz za za xs xs cd cd vf vf bg bg nh nh" },
                { id: "raw-4", name: "Left Hand Focus", keys: "as df", content: "asdf fdsa asdfg gfdsa qwert trewq zxcvb bvcxz aq sw de fr gt hy ju ki lo ;p" },
                { id: "raw-5", name: "Right Hand Focus", keys: "jk l;", content: "jkl; ;lkj hjk l; yui op nm ,. / ;p lo ki ju hy gt fr de sw aq" },
                { id: "raw-6", name: "Alternating Hands", keys: "fl aj", content: "fl aj ks hd gq w; eipy ruto z/ x. c, vmbn" },
                { id: "raw-7", name: "Index Reach", keys: "ty gh", content: "ty gh bn vn vm vb fg fh fj fk fl ;' ] [" },
                { id: "raw-8", name: "Pinky Stretch", keys: "qz p/", content: "qa az p; ;/ qz p/ qp z/ za xs cd vf bg nh mj ,k .l /; 'l ;k j" },
                { id: "raw-9", name: "Number Row", keys: "12 34", content: "12 21 34 43 56 65 78 87 90 09 10 92 83 74 65" },
                { id: "raw-10", name: "Symbol Shift", keys: "!@ #$", content: "!@ @! #$ $# %^ ^% &* *& (* () )_ +_ )(" },
                { id: "raw-11", name: "Brackets & Slashes", keys: "[] \\", content: "[] ][ {} }{ \\| |\\ /? ?/ <> >< ,. .," },
                { id: "raw-12", name: "Common Bigrams", keys: "th he", content: "th he in en nt re er an ti on at st io or" },
                { id: "raw-13", name: "Common Trigrams", keys: "the and", content: "the and tha ent ion tio for nde has nce edt tis oft sth men" },
                { id: "raw-14", name: "Space Bar Timing", keys: "space", content: "a b c d e f g h i j k l m n o p q r s t u v w x y z" },
                { id: "raw-15", name: "Speed Burst", keys: "quick", content: "quick brown fox jumps lazy dog pack my box with five dozen liquor jugs" }
            ]
        },
        homeRow: {
            title: "Home Row Mastery",
            description: "Master the foundation keys - where your fingers rest",
            icon: "🏠",
            drills: [
                { id: "home-left", name: "Left Hand (A S D F G)", keys: "asdfg", content: "asdf fdsa asdfg gfdsa dad sad add sass fads gags as" },
                { id: "home-right", name: "Right Hand (H J K L ;)", keys: "hjkl;", content: "hjkl lkjh jkl; ;lkj hall fall shall ask flask all" },
                { id: "home-index", name: "Index Fingers (F J G H)", keys: "fjgh", content: "ff jj fj jf gh hg fg jh flag half gaff jag hag" },
                { id: "home-all", name: "All Home Row", keys: "asdfghjkl;", content: "dad has a lad; ask dad; salads fall; a flask" }
            ]
        },
        topRow: {
            title: "Top Row Speed",
            description: "Reach up efficiently without looking",
            icon: "⬆️",
            drills: [
                { id: "top-left", name: "Left Top (Q W E R T)", keys: "qwert", content: "qwert trewq we were tree wet red water rate" },
                { id: "top-right", name: "Right Top (Y U I O P)", keys: "yuiop", content: "yuiop poiuy you your pour top pot toy joy" },
                { id: "top-easy", name: "Common Words", keys: "qwertyuiop", content: "we you top per our out put your type" }
            ]
        },
        bottomRow: {
            title: "Bottom Row Control",
            description: "Master the downward reach",
            icon: "⬇️",
            drills: [
                { id: "bot-left", name: "Left Bottom (Z X C V B)", keys: "zxcvb", content: "zxcvb bvcxz cab van box vex zone" },
                { id: "bot-right", name: "Right Bottom (N M , . /)", keys: "nm,./", content: "nm man men moon mom no on noon" }
            ]
        },
        numbers: {
            title: "Number Row",
            description: "Speed up data entry with number practice",
            icon: "🔢",
            drills: [
                { id: "num-left", name: "1 2 3 4 5", keys: "12345", content: "12345 54321 123 321 12 21 135 531" },
                { id: "num-right", name: "6 7 8 9 0", keys: "67890", content: "67890 09876 678 876 79 97 680 086" },
                { id: "num-all", name: "All Numbers", keys: "1234567890", content: "2024 2025 2026 100 500 1000 999 12345" }
            ]
        },
        speed: {
            title: "Speed Builders",
            description: "Common words at maximum speed",
            icon: "⚡",
            drills: [
                { id: "speed-100", name: "Top 50 English Words", keys: "common", content: "the and to of a in is it you that he was for on are as with his they be at one have this from or had by not word but what some we can out other" },
                { id: "speed-pairs", name: "Word Pairs", keys: "pairs", content: "is it in on to do be we go no my up so me he of an as at if" },
                { id: "speed-burst", name: "Short Burst (30s)", keys: "burst", content: "quick fox jumps lazy dog pack judge vow" }
            ]
        }
    },
    hindi: {
        homeRow: {
            title: "Home Row (Inscript)",
            description: "Hindi Inscript Home Row Mastery",
            icon: "🏠",
            drills: [
                { id: "hin-home-left", name: "Left Hand (ो े ् ि ु)", keys: "sdfg", content: "ो े ् ि ु ु ि ् े ो ोे ्ि ु" },
                { id: "hin-home-right", name: "Right Hand (प र क त च)", keys: "hjkl;", content: "प र क त च च त क र प पर कर तर" },
                { id: "hin-home-all", name: "All Home Row (Inscript)", keys: "sdfghjkl;", content: "कर पर तर ु ि ् े ो च त क र प" }
            ]
        },
        remingtonHomeRow: {
            title: "Home Row (Remington)",
            description: "Hindi Remington (Mangal) Home Row",
            icon: "🏠",
            drills: [
                { id: "hin-rem-home-1", name: "Home Row Basics (Rem)", keys: "asdfg hjkl;", content: "क र प त च ो े ् ि ु" }
            ]
        },
        topRow: {
            title: "Top Row (Matras)",
            description: "Master Matras and Upper Consonants",
            icon: "⬆️",
            drills: [
                { id: "hin-top-left", name: "Left Top (ौ ै ा ी ू)", keys: "qwert", content: "ौ ै ा ी ू ू ी ा ै ौ" },
                { id: "hin-top-right", name: "Right Top (ब ह ग द ज)", keys: "yuiop", content: "ब ह ग द ज ज द ग ह ब" },
            ]
        },
        bottomRow: {
            title: "Bottom Row & Halant",
            description: "Complex characters and Halant",
            icon: "⬇️",
            drills: [
                { id: "hin-bot-all", name: "Bottom Row Mix", keys: "zxcvbnm", content: "्र ं म न व ल स य" }
            ]
        }
    }
};

export const ENGLISH_TITLES = [
    "The Quick Brown Fox", "The Power of Habits", "Nature's Beauty", "The Digital Age", "Importance of Reading",
    "Healthy Lifestyle", "Space Exploration", "History of Internet", "Mindfulness", "Leadership Skills"
];

export const HINDI_TITLES = [
    "टाइपिंग का अभ्यास", "समय का सदुपयोग", "स्वास्थ्य और व्यायाम", "अनुशासन का महत्व", "भारतीय त्यौहार",
    "पर्यावरण संरक्षण", "शिक्षा का उद्देश्य", "विज्ञान के लाभ", "सच्ची मित्रता", "परोपकार की भावना"
];

export const ENGLISH_ARTICLES = [
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

export const HINDI_ARTICLES = [
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
