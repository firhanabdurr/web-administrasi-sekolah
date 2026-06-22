const mongoose = require('mongoose');
const Student = require('../models/Student');
const SavingsTransaction = require('../models/SavingsTransaction');

class TransactionRepository {
  /**
   * proses Setoran Tabungan menggunakan ACID Transaction
   */
  async processDeposit(studentId, amount, handledBy) {
    const session = await mongoose.startSession();
    
    session.startTransaction();
    
    try {
      // 1. Cari data siswa berdasarkan ID, gunakan session
      const student = await Student.findById(studentId).session(session);
      if (!student) {
        throw new Error('Siswa tidak ditemukan');
      }

      const newBalance = student.savings_balance + amount;

      student.savings_balance = newBalance;
      await student.save({ session });

      const transactionRecord = new SavingsTransaction({
        student_id: studentId,
        type: 'Deposit',
        amount: amount,
        balance_after: newBalance,
        handled_by: handledBy
      });
      await transactionRecord.save({ session });

      await session.commitTransaction();
      session.endSession();

      return transactionRecord;

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error; 
    }
  }

  /**
   *pencatatan SPP
   */
  async createSppTransaction(sppData) {
    const SppTransaction = require('../models/SppTransaction');
    const newSpp = new SppTransaction(sppData);
    return await newSpp.save();
  }
}

module.exports = new TransactionRepository();