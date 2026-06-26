const Student = require('../models/Student');
const SppTransaction = require('../models/SppTransaction');

exports.registerStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ success: true, message: 'Siswa berhasil didaftarkan', data: newStudent });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getStudentByNis = async (req, res) => {
  try {
    const { nis } = req.params;
    
    const student = await Student.findOne({ nis }).populate('class_id');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan' });
    }

    const currentYear = new Date().getFullYear();
    const paidSpp = await SppTransaction.find({ student_id: student._id, year: currentYear }).select('month');
    const paidMonths = paidSpp.map(spp => spp.month);

    res.status(200).json({
      success: true,
      data: {
        id: student._id,
        nis: student.nis,
        name: student.name,
        class: student.class_id ? student.class_id.name : 'Lulus/Keluar',
        spp_amount: student.class_id ? student.class_id.spp_amount : 0,
        savings_balance: student.savings_balance,
        paid_spp_months: paidMonths // Frontend tinggal filter bulan 1-12 yang belum ada di array ini
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};