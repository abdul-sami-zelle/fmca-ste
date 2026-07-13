import BookAppointmentClient from "@/UI/Components/BookAppointmentClient/BookAppointmentClient";

export async function generateMetadata() {
  return {
    title: "Book An Appointment | Furniture Mecca",
    description: "Book An Appointment | Furniture Mecca",
    alternates: {
      canonical: `https://myfurnituremecca.com/book-an-appointment`,
    },
    openGraph: {
      title: "Book An Appointment | Furniture Mecca",
      description: "Book An Appointment | Furniture Mecca",
      url: "https://myfurnituremecca.com/book-an-appointment",
      images: [
        {
          url: "/favicon.png", // ✅ static fallback image
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

export default function BookAppointment({ params }) {
  return <BookAppointmentClient params={params} />
}