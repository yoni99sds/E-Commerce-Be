import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'],
  },
  discountValue: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode;
