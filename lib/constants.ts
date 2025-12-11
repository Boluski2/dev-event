export type EventItem = {
  image: string
  title: string
  slug: string
  location: string
  date: string
  time: string
}

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "React Summit 2026",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "April 22-24, 2026",
    time: "09:00 - 18:00",
  },
  {
    image: "/images/event2.png",
    title: "JSConf US 2026",
    slug: "jsconf-us-2026",
    location: "Salt Lake City, UT, USA",
    date: "June 4-6, 2026",
    time: "09:30 - 17:30",
  },
  {
    image: "/images/event3.png",
    title: "Google I/O 2026",
    slug: "google-io-2026",
    location: "Mountain View, CA, USA",
    date: "May 19-21, 2026",
    time: "10:00 - 19:00",
  },
  {
    image: "/images/event4.png",
    title: "WWDC 2026",
    slug: "wwdc-2026",
    location: "Apple Park, Cupertino, CA, USA",
    date: "June 8-12, 2026",
    time: "Varies",
  },
  {
    image: "/images/event5.png",
    title: "HackMIT 2026",
    slug: "hackmit-2026",
    location: "Cambridge, MA, USA",
    date: "September 27-29, 2026",
    time: "24-hour hackathon",
  },
  {
    image: "/images/event6.png",
    title: "ng-conf 2026",
    slug: "ng-conf-2026",
    location: "Salt Lake City, UT, USA",
    date: "March 3-5, 2026",
    time: "09:00 - 17:00",
  },
//    {
//     image: "/images/event6.png",
//     title: "React Europe 2026",
//     slug: "react-europe-2026",
//     location: "Paris, France",
//     date: "May 6-8, 2026",
//     time: "09:00 - 18:00",
//   },
]
