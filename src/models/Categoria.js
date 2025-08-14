import mongoose from "mongoose"

const categoriaSchema = new mongoose.Schema({
  nombre: String,
  slug: String,
  descripcion: String,
  icono: String,
  imagen: String,
  floristeria: { type: mongoose.Schema.Types.ObjectId, ref: "Floristeria" }
})

export default mongoose.model("Categoria", categoriaSchema)
