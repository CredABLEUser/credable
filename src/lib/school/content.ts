export interface Lesson {
  id: string;
  title: string;
  summary: string;
  body: string[];
  bridge?: { prompt: string; href: string; label: string };
}

export interface Pathway {
  id: string;
  label: string;
  description: string;
  lessons: Lesson[];
}

const financialBasics: Pathway = {
  id: "financial-basics",
  label: "Financial Basics",
  description: "The foundation everything else builds on.",
  lessons: [
    {
      id: "how-money-moves",
      title: "How money actually moves through your life",
      summary: "Income, obligations, and the gap between them.",
      body: [
        "Every financial decision comes down to one relationship: what comes in, what has to go out, and what's left over. That leftover space — not your income alone — is what actually funds every goal you have.",
        "Fixed obligations (housing, debt payments, insurance) are the hardest to change quickly. Variable spending is where flexibility usually lives. Knowing which is which changes what's actually possible to adjust this month versus over a year.",
        "This isn't about tracking every coffee. It's about knowing your structure well enough to make decisions with your eyes open.",
      ],
      bridge: { prompt: "Want to see this using your own numbers?", href: "/app/my-stuff", label: "Open My Stuff" },
    },
    {
      id: "good-debt-bad-debt",
      title: "\"Good debt\" and \"bad debt\" — it's not that simple",
      summary: "Debt is a tool. The question is what it's used for and what it costs.",
      body: [
        "Debt isn't inherently good or bad — it's a cost (interest, risk, payment obligation) exchanged for something (a home, an education, working capital, breathing room). Whether that trade is worth it depends on what you get, what it costs, and what happens if things don't go as planned.",
        "A rough way to think about it: debt that helps you acquire or build something with lasting value, at a reasonable cost, tends to be more defensible than debt that finances things that lose value the moment you buy them, at a high cost.",
        "The honest answer is almost always \"it depends on the terms and your situation\" — not a blanket rule.",
      ],
    },
    {
      id: "emergency-reserves",
      title: "Why reserves matter more than people think",
      summary: "Cash isn't just for emergencies — it's what lets you say no to bad options.",
      body: [
        "Reserves aren't about being scared of the future. They're what keeps a temporary problem from becoming a permanent one — a job loss doesn't force a high-interest loan, an emergency doesn't force a missed payment.",
        "There's no single right number, but a common starting reference point is three to six months of essential expenses — adjusted for how stable your income is and what obligations you're protecting.",
      ],
    },
  ],
};

const credit: Pathway = {
  id: "credit",
  label: "Credit",
  description: "How credit actually works, and how to use it strategically.",
  lessons: [
    {
      id: "how-credit-works",
      title: "How credit actually works",
      summary: "Your credit file is a record — not a judgment.",
      body: [
        "Your credit file is a history: what you've borrowed, whether you paid on time, how much of your available credit you're using, and how long you've had accounts open. Scores are a model built from that history.",
        "The biggest factors, generally: payment history (did you pay on time) and revolving utilization (how much of your card limits you're using). Account age, account mix, and recent inquiries matter, but usually less.",
      ],
    },
    {
      id: "utilization",
      title: "Utilization: the fastest lever you usually control",
      summary: "High balances relative to your limits can suppress a score fast — and recover fast too.",
      body: [
        "Utilization is your balance divided by your limit, both per card and across all your cards. High utilization can meaningfully suppress a score, but unlike a late payment, it usually recovers quickly once the balance is paid down and reported lower.",
        "A common rough marker: utilization under 30% is generally healthier, and under 10% is often stronger still — but the exact impact depends on the rest of your file.",
      ],
      bridge: { prompt: "Want to see what this looks like using your own cards?", href: "/app/tools/credit_paydown", label: "Open Credit Paydown tool" },
    },
    {
      id: "derogatory-marks",
      title: "Not all credit damage is equal",
      summary: "A late payment, a collection, and high utilization are very different problems.",
      body: [
        "High utilization is reversible relatively quickly. Actual late payments, collections, charge-offs, and foreclosure-related history tend to have longer-lasting effects and generally fade in significance over time rather than disappearing instantly.",
        "If you're under financial pressure, staying current on payments — even if it means being strategic elsewhere — is often more valuable long-term than optimizing for the lowest possible balance today.",
      ],
    },
    {
      id: "mortgage-readiness",
      title: "Positioning credit for a specific goal",
      summary: "\"Better credit\" should lead somewhere.",
      body: [
        "Credit strategy changes based on what you're using it for and when. If you want to buy a home in three months, the priorities are: no new accounts, no unnecessary inquiries, lower utilization before statements close, and cleaning up any reporting errors — versus a longer runway with different priorities.",
        "Improving a score in the abstract is less useful than improving it toward a specific financing goal and timeline.",
      ],
    },
  ],
};

const leverage: Pathway = {
  id: "leverage",
  label: "Leverage Masterclass",
  description: "How to use what you already have to do more of the work for you.",
  lessons: [
    {
      id: "leveraging-money",
      title: "Leveraging Money",
      summary: "Using capital strategically — not just spending or hoarding it.",
      body: [
        "Money itself doesn't create wealth sitting still — how it's deployed does. That includes using other people's money (financing) when the cost is lower than the value created, and preserving liquidity when optionality matters more than a marginal return.",
        "The core question isn't \"should I use debt\" — it's \"what does this capital cost, what does it let me do, and what's the alternative use of the same dollars?\"",
      ],
    },
    {
      id: "leveraging-credit",
      title: "Leveraging Credit",
      summary: "Credit is access infrastructure, not just a number.",
      body: [
        "Strong credit lowers the cost of nearly everything you finance — mortgages, business loans, insurance in some cases, even negotiating leverage. It's less \"a score to be proud of\" and more \"infrastructure that makes your other options cheaper.\"",
        "Used well, credit creates options. Used poorly, it creates fragility. The difference is usually cost, purpose, and whether you can service it if circumstances change.",
      ],
    },
    {
      id: "leveraging-assets",
      title: "Leveraging Assets",
      summary: "What you already own can do more work.",
      body: [
        "Home equity, retirement accounts, a business, even a spare room — these are often underused. The central question of this whole masterclass applies directly here: how can what you already have begin doing more of the work?",
        "This isn't a blanket suggestion to borrow against everything you own. It's a prompt to notice unused capacity before assuming the only path forward is more income or more saving.",
      ],
      bridge: { prompt: "Want to see where you may already have leverage available?", href: "/app/my-stuff", label: "Review My Stuff" },
    },
    {
      id: "leveraging-people",
      title: "Leveraging People",
      summary: "What only you can do — and what someone else can do better, faster, or cheaper.",
      body: [
        "Delegation, hiring, partnerships, and professional expertise all expand what you can accomplish beyond your own hours. The useful questions: what only I can do, what can someone else do better or less expensively, and where is expertise worth paying for?",
        "This applies as much to personal finances (a good CPA, a good lender) as it does to running a business.",
      ],
    },
    {
      id: "leveraging-technology",
      title: "Leveraging Technology",
      summary: "Can it do this faster, better, more consistently, or more cheaply than you?",
      body: [
        "Automation, software, and AI tools can multiply what one person accomplishes — research, bookkeeping, scheduling, analysis. The evaluation isn't \"is this technology impressive\" — it's time saved, quality improvement, and cost versus value.",
        "Treat technology as capacity you can buy, not just an expense line.",
      ],
    },
    {
      id: "leveraging-systems",
      title: "Leveraging Systems",
      summary: "Stop solving the same problem manually every time.",
      body: [
        "Checklists, routines, templates, and standard processes reduce the effort required to do something well repeatedly. A system built once keeps paying off; a one-off manual effort has to be redone from scratch every time.",
      ],
    },
    {
      id: "leveraging-relationships",
      title: "Leveraging Relationships",
      summary: "Access to good people, information, and opportunity is a real asset.",
      body: [
        "Professional networks, trusted referrals, and reciprocal relationships create access that's genuinely hard to build alone — introductions, better information, opportunities you'd never see otherwise. This isn't about social climbing; it's about recognizing that access itself has value.",
      ],
    },
    {
      id: "leveraging-knowledge",
      title: "Leveraging Knowledge",
      summary: "Understanding creates access.",
      body: [
        "Understanding how financing, investing, taxes, and business structures actually work materially changes what opportunities you can even recognize, let alone use. The progression is usually: I didn't know that existed → now I understand it → I understand the opportunity and the risk → I can decide whether it fits me.",
      ],
    },
    {
      id: "leveraging-time",
      title: "Leveraging Time",
      summary: "Time is finite. What you do with it compounds either way.",
      body: [
        "Paying to eliminate low-value work, automating repeated tasks, and delegating what doesn't require your specific judgment all buy back time for higher-value work — or simply for your life. A free solution that costs you four hours a month isn't actually free.",
      ],
    },
    {
      id: "combining-leverage",
      title: "Combining Forms of Leverage",
      summary: "The goal isn't maximum leverage — it's the right leverage for the right purpose.",
      body: [
        "Most meaningful financial progress uses several forms of leverage at once: borrowed capital, other people's expertise, technology, systems, and knowledge working together. A real-estate investor might combine financing, a contractor's expertise, property management, and market knowledge simultaneously.",
        "The discipline is matching the leverage to the purpose — not stacking as much of it as possible.",
      ],
    },
  ],
};

const investing: Pathway = {
  id: "investing",
  label: "Investing",
  description: "Risk, return, and how to evaluate what you're actually buying.",
  lessons: [
    {
      id: "risk-and-return",
      title: "Risk and return aren't opposites — they're linked",
      summary: "Higher potential return generally comes with higher potential loss.",
      body: [
        "Every investment trades expected return against volatility, liquidity, and the chance of loss. There's no version of \"high return, no risk\" that holds up — if something looks like it exists, that's worth questioning closely.",
        "The right amount of risk depends on your timeline (when you'll need the money), your capacity to absorb a loss without it affecting your life, and your temperament.",
      ],
    },
    {
      id: "time-horizon",
      title: "Time horizon changes almost everything",
      summary: "Money you need next year and money you won't touch for a decade should be treated very differently.",
      body: [
        "A strategy appropriate for capital you won't need for ten years can be entirely wrong for capital you'll need next year — not because the asset is bad, but because you may be forced to sell at the wrong time.",
      ],
    },
  ],
};

export const PATHWAYS: Pathway[] = [financialBasics, credit, leverage, investing];

export function getPathway(id: string): Pathway | undefined {
  return PATHWAYS.find((p) => p.id === id);
}

export function getLesson(pathwayId: string, lessonId: string): { pathway: Pathway; lesson: Lesson } | undefined {
  const pathway = getPathway(pathwayId);
  const lesson = pathway?.lessons.find((l) => l.id === lessonId);
  if (!pathway || !lesson) return undefined;
  return { pathway, lesson };
}
