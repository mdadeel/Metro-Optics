import { NextRequest, NextResponse } from 'next/server';

// Mock prescription data (in a real application, this would come from a database)
const mockPrescriptions = [
  {
    id: 1,
    userId: 1,
    name: 'Saiful Islam',
    phone: '+880 1712 345678',
    email: 'saiful@example.com',
    doctorName: 'Dr. Ahmed',
    hospitalName: 'Dhaka Eye Hospital',
    testDate: '2024-09-15',
    notes: 'Regular checkup, no changes needed',
    prescriptionData: {
      rightEye: {
        sphere: -2.0,
        cylinder: -0.5,
        axis: 180,
        add: 1.0,
        prism: null,
        base: null
      },
      leftEye: {
        sphere: -2.5,
        cylinder: -0.75,
        axis: 175,
        add: 1.0,
        prism: null,
        base: null
      },
      pd: 62
    },
    status: 'approved',
    uploadDate: '2024-09-16',
    fileUrl: '/api/prescriptions/1/file',
    fileName: 'prescription_2024_09_15.pdf'
  },
  {
    id: 2,
    userId: 1,
    name: 'Saiful Islam',
    phone: '+880 1712 345678',
    email: 'saiful@example.com',
    doctorName: 'Dr. Fatima',
    hospitalName: 'Vision Care Center',
    testDate: '2024-07-10',
    notes: 'Slight change in prescription',
    prescriptionData: {
      rightEye: {
        sphere: -1.5,
        cylinder: -0.25,
        axis: 170,
        add: 0.75,
        prism: null,
        base: null
      },
      leftEye: {
        sphere: -2.0,
        cylinder: -0.5,
        axis: 175,
        add: 0.75,
        prism: null,
        base: null
      },
      pd: 61
    },
    status: 'archived',
    uploadDate: '2024-07-12',
    fileUrl: '/api/prescriptions/2/file',
    fileName: 'prescription_2024_07_10.pdf'
  },
  {
    id: 3,
    userId: 2,
    name: 'Fatima Rahman',
    phone: '+880 1812 345678',
    email: 'fatima@example.com',
    doctorName: 'Dr. Hassan',
    hospitalName: 'Optical Clinic',
    testDate: '2024-10-01',
    notes: 'First time prescription for contact lenses',
    prescriptionData: {
      rightEye: {
        sphere: -1.0,
        cylinder: -0.25,
        axis: 10,
        add: null,
        prism: null,
        base: null
      },
      leftEye: {
        sphere: -1.25,
        cylinder: -0.5,
        axis: 5,
        add: null,
        prism: null,
        base: null
      },
      pd: 63
    },
    status: 'approved',
    uploadDate: '2024-10-02',
    fileUrl: '/api/prescriptions/3/file',
    fileName: 'contact_prescription.pdf'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    // Filter prescriptions based on query params
    let prescriptions = mockPrescriptions;
    
    if (userId) {
      prescriptions = prescriptions.filter(p => p.userId === parseInt(userId));
    }
    
    if (status) {
      prescriptions = prescriptions.filter(p => p.status === status);
    }
    
    return NextResponse.json({
      prescriptions,
      total: prescriptions.length
    });
  } catch (error) {
    console.error('Prescriptions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.phone || !body.prescriptionData) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, prescriptionData' },
        { status: 400 }
      );
    }
    
    // Create new prescription
    const newPrescription = {
      id: mockPrescriptions.length + 1,
      ...body,
      status: 'pending', // New prescriptions start as pending
      uploadDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    };
    
    // Add to mock data (in a real app, save to DB)
    mockPrescriptions.push(newPrescription);
    
    return NextResponse.json(newPrescription, { status: 201 });
  } catch (error) {
    console.error('Prescriptions API POST error:', error);
    return NextResponse.json(
      { error: 'Failed to submit prescription' },
      { status: 500 }
    );
  }
}