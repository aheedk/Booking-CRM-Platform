import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import NoteForm from '../components/NoteForm';
import api from '../api/axios';
import { useState } from 'react';

export default function ClientDetailPage() {
  const { id } = useParams();
  const { data: client, loading, error } = useFetch(`/clients/${id}`);
  const { data: notes, setData: setNotes } = useFetch(`/clients/${id}/notes`);
  const [noteError, setNoteError] = useState('');

  const handleAddNote = async (content) => {
    setNoteError('');
    try {
      const res = await api.post(`/clients/${id}/notes`, { content });
      setNotes([res.data, ...(notes || [])]);
    } catch (err) {
      setNoteError(err.response?.data?.message || 'Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/clients/${id}/notes/${noteId}`);
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!client) return null;

  return (
    <div className="client-detail-page">
      <h2>{client.first_name} {client.last_name}</h2>
      <div className="client-info">
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Phone:</strong> {client.phone || '—'}</p>
        <p><strong>Joined:</strong> {new Date(client.created_at).toLocaleDateString()}</p>
      </div>

      <h3>Appointment History</h3>
      {client.appointments?.length === 0 ? (
        <p>No appointments.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Service</th>
              <th>Status</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {client.appointments.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.start_time).toLocaleString()}</td>
                <td>{a.service_name}</td>
                <td>
                  <span className={`status status-${a.status}`}>{a.status}</span>
                </td>
                <td>${Number(a.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Internal Notes</h3>
      {noteError && <div className="alert alert-error">{noteError}</div>}
      <NoteForm onSubmit={handleAddNote} />
      <div className="notes-list">
        {notes?.map((note) => (
          <div key={note.id} className="note-card">
            <p>{note.content}</p>
            <div className="note-meta">
              <span>
                By {note.author_first_name} {note.author_last_name} —{' '}
                {new Date(note.created_at).toLocaleString()}
              </span>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="btn btn-sm btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {notes?.length === 0 && <p>No notes yet.</p>}
      </div>
    </div>
  );
}
