import { FocusCards } from "../ui/Focus-card";

export function FocusCardsDemo() {
  const cards = [
    {
      title: "Forest Adventure",
      src: "/image.jpg",
    },
    {
      title: "Valley of life",
      src: "/image.jpg",
    },
    {
      title: "Sala behta hi jayega",
      src: "/image.jpg",
    },
    {
      title: "Camping is for pros",
      src: "/image.jpg",
    },
    {
      title: "The road not taken",
      src: "/image.jpg",
    },
    {
      title: "The First Rule",
      src: "/image.jpg",
    },
  ];

  return <FocusCards cards={cards} />;
}
