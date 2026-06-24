const PDFDocument = require('pdfkit');

class PdfGenerator {
  /**
   * Fungsi untuk membuat laporan keuangan dan mengalirkannya langsung ke response HTTP
   */
  static generateFinancialReport(res, reportData, startDate, endDate) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        doc.pipe(res);

        // --- HEADER LAPORAN ---
        doc.fontSize(16).font('Helvetica-Bold').text('LAPORAN REKAPITULASI KEUANGAN', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text(`Periode: ${startDate} s/d ${endDate}`, { align: 'center' });
        doc.moveDown(2);

        // --- HEADER TABEL ---
        const tableTop = 150;
        doc.font('Helvetica-Bold');
        this.generateTableRow(doc, tableTop, 'Tanggal', 'Tipe Transaksi', 'Keterangan', 'Nominal');
        this.generateHr(doc, tableTop + 20);

        // --- ISI TABEL ---
        doc.font('Helvetica');
        let position = tableTop + 30;
        let totalIncome = 0;

        reportData.forEach((item) => {
          // Format tanggal
          const dateStr = new Date(item.timestamp).toLocaleDateString('id-ID');
          
          // Format nominal Rupiah
          const amountStr = `Rp ${item.amount.toLocaleString('id-ID')}`;
          
          // Akumulasi total
          totalIncome += item.amount;

          this.generateTableRow(doc, position, dateStr, item.type, item.description, amountStr);
          this.generateHr(doc, position + 20);
          
          position += 30;

          if (position > 700) {
            doc.addPage();
            position = 50; 
          }
        });

        // --- FOOTER / TOTAL ---
        doc.moveDown(2);
        doc.font('Helvetica-Bold').text(`TOTAL PEMASUKAN: Rp ${totalIncome.toLocaleString('id-ID')}`, { align: 'right' });

        doc.end();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Fungsi helper untuk menggambar baris tabel
  static generateTableRow(doc, y, date, type, desc, amount) {
    doc.fontSize(10)
       .text(date, 50, y)
       .text(type, 150, y)
       .text(desc, 300, y)
       .text(amount, 450, y, { width: 90, align: 'right' });
  }

  // Fungsi helper untuk menggambar garis horizontal (pembatas tabel)
  static generateHr(doc, y) {
    doc.strokeColor('#aaaaaa')
       .lineWidth(1)
       .moveTo(50, y)
       .lineTo(540, y)
       .stroke();
  }
}

module.exports = PdfGenerator;