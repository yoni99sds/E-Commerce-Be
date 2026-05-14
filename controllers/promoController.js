import PromoCode from "../models/PromoCode.js";

export const validatePromo = async (req, res) => {
  const code = req.body.code?.trim().toUpperCase();

  if (!code) {
    return res.status(400).json({
      message: "Promo code required",
    });
  }

  const promo = await PromoCode.findOne({
    code,
    isActive: true,
  });

  if (!promo) {
    return res.status(404).json({
      message: "Invalid promo code",
    });
  }

  if (promo.expiryDate && new Date() > promo.expiryDate) {
    return res.status(400).json({
      message: "Promo code expired",
    });
  }

  return res.json({
    code: promo.code,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
  });
};

export const createPromo = async (req, res) => {
  const promo = await PromoCode.create(req.body);
  res.status(201).json(promo);
};

export const getPromos = async (req, res) => {
  const promos = await PromoCode.find();
  res.json(promos);
};

export const deletePromo = async (req, res) => {
  await PromoCode.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const updatePromo = async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(promo);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
