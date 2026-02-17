import { useState } from 'react';

export default function NoteForm({ onSubmit }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add an internal note..."
        rows={3}
        required
      />
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Note'}
      </button>
    </form>
  );
}
