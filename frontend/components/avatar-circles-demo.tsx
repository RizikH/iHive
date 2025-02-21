import { AvatarCircles } from "@/components/magicui/avatar-circles"

const avatars = [
  {
    imageUrl: "/Images/sample.jpeg",
    profileUrl: "#",
  },
  {
    imageUrl: "/Images/sample.jpeg",
    profileUrl: "#",
  },
  {
    imageUrl: "/Images/sample.jpeg",
    profileUrl: "#",
  },
  {
    imageUrl: "/Images/sample.jpeg",
    profileUrl: "#",
  },
  {
    imageUrl: "/Images/sample.jpeg",
    profileUrl: "#",
  },
  {
    imageUrl: "/Images/sample.jpeg",
    profileUrl: "#",
  },
]

export default function AvatarCirclesDemo() {
  return <AvatarCircles numPeople={99} avatarUrls={avatars} />
}

