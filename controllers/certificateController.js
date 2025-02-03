const { Certificate, Owner } = require("../models");

exports.createCertificate = async (req, res) => {
  try {
    const { owner, name, certificateNumber, files, startedAt, endedAt, createdBy } = req.body;

    // Проверяем, существует ли пользователь с данным ID владельца
    const ownerRecord = await Owner.findById(owner);
    if (!ownerRecord) {
      return res.status(404).json({ message: "Владелец не найден" });
    }

    // Создаем новый сертификат
    const certificate = new Certificate({
      name,
      certificateNumber,
      files,
      startedAt,
      endedAt,
      createdBy,
      owner,
    });

    // Сохраняем сертификат в базе данных
    await certificate.save();

    // Добавляем ID сертификата в массив сертификатов владельца
    ownerRecord.certificates.push(certificate._id);
    await ownerRecord.save();

    res.status(201).json({
      message: "Сертификат успешно создан",
      certificate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при создании сертификата",
      error: error.message || error,
    });
  }
};


exports.updateCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      certificateId,
      req.body,
      { new: true }
    );
    if (!updatedCertificate) {
      return res.status(404).json({ message: "Сертификат не найден" });
    }
    res.json(updatedCertificate);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при обновлении сертификата", error });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const deletedCertificate = await Certificate.findByIdAndDelete(
      certificateId
    );
    if (!deletedCertificate) {
      return res.status(404).json({ message: "Сертификат не найден" });
    }
    res.json({ message: "Сертификат удалён" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении сертификата", error });
  }
};

exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении сертификатов", error });
  }
};

exports.getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findById(certificateId);
    if (!certificate) {
      return res.status(404).json({ message: "Сертификат не найден" });
    }
    res.json(certificate);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении сертификата", error });
  }
};
