import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSession } from '../../lib/session';

/**
 * Gerbang sesi untuk alur laporan. Tanpa sesi, pengunjung dikirim ke layar
 * masuk sambil membawa tujuan asalnya, sehingga setelah masuk ia kembali ke
 * halaman yang tadi dibuka.
 */
export const RequireSession: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  if (!getSession()) {
    return (
      <Navigate
        to="/masuk"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  return children;
};
