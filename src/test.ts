import prisma from "./lib/prisma";

import {
  createPatient,
  getPatient,
  searchPatients,
  updatePatientPhone,
  deletePatient,
} from "./patients";

import {
  createDoctor,
  getDoctor,
  listDoctorsBySpecialty,
  deleteDoctor,
} from "./doctors";

import {
  bookAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
  setAppointmentStatus,
  cancelAllPatientAppointments,
  deleteAppointment,
} from "./appointments";

async function main() {
  console.log("── Patients ──────────────────────────");

  // Create patient
  const patient = await createPatient({
    name: "Test Patient",
    email: "test.patient@example.com",
    phone: "9999999999",
  });

  console.log("Created:", patient.name, patient.id);

  // Get patient
  const found = await getPatient(patient.id);
  console.log("Found:", found.name);

  // Update phone
  const updated = await updatePatientPhone(
    patient.id,
    "8888888888"
  );

  console.log("Updated phone:", updated.phone);

  // Search patients
  const results = await searchPatients("Test");
  console.log("Search results:", results.length);

  console.log("── Doctors ───────────────────────────");

  // Create doctor
  const doctor = await createDoctor({
    name: "Dr. Test",
    specialty: "General Medicine",
    email: "dr.test@hospital.io",
  });

  console.log("Created:", doctor.name, doctor.id);

  // Get doctor
  const foundDoctor = await getDoctor(doctor.id);
  console.log("Found:", foundDoctor.name);

  // Search doctors by specialty
  const specialists = await listDoctorsBySpecialty("General");

  console.log(
    "General Medicine doctors:",
    specialists.length
  );

  console.log("── Appointments ──────────────────────");

  // Use a future date so the appointment appears
  // in getDoctorUpcomingAppointments()
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);

  // Book appointment
  const appt = await bookAppointment(
    patient.id,
    doctor.id,
    futureDate,
    "Initial consultation"
  );

  console.log(
    "Booked:",
    appt.id,
    "for",
    appt.patient.name
  );

  // Get appointment with full patient + doctor data
  const full = await getAppointmentFull(appt.id);

  console.log(
    "Full fetch:",
    full.patient.name,
    "with",
    full.doctor.name
  );

  // Get doctor's upcoming appointments
  const schedule =
    await getDoctorUpcomingAppointments(doctor.id);

  console.log(
    "Doctor schedule:",
    schedule.length,
    "appointment(s)"
  );

  // Cancel all scheduled appointments for patient
  const cancelledCount =
    await cancelAllPatientAppointments(patient.id);

  console.log(
    "Cancelled patient appointments:",
    cancelledCount
  );

  // Change appointment status
  const cancelled = await setAppointmentStatus(
    appt.id,
    "cancelled"
  );

  console.log(
    "Status updated to:",
    cancelled.status
  );

  console.log("── Cleanup ───────────────────────────");

  // Delete appointment
  await deleteAppointment(appt.id);
  console.log("Appointment deleted.");

  // Delete patient
  await deletePatient(patient.id);
  console.log("Patient deleted.");

  // Delete doctor
  await deleteDoctor(doctor.id);
  console.log("Doctor deleted.");

  console.log("Test data cleaned up.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());