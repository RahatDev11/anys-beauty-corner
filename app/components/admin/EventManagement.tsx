
'use client';

import React, { useState, useEffect } from 'react';
import { database, ref, onValue, set, push, remove } from '@/lib/firebase';

interface Event {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
}

const EventManagement = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [eventId, setEventId] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventImageUrl, setEventImageUrl] = useState('');
    const [eventIsActive, setEventIsActive] = useState(false);

    useEffect(() => {
        const eventsRef = ref(database, 'events/');
        onValue(eventsRef, (snapshot) => {
            if (snapshot.exists()) {
                const eventsData = Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] }));
                setEvents(eventsData);
            } else {
                setEvents([]);
            }
        });
    }, []);

    const resetForm = () => {
        setEventId('');
        setEventTitle('');
        setEventDescription('');
        setEventImageUrl('');
        setEventIsActive(false);
    };

    const handleEdit = (event: Event) => {
        setEventId(event.id);
        setEventTitle(event.title);
        setEventDescription(event.description);
        setEventImageUrl(event.imageUrl);
        setEventIsActive(event.isActive);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            remove(ref(database, `events/${id}`));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const eventData = {
            title: eventTitle,
            description: eventDescription,
            imageUrl: eventImageUrl,
            isActive: eventIsActive,
        };

        if (eventId) {
            set(ref(database, `events/${eventId}`), eventData);
        } else {
            push(ref(database, 'events'), eventData);
        }
        resetForm();
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4 text-lipstick-dark">Event Banner Management</h2>
            <form onSubmit={handleSubmit} className="mb-6 border-b pb-6">
                <p className="text-center text-sm text-gray-500 mb-4">Providing any one piece of information will post the banner.</p>
                <div className="mb-4">
                    <label htmlFor="eventTitle" className="block text-gray-700">Title (Optional)</label>
                    <input type="text" id="eventTitle" className="w-full p-2 border rounded" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label htmlFor="eventDescription" className="block text-gray-700">Description (Optional)</label>
                    <textarea id="eventDescription" className="w-full p-2 border rounded" rows={2} value={eventDescription} onChange={(e) => setEventDescription(e.target.value)}></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="eventImageUrl" className="block text-gray-700">Image URL (Optional)</label>
                    <input type="text" id="eventImageUrl" className="w-full p-2 border rounded" placeholder="https://example.com/image.jpg" value={eventImageUrl} onChange={(e) => setEventImageUrl(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="flex items-center">
                        <input type="checkbox" id="eventIsActive" className="form-checkbox h-5 w-5 text-lipstick-dark" checked={eventIsActive} onChange={(e) => setEventIsActive(e.target.checked)} />
                        <span className="ml-2 text-gray-700">Show on homepage</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">A maximum of 3 banners can be shown on the homepage.</p>
                </div>
                <button type="submit" className="bg-lipstick-dark text-white px-4 py-2 rounded hover:bg-opacity-90">Save Banner</button>
                <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90">Reset Form</button>
            </form>
            <h3 className="text-lg font-bold mb-2 text-lipstick-dark">All Banners</h3>
            <div className="space-y-2">
                {events.map(event => (
                    <div key={event.id} className="flex justify-between items-center p-2 border-b">
                        <span>{event.title}</span>
                        <div>
                            <button onClick={() => handleEdit(event)} className="text-blue-500 hover:underline mr-4">Edit</button>
                            <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventManagement;
