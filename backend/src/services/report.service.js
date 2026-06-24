const transactionRepository = require('../repositories/transaction.repository');
const PdfGenerator = require('../utils/pdfGenerator');

class ReportService {
  async downloadMonthlyReport(res, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const rawData = await transactionRepository.getTransactionsByDateRange(startDate, endDate);

    const reportData = rawData.map(trx => ({
      timestamp: trx.timestamp,
      type: trx.type || 'SPP',
      description: `Siswa: ${trx.student_id.name}`,
      amount: trx.amount
    }));

    const startStr = startDate.toLocaleDateString('id-ID');
    const endStr = endDate.toLocaleDateString('id-ID');
    
    await PdfGenerator.generateFinancialReport(res, reportData, startStr, endStr);
  }
}

module.exports = new ReportService();