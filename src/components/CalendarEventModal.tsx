import { useState, useEffect } from 'react'
import { Calendar, X, Info } from 'lucide-react'

export function CalendarEventModal({ 
  isOpen, 
  onClose, 
  onSave,
  event
}: { 
  isOpen: boolean
  onClose: () => void
  onSave: (event: any) => void
  event?: any
}) {
  const [eventType, setEventType] = useState<'match' | 'training'>('match')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [opponent, setOpponent] = useState('')
  const [trainingType, setTrainingType] = useState('Técnico')
  const [notes, setNotes] = useState('')
  const [reminder, setReminder] = useState(false)

  useEffect(() => {
    if (event) {
      setEventType(event.type || 'match')
      setDate(event.date || '')
      setTime(event.time || '')
      setLocation(event.location || '')
      setOpponent(event.opponent || '')
      setTrainingType(event.trainingType || 'Técnico')
      setNotes(event.notes || '')
      setReminder(event.reminder || false)
    } else {
      const today = new Date().toISOString().split('T')[0]
      setDate(today)
      const now = new Date()
      const timeStr = now.toTimeString().slice(0, 5)
      setTime(timeStr)
    }
  }, [event, isOpen])

  const handleSave = () => {
    const eventData = {
      id: event?.id || Date.now().toString(),
      type: eventType,
      title: eventType === 'match' 
        ? `vs ${opponent}` 
        : `Treino - ${trainingType}`,
      date,
      time,
      location,
      opponent: eventType === 'match' ? opponent : undefined,
      trainingType: eventType === 'training' ? trainingType : undefined,
      notes,
      reminder,
      status: 'scheduled'
    }
    onSave(eventData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-purple-600/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-purple-600/20 p-2 rounded-lg">
                <Calendar size={28} />
              </span>
              {event ? 'Editar Evento' : 'Novo Evento'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEventType('match')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  eventType === 'match'
                    ? 'border-green-600 bg-green-600/20 text-green-300'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                <span className="text-2xl">🏐</span>
                <div className="font-semibold mt-1">Partida</div>
              </button>
              <button
                type="button"
                onClick={() => setEventType('training')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  eventType === 'training'
                    ? 'border-purple-600 bg-purple-600/20 text-purple-300'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                <span className="text-2xl">💪</span>
                <div className="font-semibold mt-1">Treino</div>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Horário *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Local</label>
              <input
                type="text"
                placeholder="Ex: Ginásio Municipal"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>

            {eventType === 'match' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Adversário *</label>
                <input
                  type="text"
                  placeholder="Ex: Spartacus"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  required
                />
              </div>
            )}

            {eventType === 'training' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Treino</label>
                <select
                  value={trainingType}
                  onChange={(e) => setTrainingType(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                >
                  {['Técnico', 'Tático', 'Físico', 'Mental', 'Videoanálise', 'Levantamento'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notas</label>
              <textarea
                placeholder="Observações sobre o evento..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 resize-none"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-purple-600/50 transition-all">
              <input
                type="checkbox"
                checked={reminder}
                onChange={(e) => setReminder(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-600 focus:ring-offset-gray-900"
              />
              <span className="text-gray-300">Receber lembrete no dia</span>
            </label>

            {date && time && (
              <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3 flex items-start gap-3">
                <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  Conflitos serão verificados automaticamente ao salvar.
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all border border-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {event ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}