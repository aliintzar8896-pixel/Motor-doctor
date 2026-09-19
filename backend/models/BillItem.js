/**
 * Bill item and analysis model
 */

export class BillItem {
  static analyze(items = []) {
    let totalEstimated = 0;
    let totalFairPrice = 0;
    let potentialSavings = 0;

    const analyzedItems = items.map((item, idx) => {
      const estimated = Number(item.estimatedPrice) || Number(item.amount) || 0;
      let fairPrice = estimated;
      let verdict = item.verdict || 'fair';
      let note = item.note || 'Fair pricing based on market standard';

      // Simple heuristic for overcharging or unnecessary repairs
      if (item.category === 'addon' || item.name?.toLowerCase().includes('coating') || item.name?.toLowerCase().includes('flush')) {
        verdict = 'unnecessary';
        fairPrice = 0;
        note = 'Often recommended by dealerships but optional/not required for routine maintenance';
      } else if (estimated > 2000 && !item.name?.toLowerCase().includes('clutch') && !item.name?.toLowerCase().includes('tyre')) {
        verdict = 'overpriced';
        fairPrice = Math.round(estimated * 0.65);
        note = `Fair market price is approximately ₹${fairPrice}. Labor/part cost markup is elevated.`;
      }

      totalEstimated += estimated;
      totalFairPrice += fairPrice;
      if (estimated > fairPrice) {
        potentialSavings += (estimated - fairPrice);
      }

      return {
        id: item.id || `item-${idx + 1}`,
        name: item.name,
        category: item.category || 'parts',
        estimatedPrice: estimated,
        fairPrice,
        verdict,
        note,
      };
    });

    return {
      totalOriginal: totalEstimated,
      totalFair: totalFairPrice,
      totalSavings: potentialSavings,
      items: analyzedItems,
      recommendation: potentialSavings > 1500
        ? 'High overcharge detected. Request garage to remove optional additives and revise labor rates.'
        : 'Estimate is mostly fair with minor negotiation headroom.',
    };
  }
}

export default BillItem;
