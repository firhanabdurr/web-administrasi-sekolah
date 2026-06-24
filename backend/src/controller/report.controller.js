const reportService = require('../services/report.service');

exports.generatePdfReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: 'Bulan dan Tahun wajib diisi' });
    }

    const filename = `Laporan_Keuangan_${month}_${year}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    // pipe data pdf langsung ke response
    await reportService.downloadMonthlyReport(res, parseInt(month), parseInt(year));

  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Gagal membuat laporan: ' + error.message });
    }
  }
};