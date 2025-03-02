const plays = {
  hamlet: {
    name: "Hamlet",
    type: "tragedy",
  },
  "as-like": {
    name: "As You Like It",
    type: "comedy",
  },
  othello: {
    name: "Othello",
    type: "tragedy",
  },
};
const invoices = [
  {
    customer: "BigCo",
    performances: [
      {
        playID: "hamlet",
        audience: 55,
      },
      {
        playID: "as-like",
        audience: 35,
      },
      {
        playID: "othello",
        audience: 40,
      },
    ],
  },
];

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function calculateDebt(amount, audience, audience_limit, extra_amount) {
  if (audience > audience_limit) {
    amount += extra_amount * (audience - audience_limit);
  }
  return amount;
}
function calculateCredit(performance, play) {
  let credit = Math.max(performance.audience - 30, 0);

  if (play.type === "comedy") {
    credit += Math.floor(performance.audience / 5);
  }
  return credit;
}
function statementGenerator(invoice, plays) {
  let totalAmount = 0;
  let credits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let debtAmount = 0;
    switch (play.type) {
      case "tragedy":
        debtAmount += calculateDebt(40000, perf.audience, 30, 1000);
        break;
      case "comedy":
        debtAmount += calculateDebt(30000, perf.audience, 20, 500);
        debtAmount += 10000;
        debtAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
    //Adds credits from a play into the wallet
    credits += calculateCredit(perf, play);
    // print line for this order
    result += ` ${play.name}: ${formatNumber(debtAmount / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += debtAmount;
  }
  result += `Amount owed is ${formatNumber(totalAmount / 100)}\n`;
  result += `You earned ${credits} credits\n`;
  return result;
}

console.log(statementGenerator(invoices[0], plays));

