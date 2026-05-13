/**
 * MicrophoneSelector Component
 * Seletor de dispositivo de microfone
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ChevronDown, Check } from "lucide-react";
import { useAppStore } from "../store/appStore";

export default function MicrophoneSelector() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { selectedMicrophoneId, setSelectedMicrophoneId } = useAppStore();

  // Carregar dispositivos de áudio disponíveis
  useEffect(() => {
    loadDevices();

    // Recarregar quando dispositivos mudarem
    navigator.mediaDevices.addEventListener("devicechange", loadDevices);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", loadDevices);
    };
  }, []);

  const loadDevices = async () => {
    try {
      // Solicitar permissão primeiro
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Listar dispositivos
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices.filter(
        (device) => device.kind === "audioinput",
      );

      setDevices(audioInputs);

      // Se não há dispositivo selecionado, selecionar o padrão
      if (!selectedMicrophoneId && audioInputs.length > 0) {
        const defaultDevice =
          audioInputs.find((d) => d.deviceId === "default") || audioInputs[0];
        setSelectedMicrophoneId(defaultDevice.deviceId);
      }

      console.log("🎤 Microfones disponíveis:", audioInputs.length);
    } catch (error) {
      console.error("❌ Erro ao listar microfones:", error);
    }
  };

  const handleSelectDevice = (deviceId: string) => {
    setSelectedMicrophoneId(deviceId);
    setIsOpen(false);
    console.log("🎤 Microfone selecionado:", deviceId);
  };

  const selectedDevice = devices.find(
    (d) => d.deviceId === selectedMicrophoneId,
  );

  return (
    <div className="relative">
      {/* Botão principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-light/80 border border-primary/30 rounded-lg hover:bg-dark-light hover:border-primary/50 transition-all"
      >
        <Mic size={16} className="text-primary" />
        <span className="text-sm text-gray-300 max-w-[150px] truncate">
          {selectedDevice?.label || "Microfone Padrão"}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 w-80 bg-dark/95 backdrop-blur-md border border-primary/30 rounded-lg shadow-2xl overflow-hidden z-50"
            >
              <div className="px-3 py-2 border-b border-primary/20">
                <p className="text-xs font-semibold text-primary">
                  Selecione o Microfone
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {devices.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-400">
                      Nenhum microfone encontrado
                    </p>
                  </div>
                ) : (
                  devices.map((device) => (
                    <button
                      key={device.deviceId}
                      onClick={() => handleSelectDevice(device.deviceId)}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-primary/10 transition-colors ${
                        device.deviceId === selectedMicrophoneId
                          ? "bg-primary/20"
                          : ""
                      }`}
                    >
                      <Mic
                        size={16}
                        className={
                          device.deviceId === selectedMicrophoneId
                            ? "text-primary"
                            : "text-gray-400"
                        }
                      />
                      <span className="flex-1 text-left text-sm text-gray-300 truncate">
                        {device.label ||
                          `Microfone ${device.deviceId.slice(0, 8)}`}
                      </span>
                      {device.deviceId === selectedMicrophoneId && (
                        <Check size={16} className="text-primary" />
                      )}
                    </button>
                  ))
                )}
              </div>

              <div className="px-3 py-2 border-t border-primary/20 bg-dark-light/50">
                <p className="text-xs text-gray-500">
                  {devices.length}{" "}
                  {devices.length === 1 ? "dispositivo" : "dispositivos"}{" "}
                  encontrado{devices.length === 1 ? "" : "s"}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
