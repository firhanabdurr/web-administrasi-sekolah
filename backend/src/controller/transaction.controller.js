const transactionService = require('../services/transaction.service');

exports.withdrawSavings = async (req, res) => {
  try {
    //Ekstrak data dari request
    const { studentId, amount } = req.body;
    const handledBy = req.user.id; // Didapat dari middleware JWT Auth

    const result = await transactionService.handleWithdrawal(studentId, amount, handledBy);

    res.status(200).json({
      success: true,
      message: 'Penarikan berhasil',
      data: result
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.depositSavings = async (req, res) => {
  try {
    const { studentId, amount } = req.body;
    const handledBy = req.user.id;

    const result = await transactionService.handleDeposit(studentId, amount, handledBy);
    res.status(200).json({ success: true, message: 'Setoran berhasil', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.paySpp = async (req, res) => {
  try {
    const { studentId, month, year } = req.body;
    const handledBy = req.user.id;

    const result = await transactionService.handleSppPayment(studentId, month, year, handledBy);
    res.status(200).json({ success: true, message: 'Pembayaran SPP berhasil', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};