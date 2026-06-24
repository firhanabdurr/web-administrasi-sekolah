const transactionRepository = require('../repositories/transaction.repository');
const studentRepository = require('../repositories/student.repository');

class TransactionService {
  /**
   *Setoran Tabungan
   */
  async handleDeposit(studentId, amount, handledBy) {
    if (amount <= 0) {
      throw new Error('Nominal setoran harus lebih besar dari 0');
    }

    // Eksekusi ke database via Repository (ACID Transaction)
    return await transactionRepository.processTransaction(studentId, amount, 'Deposit', handledBy);
  }

  /**
   *Penarikan Tabungan
   */
  async handleWithdrawal(studentId, amount, handledBy) {
    if (amount <= 0) {
      throw new Error('Nominal penarikan harus lebih besar dari 0');
    }

    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw new Error('Data siswa tidak ditemukan');
    }

    //Validasi saldo minimum
    if (student.savings_balance < amount) {
      throw new Error(`Penarikan ditolak! Saldo tidak mencukupi. Saldo saat ini: Rp${student.savings_balance}`);
    }

    //Jika lolos validasi, eksekusi penarikan via Repository
    return await transactionRepository.processTransaction(studentId, amount, 'Withdrawal', handledBy);
  }

  /**
   *Pembayaran SPP
   */
  async handleSppPayment(studentId, month, year, handledBy) {
    const student = await studentRepository.findByIdWithClass(studentId);
    if (!student) {
      throw new Error('Data siswa tidak ditemukan');
    }

    if (!student.class_id) {
      throw new Error('Siswa ini belum di-assign ke kelas manapun, tidak bisa cek besaran SPP');
    }

    const sppAmount = student.class_id.spp_amount;

    //Cek apakah bulan dan tahun ini sudah dibayar sebelumnya
    const isAlreadyPaid = await transactionRepository.checkSppPaymentExists(studentId, month, year);
    if (isAlreadyPaid) {
      throw new Error(`SPP untuk bulan ${month} tahun ${year} sudah lunas.`);
    }

    //Eksekusi simpan data SPP
    const sppData = {
      student_id: studentId,
      month,
      year,
      amount: sppAmount, // Ambil nominal otomatis dari master kelas
      handled_by: handledBy
    };

    return await transactionRepository.createSppTransaction(sppData);
  }
}

module.exports = new TransactionService();