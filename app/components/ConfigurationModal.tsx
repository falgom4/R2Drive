import { useState } from 'react';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl?: string;
  }) => void;
}

export default function ConfigurationModal({ isOpen, onClose, onSave }: ConfigurationModalProps) {
  const [config, setConfig] = useState({
    accountId: '',
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: '',
    publicUrl: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Configuración de R2Drive</h2>
        <p className="text-gray-600 mb-4">
          Por favor, ingresa tus credenciales de Cloudflare R2 para continuar.
        </p>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(config);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account ID
              </label>
              <input
                type="text"
                value={config.accountId}
                onChange={(e) => setConfig({ ...config, accountId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Access Key ID
              </label>
              <input
                type="text"
                value={config.accessKeyId}
                onChange={(e) => setConfig({ ...config, accessKeyId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Secret Access Key
              </label>
              <input
                type="password"
                value={config.secretAccessKey}
                onChange={(e) => setConfig({ ...config, secretAccessKey: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bucket Name
              </label>
              <input
                type="text"
                value={config.bucketName}
                onChange={(e) => setConfig({ ...config, bucketName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Public URL (opcional)
              </label>
              <input
                type="text"
                value={config.publicUrl}
                onChange={(e) => setConfig({ ...config, publicUrl: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 