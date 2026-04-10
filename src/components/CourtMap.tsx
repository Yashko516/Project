import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CourtMapProps {
  onZoneClick?: (zone: number) => void;
  selectedZone?: number;
 heatmapData?: { zone: number; count: number }[];
  showHeatmap?: boolean;
  onClose?: () => void;
  actionType?: string;
}

export const CourtMap: React.FC<CourtMapProps> = ({
  onZoneClick,
  selectedZone,
  heatmapData = [],
  showHeatmap = false,
  onClose,
  actionType = 'Ação'
}) => {
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);

  // Calcular intensidade do heatmap (0 a 1)
  const getHeatmapIntensity = (zone: number): number => {
    if (!heatmapData || heatmapData.length === 0) return 0;
    const data = heatmapData.find(d => d.zone === zone);
    if (!data) return 0;
    const maxCount = Math.max(...heatmapData.map(d => d.count));
    return data.count / maxCount;
  };

  const getZoneColor = (zone: number): string => {
    const intensity = getHeatmapIntensity(zone);
    if (intensity === 0) return '#1F2937'; // Cinza escuro
    
    // Gradiente de verde para vermelho baseado na intensidade
    if (intensity < 0.33) {
      return `rgba(34, 197, 94, ${0.2 + intensity * 2})`; // Verde
    } else if (intensity < 0.66) {
      return `rgba(234, 179, 8, ${0.3 + intensity * 1.5})`; // Amarelo
    } else {
      return `rgba(239, 68, 68, ${0.4 + intensity})`; // Vermelho
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-purple-500/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          🗺️ Mapa de Quadra
          {actionType && <span className="text-purple-400">- {actionType}</span>}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* SVG da Quadra */}
      <div className="flex justify-center">
        <svg 
          width="300" 
          height="200" 
          viewBox="0 0 300 200"
          className="border-2 border-purple-500 rounded"
        >
          {/* Fundo da quadra */}
          <rect x="5" y="5" width="290" height="190" fill="#1F2937" />

          {/* Linha central */}
          <line x1="150" y1="5" x2="150" y2="195" stroke="#8B5CF6" strokeWidth="2" />

          {/* Linhas de ataque (3m) */}
          <line x1="75" y1="5" x2="75" y2="195" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="225" y1="5" x2="225" y2="195" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="5,5" />

          {/* Redes de ataque */}
          <rect x="75" y="5" width="75" height="190" fill="#8B5CF6" fillOpacity="0.05" />
          <rect x="150" y="5" width="75" height="190" fill="#8B5CF6" fillOpacity="0.05" />

          {/* Linha de pontuação */}
          <line x1="5" y1="170" x2="95" y2="170" stroke="#8B5CF6" strokeWidth="2" />
          <line x1="205" y1="170" x2="295" y2="170" stroke="#8B5CF6" strokeWidth="2" />

          {/* Zonas - Lado Esquerdo (1, 4) */}
          <g onClick={() => onZoneClick && onZoneClick(1)}
             className="cursor-pointer transition-opacity"
             style={{ opacity: hoveredZone === 1 ? 0.8 : 1 }}
             onMouseEnter={() => setHoveredZone(1)}
             onMouseLeave={() => setHoveredZone(null)}>
            <rect x="5" y="5" width="95" height="87" 
                  fill={showHeatmap ? getZoneColor(1) : selectedZone === 1 ? '#8B5CF6' : '#374151'} 
                  stroke={selectedZone === 1 ? '#F59E0B' : '#4B5563'} 
                  strokeWidth={selectedZone === 1 ? 3 : 1} />
            <text x="52" y="52" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">1</text>
          </g>

          <g onClick={() => onZoneClick && onZoneClick(4)}
             className="cursor-pointer transition-opacity"
             style={{ opacity: hoveredZone === 4 ? 0.8 : 1 }}
             onMouseEnter={() => setHoveredZone(4)}
             onMouseLeave={() => setHoveredZone(null)}>
            <rect x="5" y="95" width="95" height="95" 
                  fill={showHeatmap ? getZoneColor(4) : selectedZone === 4 ? '#8B5CF6' : '#374151'} 
                  stroke={selectedZone === 4 ? '#F59E0B' : '#4B5563'} 
                  strokeWidth={selectedZone === 4 ? 3 : 1} />
            <text x="52" y="147" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">4</text>
          </g>

          {/* Zonas - Lado Direito (2, 5) */}
          <g onClick={() => onZoneClick && onZoneClick(2)}
             className="cursor-pointer transition-opacity"
             style={{ opacity: hoveredZone === 2 ? 0.8 : 1 }}
             onMouseEnter={() => setHoveredZone(2)}
             onMouseLeave={() => setHoveredZone(null)}>
            <rect x="100" y="5" width="95" height="87" 
                  fill={showHeatmap ? getZoneColor(2) : selectedZone === 2 ? '#8B5CF6' : '#374151'} 
                  stroke={selectedZone === 2 ? '#F59E0B' : '#4B5563'} 
                  strokeWidth={selectedZone === 2 ? 3 : 1} />
            <text x="147" y="52" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">2</text>
          </g>

          <g onClick={() => onZoneClick && onZoneClick(5)}
             className="cursor-pointer transition-opacity"
             style={{ opacity: hoveredZone === 5 ? 0.8 : 1 }}
             onMouseEnter={() => setHoveredZone(5)}
             onMouseLeave={() => setHoveredZone(null)}>
            <rect x="100" y="95" width="95" height="95" 
                  fill={showHeatmap ? getZoneColor(5) : selectedZone === 5 ? '#8B5CF6' : '#374151'} 
                  stroke={selectedZone === 5 ? '#F59E0B' : '#4B5563'} 
                  strokeWidth={selectedZone === 5 ? 3 : 1} />
            <text x="147" y="147" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">5</text>
          </g>

          {/* Zonas - Traseiro (3, 6) */}
          <g onClick={() => onZoneClick && onZoneClick(3)}
             className="cursor-pointer transition-opacity"
             style={{ opacity: hoveredZone === 3 ? 0.8 : 1 }}
             onMouseEnter={() => setHoveredZone(3)}
             onMouseLeave={() => setHoveredZone(null)}>
            <rect x="200" y="5" width="95" height="87" 
                  fill={showHeatmap ? getZoneColor(3) : selectedZone === 3 ? '#8B5CF6' : '#374151'} 
                  stroke={selectedZone === 3 ? '#F59E0B' : '#4B5563'} 
                  strokeWidth={selectedZone === 3 ? 3 : 1} />
            <text x="247" y="52" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">3</text>
          </g>

          <g onClick={() => onZoneClick && onZoneClick(6)}
             className="cursor-pointer transition-opacity"
             style={{ opacity: hoveredZone === 6 ? 0.8 : 1 }}
             onMouseEnter={() => setHoveredZone(6)}
             onMouseLeave={() => setHoveredZone(null)}>
            <rect x="200" y="95" width="95" height="95" 
                  fill={showHeatmap ? getZoneColor(6) : selectedZone === 6 ? '#8B5CF6' : '#374151'} 
                  stroke={selectedZone === 6 ? '#F59E0B' : '#4B5563'} 
                  strokeWidth={selectedZone === 6 ? 3 : 1} />
            <text x="247" y="147" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">6</text>
          </g>

          {/* Rede */}
          <line x1="5" y1="100" x2="295" y2="100" stroke="#EF4444" strokeWidth="3" />
        </svg>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 mt-4 text-sm">
        {showHeatmap && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Intensidade:</span>
            <div className="w-4 h-4 rounded" style={{backgroundColor: 'rgba(34, 197, 94, 0.6)'}}></div>
            <span className="text-gray-500">Baixo</span>
            <div className="w-4 h-4 rounded" style={{backgroundColor: 'rgba(234, 179, 8, 0.6)'}}></div>
            <span className="text-gray-500">Médio</span>
            <div className="w-4 h-4 rounded" style={{backgroundColor: 'rgba(239, 68, 68, 0.8)'}}></div>
            <span className="text-gray-500">Alto</span>
          </div>
        )}
        
        {heatmapData.length > 0 && (
          <div className="flex gap-4">
            {heatmapData.map(({zone, count}) => (
              <div key={zone} className="bg-gray-800 px-3 py-1 rounded-full border border-purple-500/30">
                <span className="text-purple-400 font-bold">Z{zone}:</span>
                <span className="text-white ml-1">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informações de zona */}
      {selectedZone && (
        <div className="mt-4 bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
          <p className="text-purple-400 font-semibold">
            Zona {selectedZone} selecionada
          </p>
        </div>
      )}
    </div>
  );
};

export default CourtMap;