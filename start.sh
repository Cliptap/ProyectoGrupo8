#!/bin/bash

echo "🐳 Iniciando ERP LuxChile con Docker..."
echo ""

# Detener contenedores existentes
docker-compose down

echo "🔨 Construyendo imágenes..."
docker-compose build

echo "🚀 Iniciando servicios..."
docker-compose up -d

echo ""
echo "✅ ERP LuxChile iniciado!"
echo ""
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:3000"
echo ""
echo "⏳ Espera 30 segundos para que todo inicie..."
echo ""
echo "📝 Ver logs: docker-compose logs -f"
echo "🛑 Detener: ./stop.sh o docker-compose down"
