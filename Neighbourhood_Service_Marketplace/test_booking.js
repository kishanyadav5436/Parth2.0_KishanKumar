const http = require('http');

async function runTest() {
  console.log("Starting test...");
  try {
    // 1. Get services to find a service ID
    const resServices = await fetch('http://localhost:5000/api/services');
    const services = await resServices.json();
    if (services.length === 0) {
      console.log("No services available. Please run the seed script.");
      return;
    }
    const targetService = services[0];
    console.log(`Found service: ${targetService.title} (ID: ${targetService._id})`);

    // 2. Login as seeded customer
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer1.seed@example.com', password: 'password123' })
    });
    
    // Get the authentication cookie
    const cookies = loginRes.headers.get('set-cookie');
    console.log("Logged in successfully. Cookie obtained.");

    // 3. Create a booking with a payment method (e.g. UPI)
    console.log("Creating booking with paymentMethod: 'upi'");
    const bookRes = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies 
      },
      body: JSON.stringify({
        serviceId: targetService._id,
        date: "2026-04-10",
        timeSlot: "10:00 AM",
        description: "Test description",
        phone: "1234567890",
        address: "Test Address",
        paymentMethod: "upi"
      })
    });
    
    const bookData = await bookRes.json();
    
    if (bookRes.ok && bookData.booking.paymentMethod === 'upi') {
      console.log("✅ SUCCESS! Booking created and paymentMethod 'upi' successfully stored in the database.");
    } else {
      console.error("❌ FAILED! Booking response:", bookData);
    }
  } catch (err) {
    console.error("Test failed due to an error:", err);
  }
}

runTest();
