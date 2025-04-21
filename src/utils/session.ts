
// Utility to manage browser session IDs
const SESSION_ID_KEY = 'corporify_session_id';

export const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
};
