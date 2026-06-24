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