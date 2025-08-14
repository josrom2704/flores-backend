exports.getAllFlores = async (req, res) => {
  try {
    const { floristeriaId, dominio, categoria } = req.query;
    const query = {};

    console.log('🔍 getAllFlores - Query params:', { floristeriaId, dominio, categoria });

    // Resuelve floristería
    if (floristeriaId) {
      query.floristeria = floristeriaId;
    } else if (dominio) {
      console.log('�� Buscando floristería con dominio:', dominio);
      const f = await Floristeria.findOne({ dominio: String(dominio).toLowerCase() });
      console.log('�� Floristería encontrada:', f ? f._id : 'NO ENCONTRADA');
      if (!f) return res.json([]); // si no hay floristería para ese dominio: 0 productos
      query.floristeria = f._id;
    }

    console.log('🔍 Query final:', JSON.stringify(query));

    const flores = await Flor.find(query);
    console.log('🔍 Productos encontrados:', flores.length);
    
    res.json(flores);
  } catch (error) {
    console.error('❌ Error en getAllFlores:', error);
    res.status(500).json({ message: error.message });
  }
};