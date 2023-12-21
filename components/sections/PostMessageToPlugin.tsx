'use client';

import { useEffect } from 'react';

//@ts-ignore
function PostMessageToPlugin({ session, subscription }) {
  useEffect(() => {
    window.postMessage(
      { type: 'classway', text: JSON.stringify(session) },
      window.location.origin
    );
  }, [session]);
  useEffect(() => {
    window.postMessage(
      { type: 'subscription', text: JSON.stringify(subscription) },
      window.location.origin
    );
  }, [subscription]);

  return null;
}

export default PostMessageToPlugin;
