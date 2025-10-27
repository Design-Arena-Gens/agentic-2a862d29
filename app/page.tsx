'use client'

import { useState } from 'react'

interface Appointment {
  id: string
  businessName: string
  phoneNumber: string
  preferredDate: string
  preferredTime: string
  purpose: string
  status: 'pending' | 'calling' | 'completed' | 'failed'
  transcript?: string
}

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [formData, setFormData] = useState({
    businessName: '',
    phoneNumber: '',
    preferredDate: '',
    preferredTime: '',
    purpose: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending'
    }

    setAppointments([...appointments, newAppointment])

    // Reset form
    setFormData({
      businessName: '',
      phoneNumber: '',
      preferredDate: '',
      preferredTime: '',
      purpose: ''
    })

    // Simulate AI call
    makeAICall(newAppointment)
  }

  const makeAICall = async (appointment: Appointment) => {
    // Update status to calling
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointment.id
          ? { ...apt, status: 'calling' }
          : apt
      )
    )

    try {
      const response = await fetch('/api/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      })

      const result = await response.json()

      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointment.id
            ? {
                ...apt,
                status: result.success ? 'completed' : 'failed',
                transcript: result.transcript
              }
            : apt
        )
      )
    } catch (error) {
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointment.id
            ? { ...apt, status: 'failed' }
            : apt
        )
      )
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">AI Appointment Caller</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Schedule a Call</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr. Smith's Dental Office"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preferred Date</label>
              <input
                type="date"
                required
                value={formData.preferredDate}
                onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preferred Time</label>
              <input
                type="time"
                required
                value={formData.preferredTime}
                onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Purpose of Visit</label>
              <textarea
                required
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Annual checkup, consultation, etc."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-semibold"
            >
              Schedule AI Call
            </button>
          </form>
        </div>

        {/* Appointments List */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Scheduled Calls</h2>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments scheduled yet</p>
            ) : (
              appointments.map(apt => (
                <div key={apt.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{apt.businessName}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                      apt.status === 'calling' ? 'bg-yellow-100 text-yellow-800' :
                      apt.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {apt.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">📞 {apt.phoneNumber}</p>
                  <p className="text-sm text-gray-600">📅 {apt.preferredDate} at {apt.preferredTime}</p>
                  <p className="text-sm text-gray-600 mt-1">📝 {apt.purpose}</p>

                  {apt.transcript && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Call Transcript:</p>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{apt.transcript}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Fill out the appointment details in the form</li>
          <li>Our AI assistant will call the business on your behalf</li>
          <li>The AI will schedule your appointment using natural conversation</li>
          <li>You'll receive a transcript and confirmation when complete</li>
        </ol>
      </div>
    </main>
  )
}
