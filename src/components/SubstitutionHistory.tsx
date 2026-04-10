import { RotateCcw, Clock, X, ArrowRight } from 'lucide-react'

interface SubstitutionHistoryProps {
  substitutions: any[]
  onCloseHistory: () => void
  currentSet: number
}

export default function SubstitutionHistory({
  substitutions,
  onCloseHistory,
  currentSet
}: SubstitutionHistoryProps) {
  if (substitutions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl p-6 text-center">
          <RotateCcw className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Histórico de Substituições</h3>
          <p className="text-gray-400 mb-6">Nenhuma substituição registrada ainda</p>
          <button
            onClick={onCloseHistory}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  // Filtrar substituições do set atual e ordenar por ordem reversa
  const currentSetSubs = substitutions
    .filter((sub: any) => sub.set === currentSet)
    .reverse()

  const allSubsSorted = [...substitutions].reverse()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="text-xl font-bold text-white">Histórico de Substituições</h3>
                <p className="text-sm text-gray-400">Set {currentSet} • {currentSetSubs.length} substituição(ões)</p>
              </div>
            </div>
            <button
              onClick={onCloseHistory}
              className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Tabs: Set Atual vs Todos */}
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-2 bg-purple-600 rounded-xl text-white text-center font-medium">
              Set {currentSet}
            </div>
            <div className="flex-1 px-4 py-2 bg-gray-800 rounded-xl text-gray-400 text-center">
              Todos ({substitutions.length})
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {currentSetSubs.map((sub: any, index: number) => (
            <div
              key={`${sub.playerOut}-${sub.playerIn}-${index}`}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  {/* Jogador Saindo */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-1">#{sub.playerOut}</div>
                    {sub.playerOutName && (
                      <div className="text-sm text-gray-400">{sub.playerOutName}</div>
                    )}
                  </div>
                  <ArrowRight className="w-6 h-6 text-purple-500" />
                  {/* Jogador Entrando */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">#{sub.playerIn}</div>
                    {sub.playerInName && (
                      <div className="text-sm text-gray-400">{sub.playerInName}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{sub.time || '--:--'}</span>
                </div>
              </div>
              {sub.set && (
                <div className="text-xs text-purple-400 mt-2">
                  Set {sub.set}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer - Todos os Sets */}
        {currentSetSubs.length !== allSubsSorted.length && (
          <div className="border-t border-gray-700 p-6">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Outros Sets:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[...new Set(allSubsSorted.map((s: any) => s.set))].map((setNum: number) => 
                setNum !== currentSet && (
                  <div
                    key={setNum}
                    className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-center"
                  >
                    <div className="text-lg font-bold text-white">Set {setNum}</div>
                    <div className="text-xs text-gray-400">
                      {allSubsSorted.filter((s: any) => s.set === setNum).length} sub(s)
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6">
          <button
            onClick={onCloseHistory}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}