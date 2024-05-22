"use client"
import { Draggable, DropArg } from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Calendar from '@/components/calendar/Calendar'


interface Event {
    title: string;
    start: Date | string;
    allDay: boolean;
    id: number;
    description?: string
}

export default function Home() {

    const [allEvents, setAllEvents] = useState<Event[]>([{ title: 'event 1',description: "everythying is good", start : new Date() ,allDay : true, id : 1 },])
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idToDelete, setIdToDelete] = useState<number | null>(null)
    const [newEvent, setNewEvent] = useState<Event>({
        title: '',
        start: '',
        allDay: false,
        id: 0
    })

    useEffect(() => {
        let draggableEl = document.getElementById('draggable-el')
        if (draggableEl) {
            new Draggable(draggableEl, {
                itemSelector: ".fc-event",
                eventData: function (eventEl) {
                    let title = eventEl.getAttribute("title")
                    let id = eventEl.getAttribute("data")
                    let start = eventEl.getAttribute("start")
                    return { title, id, start }
                }
            })
        }
    }, [])

    function handleDateClick(arg: { date: Date, allDay: boolean }) {
        setNewEvent({ ...newEvent, start: arg.date, allDay: arg.allDay, id: new Date().getTime() })
        setShowModal(true)
    }

    function addEvent(data: DropArg) {
        const event = { ...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime() }
        setAllEvents([...allEvents, event])
    }

    function handleDeleteModal(data: { event: { id: string } }) {
        setShowDeleteModal(true)
        setIdToDelete(Number(data.event.id))
    }

    function handleDelete() {
        setAllEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)))
        setShowDeleteModal(false)
        setIdToDelete(null)
    }

    function handleCloseModal() {
        setShowModal(false)
        setNewEvent({
            title: '',
            start: '',
            allDay: false,
            id: 0
        })
        setShowDeleteModal(false)
        setIdToDelete(null)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewEvent({
            ...newEvent,
            title: e.target.value
        })
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setAllEvents([...allEvents, newEvent])
        setShowModal(false)
        setNewEvent({
            title: '',
            start: '',
            allDay: false,
            id: 0
        })
    }

    return (
        <div className="flex h-full">
            <Sidebar active="Calendar" />
            <div className="container main">
                <nav className="flex justify-between mb-6 border-b border-violet-100 p-4">
                    <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
                </nav>

                <div>
                    <div className="col-span-8">


                    </div>

                </div>


            </div>
        </div>
    )
}
