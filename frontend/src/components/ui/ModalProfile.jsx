// src/components/ui/ModalProfile.jsx
import { useState } from 'react';
import Button from './Button';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import styles from './ModalProfile.module.css';

export default function ModalProfile({ onClose }) {
  const { user, updateUser } = useAuth();

  const [pseudo, setPseudo]                 = useState(user?.pseudo ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword]             = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors]                 = useState({});
  const [saving, setSaving]                 = useState(false);
  const [successMsg, setSuccessMsg]         = useState('');

  const wantsPasswordChange = password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');
    setSaving(true);

    const payload = { pseudo };
    if (wantsPasswordChange) {
      payload.current_password      = currentPassword;
      payload.password              = password;
      payload.password_confirmation = passwordConfirmation;
    }

    try {
      const { data } = await api.put('/auth/me', payload);
      updateUser(data);
      setSuccessMsg('Profil mis à jour.');
      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: ['Une erreur est survenue. Réessaie.'] });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <div className={styles.modalTitle}>👤 Mon profil</div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            {errors.general && (
              <div className={styles.errorBox}>{errors.general[0]}</div>
            )}
            {successMsg && (
              <div className={styles.successBox}>{successMsg}</div>
            )}

            <label className={styles.label}>Pseudo</label>
            <input
              className={styles.input}
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
            />
            {errors.pseudo && <div className={styles.fieldError}>{errors.pseudo[0]}</div>}

            <div className={styles.divider}>Changer le mot de passe (optionnel)</div>

            <label className={styles.label}>Mot de passe actuel</label>
            <input
              className={styles.input}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
            {errors.current_password && (
              <div className={styles.fieldError}>{errors.current_password[0]}</div>
            )}

            <label className={styles.label}>Nouveau mot de passe</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {errors.password && <div className={styles.fieldError}>{errors.password[0]}</div>}

            <label className={styles.label}>Confirmer le nouveau mot de passe</label>
            <input
              className={styles.input}
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.modalFooter}>
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Fermer
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}