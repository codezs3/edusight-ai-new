'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GoogleDriveCallback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage('Authentication was cancelled or failed.');
      return;
    }

    if (code) {
      exchangeCodeForTokens(code);
    } else {
      setStatus('error');
      setMessage('No authorization code received.');
    }
  }, [searchParams]);

  const exchangeCodeForTokens = async (code: string) => {
    try {
      const response = await fetch('/api/admin/maintenance/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens in localStorage (in production, consider more secure storage)
        localStorage.setItem('googleDriveRefreshToken', data.refreshToken);
        localStorage.setItem('googleDriveAccessToken', data.accessToken);
        
        setStatus('success');
        setMessage('Google Drive authentication successful! You can now close this window.');
        
        // Send message to parent window
        window.opener?.postMessage(
          {
            type: 'GOOGLE_DRIVE_AUTH_SUCCESS',
            refreshToken: data.refreshToken,
            accessToken: data.accessToken,
          },
          window.location.origin
        );

        // Close window after 3 seconds
        setTimeout(() => {
          window.close();
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Authentication failed.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error during authentication.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
            <p className="text-gray-600">Please wait while we complete the authentication process.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-900 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => window.close()}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  );
}
