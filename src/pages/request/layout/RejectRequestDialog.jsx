import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const RejectRequestDialog = ({ isOpen, onClose, request, onReject }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onReject(request.id, reason.trim());
      onClose();
      setReason('');
    } catch (error) {
      setError(error.message || 'Failed to reject request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason('');
      setError('');
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <CardTitle className="text-xl">Reject Request</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Request Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Requester:</span>
                <span className="text-sm font-semibold">{request.requester}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Seedling:</span>
                <span className="text-sm font-semibold">{request.seedlingType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span className="text-sm font-semibold">{request.quantity}</span>
              </div>
            </div>

            {/* Warning Message */}
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>⚠️ Note:</strong> The reserved quantity will be returned to inventory. The client will be notified of this rejection.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="reject-reason" className="text-base font-semibold mb-2 block">
                  Reason for Rejection <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reject-reason"
                  placeholder="Please provide a clear and professional reason for rejecting this request (minimum 10 characters)..."
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (error) setError('');
                  }}
                  className={`min-h-[120px] ${error ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                  maxLength={500}
                  required
                />
                <div className="flex justify-between mt-1">
                  {error ? (
                    <p className="text-red-500 text-xs">{error}</p>
                  ) : (
                    <p className="text-gray-500 text-xs">
                      This reason will be visible to the client (10-500 characters)
                    </p>
                  )}
                  <p className="text-gray-400 text-xs">
                    {reason.length}/500
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Reject Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RejectRequestDialog;
