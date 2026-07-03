import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
    placement: 'center',
    autoCloseMs: 0,
    actions: [],
  });
  const resolverRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const closeModal = useCallback((result) => {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  setModalState((current) => ({
    ...current,
    open: false,
  }));

  if (resolverRef.current) {
    resolverRef.current(result);
    resolverRef.current = null;
  }
}, []);

  const showModal = useCallback((options = {}) =>
    new Promise((resolve) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setModalState({
        open: true,
        title: options.title || 'Notice',
        message: options.message || '',
        type: options.type || 'info',
        placement: options.placement || 'center',
        autoCloseMs: options.autoCloseMs || 0,
        actions: Array.isArray(options.actions) ? options.actions : [],
      });
      resolverRef.current = resolve;
      if (options.autoCloseMs) {
        timerRef.current = setTimeout(() => closeModal({ dismissed: true }), options.autoCloseMs);
      }
    }), [closeModal]);

  return (
    <NotificationContext.Provider value={{ showModal, closeModal }}>
      {children}
      {modalState.open ? (
        <div style={modalState.placement === 'toast' ? toastWrapStyle : overlayStyle} role="presentation" onClick={modalState.placement === 'toast' ? undefined : () => closeModal({ dismissed: true })}>
          <div
            style={modalState.placement === 'toast' ? toastStyle(modalState.type) : dialogStyle(modalState.type)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-title"
            aria-describedby="notification-message"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="notification-title" style={titleStyle(modalState.type)}>
              {modalState.title}
            </h3>
            <p id="notification-message" style={messageStyle}>
              {modalState.message}
            </p>
            {modalState.actions.length > 0 ? (
              <div style={actionsStyle}>
                {modalState.actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="btn"
                    onClick={() => {
                      if (action.onClick) {
                        action.onClick();
                      }
                      closeModal({ action: action.value || action.label });
                    }}
                    style={action.style || {}}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            ) : modalState.placement === 'toast' ? null : (
              <button type="button" className="btn" onClick={() => closeModal({ dismissed: true })} style={{ alignSelf: 'flex-end' }}>
                OK
              </button>
            )}
          </div>
        </div>
      ) : null}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(9, 9, 11, 0.78)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
};

const toastWrapStyle = {
  position: 'fixed',
  right: '20px',
  bottom: '20px',
  zIndex: 1000,
  pointerEvents: 'none',
};

const dialogStyle = (type) => ({
  width: 'min(92vw, 460px)',
  background: '#111113',
  color: '#fafafa',
  borderRadius: '18px',
  border: `1px solid ${type === 'error' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(249, 115, 22, 0.25)'}`,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.55)',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
});

const toastStyle = (type) => ({
  width: 'min(92vw, 360px)',
  background: '#111113',
  color: '#fafafa',
  borderRadius: '16px',
  border: `1px solid ${type === 'error' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(249, 115, 22, 0.25)'}`,
  boxShadow: '0 18px 40px rgba(0, 0, 0, 0.45)',
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  pointerEvents: 'auto',
});

const titleStyle = (type) => ({
  margin: 0,
  fontSize: '1.35rem',
  color: type === 'error' ? '#f87171' : '#f97316',
});

const messageStyle = {
  margin: 0,
  color: '#d4d4d8',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
};

const actionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  flexWrap: 'wrap',
};
