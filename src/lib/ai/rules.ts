import { UserContext, monthlyIncome, money, sumByCategory } from "./context";
import { Depth, EngineResult } from "./engineTypes";

interface Rule {
  id: string;
  pathways: string[];
  test: (msg: string) => boolean;
  respond: (msg: string, ctx: UserContext, depth: Depth, turn: number) => EngineResult;
}

const has = (msg: string, ...needles: string[]) => needles.some((n) => msg.includes(n));

function extractDollarAmounts(msg: string): number[] {
  const matches = msg.match(/\$?\d{2,3}(?:,\d{3})+(?:\.\d+)?|\$\d+(?:\.\d+)?k?/gi) ?? [];
  return matches
    .map((m) => {
      const isK = /k$/i.test(m);
      const num = parseFloat(m.replace(/[$,k]/gi, ""));
      return isK ? num * 1000 : num;
    })
    .filter((n) => !Number.isNaN(n) && n >= 100);
}

function baseSuggestions(): string[] {
  return ["Tell me why", "What should I do next?", "Show me the numbers"];
}

// ---------- individual rule responders ----------

const overwhelmed: Rule = {
  id: "overwhelmed",
  pathways: [],
  test: (m) => has(m, "overwhelm", "don't know where to start", "dont know where to start", "i'm scared", "im scared", "i'm stuck", "im stuck", "everything feels", "i feel lost"),
  respond: () => ({
    content:
      "That's a lot to carry, and you don't have to sort all of it out at once.\n\nWhat feels heaviest right now — is it something that needs attention immediately (like a bill, a payment, or housing), or more of a general \"I don't know where I stand\" feeling?",
    suggestions: ["Something needs attention now", "I just don't know where I stand", "Help me figure it out"],
    pathwayTags: [],
    resolved: false,
  }),
};

const affordability: Rule = {
  id: "affordability",
  pathways: ["homebuying"],
  test: (m) =>
    has(
      m,
      "afford",
      "can i buy a house",
      "can i buy a home",
      "can we afford",
      "buying a house",
      "buy a house",
      "buying a home",
      "buy a home",
      "thinking about buying"
    ),
  respond: (m, ctx, depth) => {
    const income = monthlyIncome(ctx.items);
    const debt = sumByCategory(ctx.items, "credit_debt");
    const haveStuffData = income > 0;
    const amounts = extractDollarAmounts(m).sort((a, b) => b - a);
    const mentionsRent = has(m, "rent");

    let reality: string;
    if (amounts.length >= 2 && mentionsRent) {
      const [price, current] = amounts;
      const roughPayment = Math.round((price * 0.0068) / 10) * 10; // illustrative only
      const delta = roughPayment - current;
      reality = `At a rough, unverified estimate, a ${money(price)} home might carry somewhere around ${money(roughPayment)}/month all-in (principal, interest, taxes, insurance) at today's typical rates — versus the ${money(current)} you're paying now. That's roughly a ${delta >= 0 ? "+" : ""}${money(delta)}/month change. This is a placeholder, not a real quote — the Home Affordability tool will use your actual rate, down payment, and taxes.`;
    } else if (amounts.length === 1) {
      reality = `Got it — ${money(amounts[0])} noted. `;
    } else if (haveStuffData) {
      reality = `Here's what I'm seeing: about ${money(income)}/month in known income${debt > 0 ? ` and ${money(debt)} in current credit/debt balances` : ""}. `;
    } else {
      reality = "I don't have your income or current housing cost yet, so this is a starting conversation rather than a real answer. ";
    }

    const body =
      depth === "deep_dive"
        ? `${reality}\n\n"Can I afford it?" is more than a payment calculation. What matters most: the proposed payment relative to take-home income, what it replaces or crowds out (savings, other goals), your reserves after closing, and how stable the income is. Open the Home Affordability tool for a real, editable model.`
        : `${reality}\n\nWhat matters most here isn't just "can I make the payment" — it's whether you can do it without making the rest of your financial life too tight. What's your current housing cost, and roughly what price range are you considering?`;

    return {
      content: body,
      suggestions: ["Run the Home Affordability tool", "What about renting instead?", "I'm not sure what price to consider"],
      blocks: [{ kind: "action", data: { label: "Open Home Affordability tool", href: "/app/tools/home_affordability" } }],
      pathwayTags: ["homebuying"],
      resolved: false,
    };
  },
};

const debtConsolidation: Rule = {
  id: "debt_consolidation",
  pathways: ["debt_overwhelm"],
  test: (m) => has(m, "consolidat", "settle my card", "settle my debt", "negotiate my credit card", "settle credit card"),
  respond: (m, ctx) => {
    const isSettlement = has(m, "settle", "negotiate");
    if (isSettlement) {
      return {
        content:
          "Before I teach you how debt settlement works, I want to make sure it's actually the right tool.\n\nSettlement usually means the account goes delinquent first, it can meaningfully damage your credit, collections activity is common, and there can be tax consequences on the forgiven amount. It can be the right move when you genuinely can't pay down the balance in a reasonable time and other options are worse.\n\nWhat's actually driving this — is it that the payments don't fit your budget, the interest is too high, or you're worried about falling behind?",
        suggestions: ["Payments don't fit my budget", "Interest is too high", "I'm already behind", "Just show me how settlement works"],
        pathwayTags: ["debt_overwhelm"],
        resolved: false,
      };
    }
    const debt = sumByCategory(ctx.items, "credit_debt");
    const reality = debt > 0 ? `I have ${money(debt)} in credit/debt balances in My Stuff.` : "I don't have your current balances yet.";
    return {
      content: `${reality} A consolidation loan can lower your monthly payment and simplify things, but it can also stretch out the payoff and increase total interest — it depends on the new rate, term, and any fees.\n\nTo give you a real answer instead of a generic one: what are your current balances, rates, and minimum payments, and what rate/term is being offered?`,
      suggestions: ["Run the Debt Consolidation tool", "I don't know my exact rates", "What else could I do instead?"],
      blocks: [{ kind: "action", data: { label: "Open Debt Consolidation Comparison", href: "/app/tools/debt_consolidation" } }],
      pathwayTags: ["debt_overwhelm"],
      resolved: false,
    };
  },
};

const creditScore: Rule = {
  id: "credit",
  pathways: ["credit_rebuilding"],
  test: (m) => has(m, "credit score", "credit dropped", "improve my credit", "utilization", "credit report", "build my credit", "rebuild my credit", "credit fell"),
  respond: () => ({
    content:
      "Here's what usually moves a credit profile the most, fastest: revolving utilization (how much of your card limits you're using) and payment history. High utilization can hurt now but recovers relatively quickly once balances drop and report lower. Actual late payments, collections, or charge-offs take longer to fade.\n\nWhat's the situation — do you know roughly what your utilization looks like, or did something specific change (a late payment, a new inquiry, a balance jump)?",
    suggestions: ["My utilization is high", "Something specific changed", "I want a paydown strategy", "What's utilization?"],
    blocks: [{ kind: "action", data: { label: "Open Credit Paydown Strategy tool", href: "/app/tools/credit_paydown" } }],
    pathwayTags: ["credit_rebuilding"],
    resolved: false,
  }),
};

const heloc: Rule = {
  id: "heloc",
  pathways: ["homebuying", "build_beyond_paycheck"],
  test: (m) => has(m, "heloc", "home equity"),
  respond: () => ({
    content:
      "A HELOC lets you borrow against your home's equity, usually at a variable rate, secured by the house — meaning it carries real risk if you can't repay it, since the home is the collateral.\n\nBefore going further: what would the money be used for, and have you checked what your own bank or credit union would offer? For a straightforward HELOC, your existing bank is often a strong, lower-cost first stop. It becomes more useful to look at other lenders when you're declined, need more leverage, or have a non-standard situation.",
    suggestions: ["It's for a renovation", "I want to use it to invest", "I was declined by my bank", "What's the risk exactly?"],
    pathwayTags: ["homebuying"],
    resolved: false,
  }),
};

const divorce: Rule = {
  id: "divorce",
  pathways: ["divorce"],
  test: (m) => has(m, "divorce", "getting divorced", "my ex", "separat"),
  respond: (m) => {
    const jointDebtSignal = has(m, "mortgage", "credit", "loan", "debt", "car");
    const content = jointDebtSignal
      ? "One thing that's often urgent in a separation: if your name is on a mortgage, auto loan, credit card, or line of credit, the creditor still considers you responsible for it — a private agreement between spouses doesn't change that. If you're not certain payments are actually being made, that's worth checking now, not later.\n\nWhat's the situation — do you know which accounts are joint, and are payments currently being made on all of them?"
      : "Let's start with what's actually urgent versus what can wait. In a separation, the immediate things are usually: housing, access to cash, and understanding which accounts and debts are joint. Longer-term things like refinancing, dividing assets, and rebuilding credit come after.\n\nWhat feels most pressing right now — housing, cash access, or figuring out what accounts even exist?";
    return {
      content,
      suggestions: ["I don't know what accounts exist", "Housing is the urgent one", "I want to build a financial gathering checklist"],
      blocks: [{ kind: "action", data: { label: "Start a Divorce Financial Gathering checklist", href: "/app/my-stuff" } }],
      pathwayTags: ["divorce"],
      resolved: false,
    };
  },
};

const selfEmployed: Rule = {
  id: "self_employed",
  pathways: ["self_employed"],
  test: (m) => has(m, "self-employed", "self employed", "own my business", "1099", "my business income"),
  respond: () => ({
    content:
      "Self-employed finances usually run into one recurring tension: what minimizes your taxes and what maximizes your qualifying income for a lender aren't the same thing. Neither choice is wrong — it depends on what you're optimizing for and when.\n\nAre you trying to solve something tax-related, cash-flow related, or are you working toward financing (a mortgage, a business loan) sometime soon?",
    suggestions: ["I'm planning to apply for a mortgage", "It's a cash-flow question", "It's a tax question"],
    pathwayTags: ["self_employed"],
    resolved: false,
  }),
};

const cashQuestion: Rule = {
  id: "cash",
  pathways: [],
  test: (m) => has(m, "what should i do with", "sitting in cash", "extra cash", "money sitting"),
  respond: () => ({
    content:
      "Before anything else: what is this money for, and when might you need it? Cash you'll need in the next several months (a down payment, taxes, a cushion) should be treated very differently than cash you won't touch for years.\n\nDo you know roughly when you'd need this, or is it genuinely uncommitted?",
    suggestions: ["I might need it within a year", "It's uncommitted / long-term", "I'm not sure yet"],
    pathwayTags: [],
    resolved: false,
  }),
};

const trapped: Rule = {
  id: "build_beyond_paycheck",
  pathways: ["build_beyond_paycheck"],
  test: (m) => has(m, "feel stuck", "feel trapped", "work forever", "paycheck to paycheck", "paycheck hamster wheel", "still feel like i have to work"),
  respond: () => ({
    content:
      "This usually isn't a budgeting problem — it's an \"almost all my wealth depends on my paycheck\" problem. The useful question isn't \"how do I save more,\" it's: how can what you already have (equity, retirement assets, income, skills, time) begin doing more of the work for you?\n\nDo you have a rough sense of what you own — a home, retirement accounts, savings — or should we start by mapping that out in My Stuff?",
    suggestions: ["Let's map out what I have", "I already know what I own", "Tell me more about leverage"],
    blocks: [{ kind: "action", data: { label: "Open Leverage Masterclass", href: "/app/school/leverage" } }],
    pathwayTags: ["build_beyond_paycheck"],
    resolved: false,
  }),
};

const cryptoOrInvesting: Rule = {
  id: "investing",
  pathways: [],
  test: (m) => has(m, "crypto", "bitcoin", "invest", "stock market", "day trading"),
  respond: (m) => {
    const dontUnderstand = has(m, "don't understand", "dont understand", "never invested", "teach me");
    if (dontUnderstand) {
      return {
        content:
          "That's a reasonable reason not to have money in it yet. If you're curious, I can walk through what people are actually buying, where the potential return comes from, what can go wrong, and how people evaluate it — then you can decide whether it belongs in your world. No pressure either way.",
        suggestions: ["Yes, teach me the basics", "What's the biggest risk?", "Not right now"],
        blocks: [{ kind: "action", data: { label: "Open CredABLE School", href: "/app/school" } }],
        pathwayTags: [],
        resolved: false,
      };
    }
    return {
      content:
        "Happy to work through this with you — but \"should I\" depends on your situation, not the asset. What matters: your timeline for this money, how much volatility/loss you could tolerate without it affecting your life, what else this money might otherwise do (debt payoff, reserves, another goal), and how much you already understand about what you'd be buying.\n\nWhat's this money's timeline — is it money you won't need for years, or could you need it sooner?",
      suggestions: ["Years away, not needed soon", "I might need it within a couple years", "I don't fully understand what I'd be buying"],
      pathwayTags: [],
      resolved: false,
    };
  },
};

const giveMeEverything: Rule = {
  id: "fast_path",
  pathways: [],
  test: (m) => has(m, "show me everything", "full analysis", "give me the data", "give me the numbers", "just give me"),
  respond: (m, ctx) => ({
    content:
      "Understood — here's the direct version.\n\nWhat I have from My Stuff so far: " +
      (ctx.items.length ? "listed below in Deep Dive mode." : "nothing yet — add what you can in My Stuff and I'll fold it straight into the analysis.") +
      " Tell me the specific decision (e.g. \"consolidate this debt,\" \"buy at this price,\" \"keep or sell this property\") and I'll go straight to assumptions, numbers, and sensitivities — no hand-holding.",
    suggestions: ["Debt consolidation numbers", "Home affordability numbers", "Open a scenario tool"],
    pathwayTags: [],
    resolved: false,
  }),
};

const rules: Rule[] = [
  overwhelmed,
  giveMeEverything,
  divorce,
  selfEmployed,
  affordability,
  heloc,
  debtConsolidation,
  creditScore,
  trapped,
  cashQuestion,
  cryptoOrInvesting,
];

function fallback(m: string, ctx: UserContext, turn: number): EngineResult {
  const hasAnyData = ctx.items.length > 0;
  const opener = turn === 0
    ? "Here's what I'm seeing so far."
    : "Okay — building on what you've told me.";
  const reality = hasAnyData
    ? `${opener} I'm using what's already in My Stuff where it's relevant.`
    : `${opener} I don't have financial details from you yet, so tell me the parts that matter and I'll fold them in as we go — an estimate is fine.`;

  return {
    content:
      `${reality}\n\nTo give you something genuinely useful rather than generic: what are you actually trying to decide or accomplish here, and is there a timeline attached to it?`,
    suggestions: ["I want a quick answer", "Show me my options", "I'm not sure how to explain it"],
    pathwayTags: [],
    resolved: false,
  };
}

export function routeMessage(message: string, ctx: UserContext, depth: Depth, turn: number): EngineResult {
  const m = message.toLowerCase();
  for (const rule of rules) {
    if (rule.test(m)) {
      const result = rule.respond(m, ctx, depth, turn);
      return { ...result, suggestions: result.suggestions.length ? result.suggestions : baseSuggestions() };
    }
  }
  return fallback(m, ctx, turn);
}
