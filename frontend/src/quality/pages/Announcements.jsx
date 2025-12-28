import React, { useEffect, useState } from 'react';
import { fetchEvents, fetchTrainings, fetchMeetings, createEvent, createTraining, createMeeting } from '../../api/announcements.api';

import React, { useState } from 'react';
import { useAnnouncements } from '../context/AnnouncementsContext';

function Card({ children }) {
  return (
    <div style={{border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'}}>
      {children}
    </div>
  );
}

export default function Announcements() {
  const { events, trainings, meetings, announcements, loading, error, createEvent, createTraining, createMeeting } = useAnnouncements();
  const role = localStorage.getItem('role');

  const [showCreate, setShowCreate] = useState(false);
  const [formType, setFormType] = useState('Event');
  const [formData, setFormData] = useState({ title: '', description: '', event_date: '', training_name: '', start_date: '', end_date: '', meeting_title: '', meeting_date: '', meeting_time: '', meeting_link: '' });
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => setFormData({ title: '', description: '', event_date: '', training_name: '', start_date: '', end_date: '', meeting_title: '', meeting_date: '', meeting_time: '', meeting_link: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (formType === 'Event') {
        await createEvent({ title: formData.title, description: formData.description, event_date: formData.event_date });
      } else if (formType === 'Training') {
        await createTraining({ training_name: formData.training_name, start_date: formData.start_date, end_date: formData.end_date, description: formData.description });
      } else {
        await createMeeting({ meeting_title: formData.meeting_title, meeting_date: formData.meeting_date, meeting_time: formData.meeting_time, meeting_link: formData.meeting_link });
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

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
        <h2>Announcements</h2>
        {role === 'quality' && (
          <div>
            <button onClick={() => { setShowCreate(!showCreate); setFormType('Event'); }} style={{marginRight:8}}>New Event</button>
            <button onClick={() => { setShowCreate(!showCreate); setFormType('Training'); }} style={{marginRight:8}}>New Training</button>
            <button onClick={() => { setShowCreate(!showCreate); setFormType('Meeting'); }}>New Meeting</button>
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
                <input placeholder="Title" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} required />
                <input type="date" value={formData.event_date} onChange={e=>setFormData({...formData, event_date:e.target.value})} required />
                <textarea placeholder="Description" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} />
              </>
            )}
            {formType === 'Training' && (
              <>
                <input placeholder="Training Name" value={formData.training_name} onChange={e=>setFormData({...formData, training_name:e.target.value})} required />
                <input type="date" value={formData.start_date} onChange={e=>setFormData({...formData, start_date:e.target.value})} required />
                <input type="date" value={formData.end_date} onChange={e=>setFormData({...formData, end_date:e.target.value})} required />
                <textarea placeholder="Description" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} />
              </>
            )}
            {formType === 'Meeting' && (
              <>
                <input placeholder="Meeting Title" value={formData.meeting_title} onChange={e=>setFormData({...formData, meeting_title:e.target.value})} required />
                <input type="date" value={formData.meeting_date} onChange={e=>setFormData({...formData, meeting_date:e.target.value})} required />
                <input type="time" value={formData.meeting_time} onChange={e=>setFormData({...formData, meeting_time:e.target.value})} />
                <input placeholder="Meeting Link" value={formData.meeting_link} onChange={e=>setFormData({...formData, meeting_link:e.target.value})} />
              </>
            )}
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </form>
        </Card>
      )}

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 12}}>
        {announcements.map((a) => (
          <Card key={`${a.type}-${a.id}`}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontWeight:700}}>{a.title || a.training_name || a.meeting_title}</div>
                <div style={{fontSize:13, color:'#6b7280'}}>{a.type} • {a.date}</div>
              </div>
            </div>
            <div style={{marginTop:8}}>{a.description || a.meeting_link || ''}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}


function EventForm({ onCreate }) {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreate({ title, event_date: date, description });
      setTitle(''); setDate(''); setDescription('');
    } catch (err) {
      console.error(err);
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={submit} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Event'}</button>
    </form>
  );
}


function TrainingForm({ onCreate }) {
  const [name, setName] = React.useState('');
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreate({ training_name: name, start_date: start, end_date: end, description });
      setName(''); setStart(''); setEnd(''); setDescription('');
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={submit} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
      <input placeholder="Training name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="date" value={start} onChange={e => setStart(e.target.value)} required />
      <input type="date" value={end} onChange={e => setEnd(e.target.value)} required />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Training'}</button>
    </form>
  );
}


function MeetingForm({ onCreate }) {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [link, setLink] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreate({ meeting_title: title, meeting_date: date, meeting_time: time || null, meeting_link: link || null });
      setTitle(''); setDate(''); setTime(''); setLink('');
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={submit} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="time" value={time} onChange={e => setTime(e.target.value)} />
      <input placeholder="Link" value={link} onChange={e => setLink(e.target.value)} />
      <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Meeting'}</button>
    </form>
  );
}
