import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const appointment = await request.json()

    // Simulate a delay for the call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate a realistic transcript simulation
    return NextResponse.json({
      success: true,
      transcript: `AI Assistant: Hello, this is an AI scheduling assistant calling on behalf of a patient. I'd like to schedule an appointment please.

Receptionist: Of course! What date and time works best?

AI Assistant: We're looking for ${appointment.preferredDate} at ${appointment.preferredTime} for ${appointment.purpose}.

Receptionist: Let me check... Yes, that time is available. Can I have the patient's name?

AI Assistant: The appointment has been requested through our system. The patient will provide their details when they arrive or call to confirm.

Receptionist: Perfect! I've scheduled it for ${appointment.preferredDate} at ${appointment.preferredTime}.

AI Assistant: Thank you so much for your help. Have a great day!

Receptionist: You too, goodbye!`,
      appointmentConfirmed: true,
      message: 'Appointment successfully scheduled (demo mode)'
    })
  } catch (error) {
    console.error('Error making call:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to make call'
    }, { status: 500 })
  }
}

export const runtime = 'edge'
