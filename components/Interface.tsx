import React, { useState } from 'react';
import { Move3d, Palette, Menu, X, Grid3x3, AlertCircle, Trash2, Type, Layers, Ban, Users, PlusSquare, Bot, MousePointerClick } from 'lucide-react';

interface InterfaceProps {
  color1: string;
  setColor1: (c: string) => void;
  color2: string;
  setColor2: (c: string) => void;
  size: number;
  setSize: (s: number) => void;
  
  // Adding Single Obstacle Props
  pendingObstacle: { x: number, z: number } | null;
  onConfirmObstacle: () => void;
  
  // Removing Obstacle Props
  pendingRemoval: { x: number, z: number } | null;
  onConfirmRemove: () => void;

  // Mass Add Props
  pendingMassAdd: { obstaclesToAdd: {x: number, z: number}[] } | null;
  onConfirmMassAdd: () => void;

  // Mass Remove Props
  pendingMassRemove: { obstaclesToRemove: {x: number, z: number}[] } | null;
  onConfirmMassRemove: () => void;
  
  onCancel: () => void;

  showLabels: boolean;
  setShowLabels: (show: boolean) => void;

  // Agent Props
  selectedAgentType: string | null;
  onSelectAgentType: (type: string | null) => void;
  onClearAgents: () => void;
  agentCount: number;
}

export const Interface: React.FC<InterfaceProps> = ({ 
  color1, setColor1, 
  color2, setColor2,
  size, setSize,
  pendingObstacle,
  onConfirmObstacle,
  pendingRemoval,
  onConfirmRemove,
  pendingMassAdd,
  onConfirmMassAdd,
  pendingMassRemove,
  onConfirmMassRemove,
  onCancel,
  showLabels,
  setShowLabels,
  selectedAgentType,
  onSelectAgentType,
  onClearAgents,
  agentCount
}) => {
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(true);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);

  return (
    <div className="w-full h-full relative">
      
      {/* LEFT Hamburger Toggle Button (Board Config) */}
      <button 
        onClick={() => setIsLeftMenuOpen(!isLeftMenuOpen)}
        className="pointer-events-auto absolute top-4 left-4 z-50 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg border border-slate-600 transition-all active:scale-95"
        title="Menu de Configurações"
      >
        {isLeftMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* RIGHT Hamburger Toggle Button (Agents) */}
      <button 
        onClick={() => setIsRightMenuOpen(!isRightMenuOpen)}
        className="pointer-events-auto absolute top-4 right-4 z-50 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg border border-indigo-400 transition-all active:scale-95"
        title="Menu de Agentes"
      >
        {isRightMenuOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* ADD SINGLE Obstacle Confirmation */}
      {pendingObstacle && (
        <div className="pointer-events-auto absolute bottom-6 right-6 z-50 flex flex-col gap-2 w-80 transform transition-all animate-in slide-in-from-right duration-300">
          <div className="bg-slate-800/90 backdrop-blur-md border border-slate-600 p-4 rounded-2xl shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <AlertCircle size={24} />
              </div>
              
              <div className="flex-1">
                <h2 className="text-base font-bold text-white mb-1">Adicionar Obstáculo?</h2>
                <p className="text-slate-300 text-xs mb-3">
                  Posicionar cubo na {String.fromCharCode(65 + pendingObstacle.x)}{pendingObstacle.z + 1}?
                </p>

                <div className="flex gap-2 w-full">
                  <button 
                    onClick={onCancel}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={onConfirmObstacle}
                    className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-lg shadow-indigo-500/25"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MASS ADD Obstacle Confirmation */}
      {pendingMassAdd && (
        <div className="pointer-events-auto absolute bottom-6 right-6 z-50 flex flex-col gap-2 w-80 transform transition-all animate-in slide-in-from-right duration-300">
          <div className="bg-slate-800/90 backdrop-blur-md border border-indigo-500/30 p-4 rounded-2xl shadow-2xl shadow-indigo-900/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Layers size={24} />
              </div>
              
              <div className="flex-1">
                <h2 className="text-base font-bold text-white mb-1">Adição em Massa</h2>
                <p className="text-slate-300 text-xs mb-3">
                  Preencher área selecionada com <strong>{pendingMassAdd.obstaclesToAdd.length}</strong> cubos?
                </p>

                <div className="flex gap-2 w-full">
                  <button 
                    onClick={onCancel}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={onConfirmMassAdd}
                    className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-lg shadow-indigo-500/25"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MASS REMOVE Obstacle Confirmation */}
      {pendingMassRemove && (
        <div className="pointer-events-auto absolute bottom-6 right-6 z-50 flex flex-col gap-2 w-80 transform transition-all animate-in slide-in-from-right duration-300">
          <div className="bg-slate-800/90 backdrop-blur-md border border-rose-500/30 p-4 rounded-2xl shadow-2xl shadow-rose-900/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                <Ban size={24} />
              </div>
              
              <div className="flex-1">
                <h2 className="text-base font-bold text-white mb-1">Remoção em Massa</h2>
                <p className="text-slate-300 text-xs mb-3">
                  Remover <strong>{pendingMassRemove.obstaclesToRemove.length}</strong> cubos da área selecionada?
                </p>

                <div className="flex gap-2 w-full">
                  <button 
                    onClick={onCancel}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={onConfirmMassRemove}
                    className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors shadow-lg shadow-rose-500/25"
                  >
                    Remover Tudo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEFT Sidebar Menu (Settings) */}
      <div 
        className={`
          pointer-events-auto absolute top-0 left-0 h-full w-80 
          bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 shadow-2xl
          transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto
          ${isLeftMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 pt-20 flex flex-col gap-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
              Tabuleiro 3D
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Configure seu tabuleiro e visualize em tempo real. Arraste para criar áreas de obstáculos.
            </p>
          </div>

          {/* Size Configuration */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <Grid3x3 size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Dimensões</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-slate-300 text-sm mb-1">
                <span>Tamanho: {size}x{size}</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="20" 
                step="1"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>4x4</span>
                <span>20x20</span>
              </div>
              <p className="text-xs text-amber-500/80 mt-2 flex items-center gap-1">
                <AlertCircle size={12} />
                Alterar o tamanho limpa os obstáculos.
              </p>
            </div>
          </div>

          {/* Options/Labels */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Type size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Visualização</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Exibir Legenda</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Color Configuration */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <div className="flex items-center gap-2 mb-4 text-pink-400">
                <Palette size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Cores</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-400">Cor 1</label>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                      <input 
                          type="color" 
                          value={color1}
                          onChange={(e) => setColor1(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-none outline-none"
                      />
                      <span className="text-xs text-slate-500 font-mono uppercase">{color1}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-400">Cor 2</label>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                      <input 
                          type="color" 
                          value={color2}
                          onChange={(e) => setColor2(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-none outline-none"
                      />
                      <span className="text-xs text-slate-500 font-mono uppercase">{color2}</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Controls Guide */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Controles</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Move3d size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200">Botão Direito</span>
                  <span className="text-xs text-slate-400">Girar câmera</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <Layers size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200">Botão Esquerdo</span>
                  <span className="text-xs text-slate-400">Selecionar Área / Posicionar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT Sidebar Menu (Agents) */}
      <div 
        className={`
          pointer-events-auto absolute top-0 right-0 h-full w-80 
          bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl
          transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto
          ${isRightMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-6 pt-20 flex flex-col gap-8">
           {/* Header */}
           <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Users className="text-indigo-500" />
              Agentes
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Selecione um agente e clique no tabuleiro para posicioná-lo.
            </p>
          </div>

          {/* Stats */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
            <span className="text-slate-300 text-sm font-medium">Ativos no mapa</span>
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">{agentCount}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            {/* AGENT SELECTION BUTTON */}
            <button 
              onClick={() => onSelectAgentType(selectedAgentType === 'blue' ? null : 'blue')}
              className={`
                group relative w-full p-4 rounded-xl flex items-center gap-4 transition-all 
                border
                ${selectedAgentType === 'blue' 
                  ? 'bg-slate-700 border-green-500 ring-2 ring-green-500/50 shadow-lg shadow-green-500/20' 
                  : 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-blue-500/50'
                }
              `}
            >
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-inner">
                <Bot size={24} />
              </div>
              <div className="flex flex-col items-start">
                <span className={`font-bold text-sm transition-colors ${selectedAgentType === 'blue' ? 'text-green-400' : 'text-white group-hover:text-blue-400'}`}>
                  Agente Azul
                </span>
                <span className="text-slate-400 text-xs">
                  {selectedAgentType === 'blue' ? 'Clique no tabuleiro...' : 'Selecionar para posicionar'}
                </span>
              </div>
              <div className={`absolute right-4 transition-opacity ${selectedAgentType === 'blue' ? 'opacity-100 text-green-400' : 'opacity-0 group-hover:opacity-100 text-blue-400'}`}>
                {selectedAgentType === 'blue' ? <MousePointerClick size={20} /> : <PlusSquare size={20} />}
              </div>
            </button>

             <button 
              onClick={onClearAgents}
              disabled={agentCount === 0}
              className="w-full p-3 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Remover Todos
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-auto bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
            <p className="text-blue-200/60 text-xs italic">
              "Selecione o agente no menu para ativar o modo de posicionamento, depois clique em um espaço vazio."
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};