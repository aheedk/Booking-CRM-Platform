import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/services/${serviceId}`)
      .then((res) => setService(res.data))
      .catch(() => setError('Service not found'));
  }, [serviceId]);

  useEffect(() => {
    if (date && serviceId) {
      setSlots([]);
      setSelectedSlot(null);
      api.get(`/appointments/availability?serviceId=${serviceId}&date=${date}`)
        .then((res) => setSlots(res.data))
        .catch(() => setError('Failed to load availability'));
    }
  }, [date, serviceId]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setError('');
    setLoading(true);
    try {
      await api.post('/appointments', {
        serviceId,
        startTime: selectedSlot.startTime,
        notes: notes || undefined,
      });
      navigate('/my-appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  // Minimum date is today
  const today = new Date().toISOString().split('T')[0];

  if (!service) return <div className="loading">Loading...</div>;

  return (
    <div className="booking-page">
      <h2>Book: {service.name}</h2>
      <p>{service.description}</p>
      <p>
        <strong>{service.duration} min</strong> — <strong>${Number(service.price).toFixed(2)}</strong>
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label>Select Date</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {date && (
        <div className="slots-section">
          <h3>Available Time Slots</h3>
          {slots.length === 0 ? (
            <p>No available slots for this date.</p>
          ) : (
            <div className="slots-grid">
              {slots.map((slot) => {
                const time = new Date(slot.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const isSelected = selectedSlot?.startTime === slot.startTime;
                return (
                  <button
                    key={slot.startTime}
                    className={`slot-btn ${isSelected ? 'slot-selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedSlot && (
        <div className="booking-confirm">
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any special requests..."
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleBook}
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      )}
    </div>
  );
}
