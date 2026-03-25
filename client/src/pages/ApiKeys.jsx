import { useEffect, useState } from 'react';
import { Copy, Key, Plus, RefreshCw, Trash2, Upload } from 'lucide-react';
import { Badge, Button, Card, Input } from '../components/ui';
import toast from 'react-hot-toast';
import api from '../services/api';

function formatDate(value) {
  if (!value) return 'Never';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Never';
  return date.toLocaleString();
}

export default function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [name, setName] = useState('');
  const [importName, setImportName] = useState('');
  const [importKey, setImportKey] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState('');

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api-keys');
      setKeys(res.data.keys || []);
    } catch (err) {
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, message = 'Copied to clipboard') => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleCreateKey = async () => {
    try {
      const resolvedName = name.trim() || `API Key ${new Date().toISOString()}`;
      const res = await api.post('/api-keys', {
        name: resolvedName,
        scopes: ['usage:write']
      });

      if (res.data.apiKey) {
        setNewlyCreatedKey(res.data.apiKey);
        setName('');
        setShowCreateForm(false);
        toast.success('API key created');
        loadKeys();
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create API key');
    }
  };

  const handleImportKey = async () => {
    const trimmedKey = importKey.trim();
    if (!trimmedKey) {
      toast.error('Enter an API key to import');
      return;
    }

    try {
      const resolvedName = importName.trim() || `Imported Key ${new Date().toISOString()}`;
      await api.post('/api-keys', {
        name: resolvedName,
        scopes: ['usage:write'],
        apiKey: trimmedKey
      });

      setImportName('');
      setImportKey('');
      setShowImportForm(false);
      toast.success('Existing API key imported');
      loadKeys();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to import API key');
    }
  };

  const handleRevoke = async (id) => {
    if (!id) return;
    try {
      await api.post(`/api-keys/${id}/revoke`);
      toast.success('API key revoked');
      loadKeys();
    } catch (err) {
      toast.error('Failed to revoke API key');
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowImportForm((prev) => !prev)}
          >
            <Upload className="h-4 w-4" />
            Import Existing Key
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowCreateForm((prev) => !prev)}
          >
            <Plus className="h-4 w-4" />
            Create API Key
          </Button>
        </div>
      </div>

      {newlyCreatedKey && (
        <Card className="border border-green-200 bg-green-50">
          <h3 className="mb-2 text-lg font-semibold text-green-800">Copy this key now</h3>
          <p className="mb-4 text-sm text-green-700">
            This is shown once. Store it securely in your SaaS environment variables.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="max-w-full overflow-auto rounded bg-white px-3 py-2 text-sm text-gray-900">
              {newlyCreatedKey}
            </code>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => copyToClipboard(newlyCreatedKey, 'API key copied')}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="secondary" onClick={() => setNewlyCreatedKey('')}>
              Hide
            </Button>
          </div>
        </Card>
      )}

      {showCreateForm && (
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold">Create New API Key</h3>
          <Input
            label="Key name"
            placeholder="Production API Key"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleCreateKey}>Generate Key</Button>
            <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {showImportForm && (
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold">Import Existing API Key</h3>
          <Input
            label="Key name"
            placeholder="My SaaS Key"
            value={importName}
            onChange={(e) => setImportName(e.target.value)}
          />
          <Input
            label="API key"
            placeholder="Paste key (for example ck_...)"
            value={importKey}
            onChange={(e) => setImportKey(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            The key is hashed on the server and not returned in full after import.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleImportKey}>Import Key</Button>
            <Button variant="secondary" onClick={() => setShowImportForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {keys.map((key) => {
          const id = key._id || key.id;
          return (
            <Card key={id}>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{key.name}</p>
                      <p className="text-sm text-gray-500">{key.keyPrefix}***</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{(key.scopes || []).join(', ') || 'usage:write'}</Badge>
                    <span className="text-xs text-gray-500">Last used: {formatDate(key.lastUsedAt)}</span>
                    {key.revokedAt && <Badge variant="danger">Revoked</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(key.keyPrefix, 'Key prefix copied')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {!key.revokedAt && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRevoke(id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}
