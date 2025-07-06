import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadScanResults } from '../api/results';

interface UploadScanModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadScanModal({ open, onClose }: UploadScanModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: uploadScanResults,
    onSuccess: () => {
      toast.success('Scan results uploaded successfully', { autoClose: 1500 });
      queryClient.invalidateQueries({ queryKey: ['scanResults'] });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await mutateAsync(formData);
      handleClose();
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">Upload New Scan</h2>
          <div className="flex flex-col gap-4 mb-4">
            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) setFile(files[0]);
              }}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
