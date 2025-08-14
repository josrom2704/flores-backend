const mongoose = require('mongoose');

function extraerDominio(url) {
  try {
    if (!url) return null;
    return new URL(url).hostname.trim().toLowerCase();
  } catch {
    return null;
  }
}

const FloristeriaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    url: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          try { new URL(v); return true; } catch { return false; }
        },
        message: 'URL inválida',
      },
    },
    dominio: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // permite docs sin dominio si no pasas URL aún
    },
    logo: { type: String, trim: true },
    activa: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Autocompletar dominio desde url cuando aplique
FloristeriaSchema.pre('validate', function (next) {
  if (!this.dominio && this.url) {
    this.dominio = extraerDominio(this.url);
  }
  if (this.dominio) this.dominio = this.dominio.trim().toLowerCase();
  next();
});

FloristeriaSchema.index({ dominio: 1 });

module.exports = mongoose.model('Floristeria', FloristeriaSchema);
