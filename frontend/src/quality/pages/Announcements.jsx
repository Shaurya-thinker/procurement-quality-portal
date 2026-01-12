import { useEffect, useState } from 'react';
import { useAnnouncements } from '../context/AnnouncementsContext';

function Card({ children }) {
  return (
    <div style={{border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'}}>
      {children}
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        maxWidth: 600,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <button 
          onClick={onClose}
          style={{
            float: 'right',
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

export default function Announcements() {
  const { events, trainings, meetings, announcements, loading, error, createEvent, createTraining, createMeeting } = useAnnouncements();
  const role = localStorage.getItem('role');

  const [showCreate, setShowCreate] = useState(false);
  const [formType, setFormType] = useState('Event');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    event_date: '', 
    location: '',
    agenda: '',
    organizer: '',
    training_name: '', 
    start_date: '', 
    end_date: '', 
    trainer_name: '',
    meeting_title: '', 
    meeting_date: '', 
    meeting_time: '', 
    meeting_link: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => setFormData({ 
    title: '', 
    description: '', 
    event_date: '', 
    location: '',
    agenda: '',
    organizer: '',
    training_name: '', 
    start_date: '', 
    end_date: '', 
    trainer_name: '',
    meeting_title: '', 
    meeting_date: '', 
    meeting_time: '', 
    meeting_link: '' 
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (formType === 'Event') {
        await createEvent({ 
          title: formData.title, 
          description: formData.description, 
          event_date: formData.event_date,
          location: formData.location,
          agenda: formData.agenda,
          organizer: formData.organizer
        });
      } else if (formType === 'Training') {
        await createTraining({ 
          training_name: formData.training_name, 
          start_date: formData.start_date, 
          end_date: formData.end_date, 
          description: formData.description,
          location: formData.location,
          trainer_name: formData.trainer_name,
          agenda: formData.agenda
        });
      } else {
        await createMeeting({ 
          meeting_title: formData.meeting_title, 
          meeting_date: formData.meeting_date, 
          meeting_time: formData.meeting_time, 
          meeting_link: formData.meeting_link,
          location: formData.location,
          agenda: formData.agenda,
          organizer: formData.organizer
        });
      }
      resetForm();
      setShowCreate(false);
    } catch (err) {
      console.error('Create failed', err);
      alert('Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5);
  };

  return (
    <div style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
        <h2 style={{margin: 0}}>Announcements</h2>
        {role === 'quality' && (
          <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
            <button 
              onClick={() => { setShowCreate(!showCreate); setFormType('Event'); resetForm(); }}
              style={{
                padding: '10px 16px',
                backgroundColor: '#2955a4',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500
              }}
            >
              ➕ New Event
            </button>
            <button 
              onClick={() => { setShowCreate(!showCreate); setFormType('Training'); resetForm(); }}
              style={{
                padding: '10px 16px',
                backgroundColor: '#184787',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500
              }}
            >
              📚 New Training
            </button>
            <button 
              onClick={() => { setShowCreate(!showCreate); setFormType('Meeting'); resetForm(); }}
              style={{
                padding: '10px 16px',
                backgroundColor: '#203864',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500
              }}
            >
              📅 New Meeting
            </button>
          </div>
        )}
      </div>

      {showCreate && (
        <Card>
          <form onSubmit={handleCreate} style={{display: 'grid', gap: 8}}>
            <div style={{display:'flex', gap:8}}>
              <strong>{formType} Details</strong>
            </div>
            {formType === 'Event' && (
              <>
                <input 
                  placeholder="Event Title" 
                  value={formData.title} 
                  onChange={e=>setFormData({...formData, title:e.target.value})} 
                  required 
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  type="date" 
                  value={formData.event_date} 
                  onChange={e=>setFormData({...formData, event_date:e.target.value})} 
                  required 
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  placeholder="Location" 
                  value={formData.location} 
                  onChange={e=>setFormData({...formData, location:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  placeholder="Organizer" 
                  value={formData.organizer} 
                  onChange={e=>setFormData({...formData, organizer:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <textarea 
                  placeholder="Description" 
                  value={formData.description} 
                  onChange={e=>setFormData({...formData, description:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4, minHeight: 80}}
                />
                <textarea 
                  placeholder="Agenda/Details" 
                  value={formData.agenda} 
                  onChange={e=>setFormData({...formData, agenda:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4, minHeight: 80}}
                />
              </>
            )}
            {formType === 'Training' && (
              <>
                <input 
                  placeholder="Training Name" 
                  value={formData.training_name} 
                  onChange={e=>setFormData({...formData, training_name:e.target.value})} 
                  required 
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  type="date" 
                  value={formData.start_date} 
                  onChange={e=>setFormData({...formData, start_date:e.target.value})} 
                  required 
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  type="date" 
                  value={formData.end_date} 
                  onChange={e=>setFormData({...formData, end_date:e.target.value})} 
                  required 
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  placeholder="Location" 
                  value={formData.location} 
                  onChange={e=>setFormData({...formData, location:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  placeholder="Trainer Name" 
                  value={formData.trainer_name} 
                  onChange={e=>setFormData({...formData, trainer_name:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <textarea 
                  placeholder="Description" 
                  value={formData.description} 
                  onChange={e=>setFormData({...formData, description:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4, minHeight: 80}}
                />
                <textarea 
                  placeholder="Agenda/Topics" 
                  value={formData.agenda} 
                  onChange={e=>setFormData({...formData, agenda:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4, minHeight: 80}}
                />
              </>
            )}
            {formType === 'Meeting' && (
              <>
                <input 
                  placeholder="Meeting Title" 
                  value={formData.meeting_title} 
                  onChange={e=>setFormData({...formData, meeting_title:e.target.value})} 
                  required 
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  type="date" 
                  value={formData.meeting_date} 
                  onChange={e=>setFormData({...formData, meeting_date:e.target.value})} 
                  required 
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  type="time" 
                  value={formData.meeting_time} 
                  onChange={e=>setFormData({...formData, meeting_time:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  placeholder="Location" 
                  value={formData.location} 
                  onChange={e=>setFormData({...formData, location:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  placeholder="Meeting Link (optional)" 
                  value={formData.meeting_link} 
                  onChange={e=>setFormData({...formData, meeting_link:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <input 
                  placeholder="Organizer" 
                  value={formData.organizer} 
                  onChange={e=>setFormData({...formData, organizer:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4}}
                />
                <textarea 
                  placeholder="Agenda/Topics to discuss" 
                  value={formData.agenda} 
                  onChange={e=>setFormData({...formData, agenda:e.target.value})}
                  style={{padding: '8px', border: '1px solid #d1d5db', borderRadius: 4, minHeight: 80}}
                />
              </>
            )}
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button 
                type="submit" 
                disabled={submitting}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1
                }}
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowCreate(false); resetForm(); }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {loading && <p style={{textAlign: 'center', color: '#6b7280'}}>Loading announcements...</p>}
      {error && <p style={{textAlign: 'center', color: '#ef4444'}}>Error: {error}</p>}

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 16}}>
        {announcements.map((a) => (
          <Card key={`${a.type}-${a.id}`}>
            <div 
              onClick={() => setSelectedAnnouncement(a)}
              style={{cursor: 'pointer'}}
            >
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', gap: 8}}>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 700, fontSize: 16, marginBottom: 4}}>
                    {a.type === 'Event' ? '📅 ' : a.type === 'Training' ? '📚 ' : '📞 '}
                    {a.title || a.training_name || a.meeting_title}
                  </div>
                  <div style={{fontSize:13, color:'#6b7280', marginBottom: 8}}>
                    {a.type} • {formatDate(a.date)}
                  </div>
                  {a.location && (
                    <div style={{fontSize: 12, color: '#059669', marginBottom: 4}}>
                      📍 {a.location}
                    </div>
                  )}
                  {(a.organizer || a.trainer_name) && (
                    <div style={{fontSize: 12, color: '#6366f1', marginBottom: 4}}>
                      👤 {a.organizer || a.trainer_name}
                    </div>
                  )}
                  {a.meeting_time && (
                    <div style={{fontSize: 12, color: '#7c3aed', marginBottom: 4}}>
                      🕐 {formatTime(a.meeting_time)}
                    </div>
                  )}
                </div>
              </div>
              <div style={{marginTop: 8, fontSize: 13, color: '#6b7280', lineHeight: 1.5}}>
                {a.description && a.description.substring(0, 100)}
                {a.description && a.description.length > 100 ? '...' : ''}
              </div>
              <div style={{marginTop: 8, color: '#2563eb', fontSize: 12, fontWeight: 500}}>
                → View Details
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)}>
        {selectedAnnouncement && (
          <div>
            <div style={{fontSize: 22, fontWeight: 700, marginBottom: 16}}>
              {selectedAnnouncement.type === 'Event' ? '📅 ' : selectedAnnouncement.type === 'Training' ? '📚 ' : '📞 '}
              {selectedAnnouncement.title || selectedAnnouncement.training_name || selectedAnnouncement.meeting_title}
            </div>
            
            <div style={{display: 'grid', gap: 12, marginBottom: 16}}>
              <div>
                <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>TYPE</div>
                <div style={{fontSize: 14}}>{selectedAnnouncement.type}</div>
              </div>

              {selectedAnnouncement.type === 'Event' && (
                <>
                  <div>
                    <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>DATE</div>
                    <div style={{fontSize: 14}}>{formatDate(selectedAnnouncement.event_date)}</div>
                  </div>
                  {selectedAnnouncement.location && (
                    <div>
                      <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>LOCATION</div>
                      <div style={{fontSize: 14}}>{selectedAnnouncement.location}</div>
                    </div>
                  )}
                  {selectedAnnouncement.organizer && (
                    <div>
                      <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>ORGANIZER</div>
                      <div style={{fontSize: 14}}>{selectedAnnouncement.organizer}</div>
                    </div>
                  )}
                </>
              )}

              {selectedAnnouncement.type === 'Training' && (
                <>
                  <div>
                    <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>DATES</div>
                    <div style={{fontSize: 14}}>{formatDate(selectedAnnouncement.start_date)} to {formatDate(selectedAnnouncement.end_date)}</div>
                  </div>
                  {selectedAnnouncement.location && (
                    <div>
                      <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>LOCATION</div>
                      <div style={{fontSize: 14}}>{selectedAnnouncement.location}</div>
                    </div>
                  )}
                  {selectedAnnouncement.trainer_name && (
                    <div>
                      <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>TRAINER</div>
                      <div style={{fontSize: 14}}>{selectedAnnouncement.trainer_name}</div>
                    </div>
                  )}
                </>
              )}

              {selectedAnnouncement.type === 'Meeting' && (
                <>
                  <div>
                    <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>DATE & TIME</div>
                    <div style={{fontSize: 14}}>{formatDate(selectedAnnouncement.meeting_date)} at {formatTime(selectedAnnouncement.meeting_time) || 'TBD'}</div>
                  </div>
                  {selectedAnnouncement.location && (
                    <div>
                      <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>LOCATION</div>
                      <div style={{fontSize: 14}}>{selectedAnnouncement.location}</div>
                    </div>
                  )}
                  {selectedAnnouncement.meeting_link && (
                    <div>
                      <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>MEETING LINK</div>
                      <a href={selectedAnnouncement.meeting_link} target="_blank" rel="noopener noreferrer" style={{fontSize: 14, color: '#2563eb'}}>
                        {selectedAnnouncement.meeting_link}
                      </a>
                    </div>
                  )}
                  {selectedAnnouncement.organizer && (
                    <div>
                      <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>ORGANIZER</div>
                      <div style={{fontSize: 14}}>{selectedAnnouncement.organizer}</div>
                    </div>
                  )}
                </>
              )}

              {selectedAnnouncement.description && (
                <div>
                  <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>DESCRIPTION</div>
                  <div style={{fontSize: 14, whiteSpace: 'pre-wrap'}}>{selectedAnnouncement.description}</div>
                </div>
              )}

              {selectedAnnouncement.agenda && (
                <div>
                  <div style={{fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4}}>AGENDA / DETAILS</div>
                  <div style={{fontSize: 14, whiteSpace: 'pre-wrap'}}>{selectedAnnouncement.agenda}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
