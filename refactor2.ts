interface Play {
  name: string;
  type: Genres;
}

type Genres = "tragedy" | "comedy";

interface Plays {
  [key: string]: Play;
}

interface StatementData {
  customer: string;
  performances: PerformanceType[];
  totalAmount: number;
  totalVolumeCredits: number;
}
type Invoice = {
  customer: string;
  performances: PerformanceType[];
};

type PerformanceType = {
  playId: string;
  audience: number;
  amount?: number;
  totalVolume?: number;
};

const plays: Plays = {
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

export const invoices: Invoice[] = [
  {
    customer: "BigCo",
    performances: [
      {
        playId: "hamlet",
        audience: 55,
      },
      {
        playId: "as-like",
        audience: 35,
      },
      {
        playId: "othello",
        audience: 40,
      },
    ],
  },
];

/**
 * Formats a number as USD currency
 */
function formatAsCurrency(amount: number | undefined) {
  if (!amount) return 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

/**
 * Class to handle theater performance calculations and statement generation
 */
class PerformanceCalculator {
  plays: Plays;
  constructor(plays: Plays) {
    this.plays = plays;
  }

  /**
   * Calculates the amount for a performance based on play type and audience
   */
  calculateAmount(performance: PerformanceType, playType: Genres): number {
    let amount = 0;

    switch (playType) {
      case "tragedy":
        amount = this.calculateBaseAmount(
          40000,
          performance.audience,
          30,
          1000
        );
        break;
      case "comedy":
        amount = this.calculateBaseAmount(30000, performance.audience, 20, 500);
        amount += 10000;
        amount += 300 * performance.audience;
        break;
      default:
        throw new Error(`Unknown play type: ${playType}`);
    }

    return amount;
  }

  /**
   * Calculates the base amount with audience thresholds
   */
  calculateBaseAmount(
    baseAmount: number,
    audience: number,
    audienceThreshold: number,
    extraAmountPerAttendee: number
  ) {
    if (audience > audienceThreshold) {
      baseAmount += extraAmountPerAttendee * (audience - audienceThreshold);
    }
    return baseAmount;
  }

  /**
   * Calculates volume credits for a performance
   */
  calculateVolumeCredits(performance: PerformanceType, playType: Genres) {
    // Base credits: 1 credit for every audience member above 30
    let credits = Math.max(performance.audience - 30, 0);

    // Bonus credits for comedy performances
    if (playType === "comedy") {
      credits += Math.floor(performance.audience / 5);
    }

    return credits;
  }

  /**
   * Generates a statement for an invoice
   */
  generateStatement(invoice: Invoice) {
    const statementData = this.createStatementData(invoice);
    return this.renderPlainText(statementData);
  }

  /**
   * Creates statement data from invoice
   */
  createStatementData(invoice: Invoice) {
    const statementData: StatementData = {
      customer: invoice.customer,
      performances: [],
      totalAmount: 0,
      totalVolumeCredits: 0,
    };

    for (const performance of invoice.performances) {
      const play = this.plays[performance.playId];
      const amount = this.calculateAmount(performance, play.type);
      const volumeCredits = this.calculateVolumeCredits(performance, play.type);

      // Add performance data
      statementData.performances.push({
        playId: play.name,
        amount: amount,
        audience: performance.audience,
        totalVolume: volumeCredits,
      });

      // Update totals
      statementData.totalAmount += amount;
      statementData.totalVolumeCredits += volumeCredits;
    }

    return statementData;
  }

  /**
   * Renders statement data as plain text
   */
  renderPlainText(data: StatementData) {
    let result = `Statement for ${data.customer}\n`;

    for (const perf of data.performances) {
      result += ` ${perf.playId}: ${formatAsCurrency(perf.amount)} (${
        perf.audience
      } seats)\n`;
    }

    result += `Amount owed is ${formatAsCurrency(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;

    return result;
  }
}

// Create calculator and generate statement
const calculator = new PerformanceCalculator(plays);
console.log(calculator.generateStatement(invoices[0]));
