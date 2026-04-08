import React, { useState } from 'react';
import { CourtMap } from './CourtMap';
import { X } from 'lucide-react';

interface CourtZoneSelectorProps {
  isOpen: boolean;
  actionType: string;
  onZoneSelect: (zone: number) => void;
  onClose: () => void;
}

export const CourtZoneSelector: React.FC<CourtZoneSelectorProps> = ({
  isOpen,
  actionType,
  onZoneSelect,
  onClose,
}) => {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const handleZoneClick = (zone: number) => {
    setSelectedZone(zone);
    setTimeout(() => {
      onZoneSelect(zone);
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              🗺️ Selecionar Zona
            </h3>
            <p className="text-purple-400 mt-1">Selecione a zona para {actionType}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <CourtMap
          onZoneClick={handleZoneClick}
          selectedZone={selectedZone || undefined}
          actionType={actionType}
        />

        <p className="text-gray-400 text-sm text-center mt-4">
          Clique em uma zona para confirmar
        </p>
      </div>
    </div>
  );
};

export default CourtZoneSelector;