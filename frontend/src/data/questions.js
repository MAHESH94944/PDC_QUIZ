const questions = [
  // MBTI (10)
  {
    id: "mbti-1",
    category: "MBTI",
    text: "At a party, you usually…",
    options: [
      "Talk with many people",
      "Chat with a few new faces",
      "Stay with close friends",
      "Sit quietly in a corner",
    ],
  },
  {
    id: "mbti-2",
    category: "MBTI",
    text: "When faced with a new challenge, you…",
    options: [
      "Seek advice and discuss it with others",
      "Think it through quietly on your own",
      "Focus on practical ways to solve it",
      "Consider unconventional or innovative approaches",
    ],
  },
  {
    id: "mbti-3",
    category: "MBTI",
    text: "When you make a decision, you mostly think about…",
    options: [
      "Rules and what’s fair",
      "Logic and outcomes",
      "People’s feelings",
      "Keeping harmony",
    ],
  },
  {
    id: "mbti-4",
    category: "MBTI",
    text: "At work, you prefer…",
    options: [
      "Clear schedules",
      "Organized plans",
      "Some flexibility",
      "Total freedom",
    ],
  },
  {
    id: "mbti-5",
    category: "MBTI",
    text: "In a group talk, you usually…",
    options: [
      "Share ideas confidently and early",
      "Share and listen equally",
      "Listen more than talk",
      "Stay mostly silent",
    ],
  },
  {
    id: "mbti-6",
    category: "MBTI",
    text: "You enjoy learning from…",
    options: [
      "Proven facts and information",
      "Hands-on practice and real examples",
      "Creative ideas and new perspectives",
      "Problem-solving and trying things out",
    ],
  },
  {
    id: "mbti-7",
    category: "MBTI",
    text: "During an argument, you…",
    options: [
      "Stay calm and logical",
      "Use facts to explain",
      "Care about emotions",
      "Try to make peace",
    ],
  },
  {
    id: "mbti-8",
    category: "MBTI",
    text: "When traveling, you like…",
    options: [
      "Fixed schedule",
      "Rough plan",
      "Decide daily",
      "Go with the flow",
    ],
  },
  {
    id: "mbti-9",
    category: "MBTI",
    text: "After a busy day, You feel better when....",
    options: [
      "Talking and sharing with others",
      "Having a mix of chat and rest",
      "Quiet time alone",
      "No one around you at all",
    ],
  },
  {
    id: "mbti-10",
    category: "MBTI",
    text: "In your free time, you prefer…",
    options: [
      "Reading or learning something new",
      "Doing hobbies or creative work",
      "Spending time with friends/family",
      "Relaxing alone and recharging",
    ],
  },

  // Technical / Engineering (7)
  {
    id: "tech-1",
    category: "Technical",
    text: "With a new gadget, you…",
    options: [
      "Open it to check inside",
      "Read the guide first",
      "Try buttons randomly",
      "Avoid touching it",
    ],
  },
  {
    id: "tech-2",
    category: "Technical",
    text: "When working on a group project, you usually…",
    options: [
      "Take the lead and assign tasks",
      "Contribute ideas and discuss actively",
      "Do your part quietly and consistently",
      "Wait until others guide you",
    ],
  },
  {
    id: "tech-3",
    category: "Technical",
    text: "While starting a coding assignment, your first step is to…",
    options: [
      "Write pseudocode or a clear plan",
      "Start coding and figure things out on the way",
      "Look for examples and resources online",
      "Ask seniors/peers for suggestions",
    ],
  },
  {
    id: "tech-4",
    category: "Technical",
    text: "In a lab experiment, what excites you most?",
    options: [
      "Getting accurate readings and results",
      "Setting up and running the experiment",
      "Understanding the concepts behind it",
      "Writing conclusions and reports",
    ],
  },
  {
    id: "tech-5",
    category: "Technical",
    text: "When facing a tough technical subject, you…",
    options: [
      "Break it into small parts and study step by step",
      "Look for patterns or shortcuts to understand faster",
      "Discuss with friends or join group studies",
      "Wait until exams get closer to focus on it",
    ],
  },
  {
    id: "tech-6",
    category: "Technical",
    text: "In hackathons or competitions, your strength is…",
    options: [
      "Coding/debugging under pressure",
      "Designing innovative ideas",
      "Coordinating and motivating the team",
      "Presenting the solution confidently",
    ],
  },
  {
    id: "tech-7",
    category: "Technical",
    text: "You enjoy challenges because…",
    options: [
      "They sharpen logic",
      "They solve problems",
      "They push creativity",
      "They are fun to try",
    ],
  },

  // Wisdom / Spiritual (8)
  {
    id: "wiz-1",
    category: "Wisdom",
    text: "Life events happen…",
    options: [
      "Due to destiny",
      "From God’s plan",
      "From human choices",
      "By luck",
    ],
  },
  {
    id: "wiz-2",
    category: "Wisdom",
    text: "I feel most connected when…",
    options: [
      "Praying or meditating",
      "Helping others",
      "Reflecting on myself",
      "Reaching my goals",
    ],
  },
  {
    id: "wiz-3",
    category: "Wisdom",
    text: "How often do you reflect on the meaning of life?",
    options: [
      "Rarely, rather I focus on daily tasks",
      "Sometimes, when I face challenges",
      "Often, I think about life’s bigger questions",
      "Very often, it’s a regular part of my life",
    ],
  },
  {
    id: "wiz-4",
    category: "Wisdom",
    text: "What’s the best way to deal with anger, arrogance, and other harmful tendencies?",
    options: [
      "They’re not bad and should be encouraged",
      "Indulge in them to feel pacified",
      "Control yourself and avoid acting on them",
      "Build positive habits to replace negativity",
    ],
  },
  {
    id: "wiz-5",
    category: "Wisdom",
    text: "Spirituality to me is…",
    options: [
      "Belief in God",
      "Care for others",
      "Knowing myself",
      "Not important",
    ],
  },
  {
    id: "wiz-6",
    category: "Wisdom",
    text: "Thinking and helping others in suffering is…",
    options: [
      "My main value",
      "Important with balance",
      "Good sometimes",
      "Not my priority",
    ],
  },
  {
    id: "wiz-7",
    category: "Wisdom",
    text: "How do you view death?",
    options: [
      "As a natural transition of the soul",
      "As the end of existence",
      "As a reminder to live meaningfully",
      "As a mystery that should not be feared",
    ],
  },
  {
    id: "wiz-8",
    category: "Wisdom",
    text: "Spirituality and science are…",
    options: [
      "Naturally connected",
      "Linked at times",
      "Independent from each other",
      "Totally Opposite",
    ],
  },

  // Cultural (3)
  {
    id: "cult-1",
    category: "Cultural",
    text: "What do you want the future of Indian culture to be?",
    options: [
      "Western culture dominates",
      "Revive Indian culture",
      "I don’t know",
      "Other",
    ],
  },
  {
    id: "cult-2",
    category: "Cultural",
    text: "If friends have bad habits (dirty content, smoking, etc.) what will you do?",
    options: [
      "Accept in moderation",
      "Life is for enjoyment",
      "Postpone to later",
      "Avoid/stop them",
      "Promote pure life",
    ],
  },
  {
    id: "cult-3",
    category: "Cultural",
    text: "Current social problems — ultimate cause?",
    options: [
      "Part of life",
      "No ideal leaders",
      "Neglecting values/tradition",
      "Irreligious/atheistic",
    ],
  },

  // Integrative (2)
  {
    id: "int-1",
    category: "Integrative",
    text: "Which type of family do you think is more happy?",
    options: ["Joint family", "Nuclear family", "Atomic family"],
  },
  {
    id: "int-2",
    category: "Integrative",
    text: "How do you see your future after engineering?",
    options: [
      "Crack job & enjoy",
      "MS/MBA/M.Tech then PhD",
      "Start your own business",
      "Confused",
      "Need guidance",
    ],
  },

  // IQ / Cognitive (5)
  {
    id: "iq-1",
    category: "IQ",
    text: "If 5 machines make 5 parts in 5 mins, how long for 100 machines to make 100 parts?",
    options: ["5 mins", "20 mins", "100 mins", "1 min"],
  },
  {
    id: "iq-2",
    category: "IQ",
    text: "Series: 2,6,12,20,30, ?",
    options: ["36", "40", "42", "56"],
  },
  {
    id: "iq-3",
    category: "IQ",
    text: "All roses are flowers. Some flowers fade quickly. Which is true?",
    options: [
      "Some roses fade quickly",
      "All flowers fade quickly",
      "Some flowers don’t fade quickly",
      "No roses fade quickly",
    ],
  },
  {
    id: "iq-4",
    category: "IQ",
    text: "At 3:15, angle between hour & minute hands?",
    options: ["0°", "7.5°", "30°", "37.5°"],
  },
  {
    id: "iq-5",
    category: "IQ",
    text: "A fair die is rolled twice. P(sum > 9)?",
    options: ["5/18", "1/3", "1/6", "7/18"],
  },
];

export default questions;
