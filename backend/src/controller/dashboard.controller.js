const SavingsTransaction = require('../models/SavingsTransaction');
const SppTransaction = require('../models/SppTransaction');

exports.getSummary = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const dateFilter = { timestamp: { $gte: startOfDay, $lte: endOfDay } };

    const totalDeposit = await SavingsTransaction.aggregate([
      { $match: { ...dateFilter, type: 'Deposit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalWithdrawal = await SavingsTransaction.aggregate([
      { $match: { ...dateFilter, type: 'Withdrawal' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSpp = await SppTransaction.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        today_deposit: totalDeposit[0]?.total || 0,
        today_withdrawal: totalWithdrawal[0]?.total || 0,
        today_spp: totalSpp[0]?.total || 0,
        total_cash_in: (totalDeposit[0]?.total || 0) + (totalSpp[0]?.total || 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};